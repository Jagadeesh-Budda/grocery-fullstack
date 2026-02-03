package com.example.groceries.repository;

import com.example.groceries.model.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import jakarta.persistence.EntityManager;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase
@ActiveProfiles("test")
class HomeDashboardRepositoryTest {

    @Autowired
    private HomeDashboardRepository homeDashboardRepository;

    @Autowired
    private EntityManager em;

    private User persistUser(String username) {
        User u = new User();
        u.setUsername(username);
        u.setEmail(username + "@example.com");
        u.setPassword("pw");
        u.setRole(Role.ROLE_USER);
        em.persist(u);
        return u;
    }

    private Category persistCategory(String name) {
        Category c = new Category();
        c.setName(name);
        c.setImageUrl("img");
        c.setActive(true);
        em.persist(c);
        return c;
    }

    private ProductMaster persistMaster(Category c, String name, boolean active, int lowStockThreshold) {
        ProductMaster pm = new ProductMaster();
        pm.setName(name);
        pm.setDescription("desc");
        pm.setImageUrl("img");
        pm.setImages(List.of("img"));
        pm.setActive(active);
        pm.setCategory(c);
        em.persist(pm);

        // low_stock_threshold is a schema column added via migration; entity doesn't map it.
        em.createNativeQuery("UPDATE product_masters SET low_stock_threshold = ? WHERE id = ?")
                .setParameter(1, lowStockThreshold)
                .setParameter(2, pm.getId())
                .executeUpdate();

        return pm;
    }

    private ProductVariant persistVariant(ProductMaster pm, String name, int stock) {
        ProductVariant v = new ProductVariant();
        v.setVariantName(name);
        v.setUnit("1kg");
        v.setImageUrl("img");
        v.setMrp(new BigDecimal("100.00"));
        v.setDiscountPercent(0);
        v.setStock(stock);
        v.setProductMaster(pm);
        em.persist(v);
        return v;
    }

    private Order persistOrder(User u, OrderStatus status, LocalDateTime createdAt) {
        Order o = new Order();
        o.setUser(u);
        o.setStatus(status);
        o.setCreatedAt(createdAt);
        o.setTotalAmount(new BigDecimal("1.00"));
        em.persist(o);
        return o;
    }

    private void addItem(Order o, ProductVariant v, int qty) {
        OrderItem oi = new OrderItem();
        oi.setVariant(v);
        oi.setProductId(v.getProductMaster().getId());
        oi.setProductName(v.getProductMaster().getName());
        oi.setVariantName(v.getVariantName());
        oi.setQuantity(qty);
        oi.setPrice(new BigDecimal("10.00"));
        oi.setSubtotal(new BigDecimal("10.00").multiply(BigDecimal.valueOf(qty)));

        o.addOrderItem(oi);
        em.persist(oi);
    }

    @Test
    void monthlyUsage_sumsQuantitiesCorrectly_onlyCompletedOrders_onlySince() {
        Category cat = persistCategory("Veg");
        User u = persistUser("u1");

        ProductMaster pm1 = persistMaster(cat, "Apple", true, 2);
        ProductVariant v1 = persistVariant(pm1, "Apple 1kg", 10);

        ProductMaster pm2 = persistMaster(cat, "Banana", true, 2);
        ProductVariant v2 = persistVariant(pm2, "Banana 1kg", 10);

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime since = now.minusDays(30);

        // within window (count)
        Order o1 = persistOrder(u, OrderStatus.CONFIRMED, now.minusDays(5));
        addItem(o1, v1, 2);
        addItem(o1, v1, 1);
        addItem(o1, v2, 4);

        // within window but not completed (ignore)
        Order o2 = persistOrder(u, OrderStatus.CREATED, now.minusDays(3));
        addItem(o2, v1, 100);

        // outside window (ignore)
        Order o3 = persistOrder(u, OrderStatus.DELIVERED, now.minusDays(45));
        addItem(o3, v1, 7);

        em.flush();
        em.clear();

        List<MonthlyUsageProjection> rows = homeDashboardRepository.findMonthlyUsage(u.getId(), since);

        assertThat(rows)
                .extracting(MonthlyUsageProjection::getProductVariantId)
                .containsExactlyInAnyOrder(v1.getId(), v2.getId());

        MonthlyUsageProjection r1 = rows.stream().filter(r -> r.getProductVariantId().equals(v1.getId())).findFirst().orElseThrow();
        MonthlyUsageProjection r2 = rows.stream().filter(r -> r.getProductVariantId().equals(v2.getId())).findFirst().orElseThrow();

        assertThat(r1.getTotalQuantity()).isEqualTo(3L);
        assertThat(r2.getTotalQuantity()).isEqualTo(4L);
    }

    @Test
    void buyAgain_returnsMax3_sortedCorrectly_excludesOutOfStock() {
        Category cat = persistCategory("Veg");
        User u = persistUser("u2");

        ProductMaster pmA = persistMaster(cat, "A", true, 1);
        ProductVariant vA = persistVariant(pmA, "A1", 10);

        ProductMaster pmB = persistMaster(cat, "B", true, 1);
        ProductVariant vB = persistVariant(pmB, "B1", 10);

        ProductMaster pmC = persistMaster(cat, "C", true, 1);
        ProductVariant vC = persistVariant(pmC, "C1", 10);

        ProductMaster pmD = persistMaster(cat, "D", true, 1);
        ProductVariant vD = persistVariant(pmD, "D1", 10);

        ProductMaster pmOut = persistMaster(cat, "OUT", true, 1);
        ProductVariant vOut = persistVariant(pmOut, "OUT1", 0);

        LocalDateTime t1 = LocalDateTime.now().minusDays(10);
        LocalDateTime t2 = LocalDateTime.now().minusDays(5);
        LocalDateTime t3 = LocalDateTime.now().minusDays(1);

        // vA: 3 items, last at t2
        Order o1 = persistOrder(u, OrderStatus.CONFIRMED, t1);
        addItem(o1, vA, 1);
        addItem(o1, vA, 1);
        Order o2 = persistOrder(u, OrderStatus.DELIVERED, t2);
        addItem(o2, vA, 1);

        // vB: 3 items, last at t3  -> should rank above vA due to lastOrderedAt
        Order o3 = persistOrder(u, OrderStatus.DELIVERED, t3);
        addItem(o3, vB, 1);
        addItem(o3, vB, 1);
        addItem(o3, vB, 1);

        // vC: 2 items
        Order o4 = persistOrder(u, OrderStatus.DELIVERED, t2);
        addItem(o4, vC, 1);
        addItem(o4, vC, 1);

        // vD: 1 item
        Order o5 = persistOrder(u, OrderStatus.DELIVERED, t2);
        addItem(o5, vD, 1);

        // out-of-stock should be excluded even if ordered
        Order o6 = persistOrder(u, OrderStatus.DELIVERED, t2);
        addItem(o6, vOut, 5);

        em.flush();
        em.clear();

        List<BuyAgainProjection> rows = homeDashboardRepository.findTop3BuyAgain(u.getId());

        assertThat(rows).hasSize(3);

        assertThat(rows.get(0).getProductVariantId()).isEqualTo(vB.getId());
        assertThat(rows.get(0).getOrderCount()).isEqualTo(3L);

        assertThat(rows.get(1).getProductVariantId()).isEqualTo(vA.getId());
        assertThat(rows.get(1).getOrderCount()).isEqualTo(3L);

        assertThat(rows.get(2).getProductVariantId()).isEqualTo(vC.getId());
        assertThat(rows.get(2).getOrderCount()).isEqualTo(2L);

        assertThat(rows)
                .extracting(BuyAgainProjection::getProductVariantId)
                .doesNotContain(vOut.getId());
    }

    @Test
    void lowStock_includesOnlyActiveProducts_respectsThreshold() {
        Category cat = persistCategory("Veg");

        ProductMaster activeLow = persistMaster(cat, "ActiveLow", true, 5);
        ProductVariant v1 = persistVariant(activeLow, "v1", 5); // included (==)
        ProductVariant v2 = persistVariant(activeLow, "v2", 6); // excluded

        ProductMaster inactive = persistMaster(cat, "Inactive", false, 10);
        ProductVariant v3 = persistVariant(inactive, "v3", 1); // excluded (inactive master)

        em.flush();
        em.clear();

        List<LowStockProjection> rows = homeDashboardRepository.findLowStock();

        assertThat(rows)
                .extracting(LowStockProjection::getProductVariantId)
                .contains(v1.getId())
                .doesNotContain(v2.getId(), v3.getId());

        LowStockProjection row = rows.stream().filter(r -> r.getProductVariantId().equals(v1.getId())).findFirst().orElseThrow();
        assertThat(row.getStock()).isEqualTo(5);
        assertThat(row.getThreshold()).isEqualTo(5);
    }
}
