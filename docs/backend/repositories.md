# Backend Repositories

The `repository` package contains Spring Data JPA interfaces and projection interfaces that access the database.

## How repositories are used

- Repositories define database access methods using Spring Data JPA conventions.
- Services inject repositories to fetch entities and run queries.
- Repositories keep SQL and query logic out of services and controllers.
- Many methods are automatically implemented by Spring Data from method names.
- Custom queries are declared with `@Query` for complex joins, filters, and native SQL.

## Key repository examples

### `UserRepository.java`

This repository provides user lookup and uniqueness checks.

```java
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
}
```

Why this matters:
- `findByUsername` and `findByEmail` are derived query methods that Spring Data implements automatically.
- `existsByUsername` is a simple boolean query useful for sign-up validation.
- No SQL is written in the service layer.

### `ProductMasterRepository.java`

This repository shows both method-name queries and JPQL-based custom queries.

```java
List<ProductMaster> findByCategoryId(Long categoryId);

@Query("""
    SELECT DISTINCT pm
    FROM ProductMaster pm
    LEFT JOIN FETCH pm.variants
    WHERE pm.id = :id
""")
Optional<ProductMaster> findByIdWithVariants(@Param("id") Long id);
```

It also includes a paged admin query:

```java
@EntityGraph(attributePaths = {"category"})
@Query("""
    SELECT pm
    FROM ProductMaster pm
    WHERE (:active IS NULL OR pm.is_active = :active)
      AND (:q IS NULL OR :q = '' OR LOWER(pm.name) LIKE LOWER(CONCAT('%', :q, '%')))
""")
Page<ProductMaster> findAdminProducts(
        @Param("q") String q,
        @Param("active") Boolean active,
        Pageable pageable
);
```

Why this matters:
- `@Query` lets the repository express complex selection logic in JPQL.
- `@EntityGraph` avoids N+1 queries when loading the category relationship.
- The repository uses both read-only and paginated query patterns.

### `ProductListingRepository.java`

This repository uses native SQL for optimized paging across products and variants.

```java
@Query(
        value = """
    WITH paged_products AS (
        SELECT pm.id
                    FROM products pm
                    WHERE pm.is_active = true
        ORDER BY pm.name ASC
        LIMIT :size OFFSET :offset
    )
    SELECT
      pm.id    AS productId,
      pm.name  AS productName,
      c.name   AS category,
      pv.id    AS variantId,
      pv.sku   AS variantName,
      pv.price AS price
    FROM paged_products pp
            JOIN products pm ON pm.id = pp.id
    JOIN product_variants pv ON pv.product_master_id = pm.id
            JOIN categories c ON c.id = pm.category_id
    ORDER BY pm.name ASC, pv.price ASC
""",
        nativeQuery = true
)
List<ProductListView> findProducts(
        @Param("size") int size,
        @Param("offset") int offset
);
```

Why this matters:
- Native SQL is used when JPQL is not enough or when performance matters.
- The repository returns a projection interface instead of full entities.
- `countVariants()` is also defined with native SQL to support pagination.

### `InventoryByStoreRepository.java`

This repository demonstrates native queries for store-level inventory reports.

```java
@Query(
        value = """
            SELECT
                inv.product_variant_id AS variantId,
                v.sku AS variantName,
                pm.id AS productId,
                pm.name AS productName,
                inv.stock AS stock,
                pm.low_stock_threshold AS threshold
            FROM inventory_by_store inv
            JOIN product_variants v ON v.id = inv.product_variant_id
            JOIN products pm ON pm.id = v.product_master_id
            WHERE inv.store_id = :storeId
              AND inv.is_active = true
            ORDER BY pm.name ASC, v.id ASC
        """,
        nativeQuery = true
)
List<AdminStoreInventoryProjection> findStoreInventory(long storeId);
```

Why this matters:
- Shows how repository methods can return projection interfaces for reports.
- Native SQL can join multiple tables and return only the fields needed.

### `InventoryTransactionRepository.java`

This repository returns paged history with optional filters.

```java
@Query(
        value = """
            SELECT
                tx.id AS id,
                tx.created_at AS createdAt,
                tx.type AS type,
                tx.variant_id AS variantId,
                v.sku AS variantName,
                pm.id AS productId,
                pm.name AS productName,
                tx.order_id AS orderId,
                tx.delta AS delta,
                tx.stock_before AS stockBefore,
                tx.stock_after AS stockAfter,
                tx.actor_username AS actorUsername,
                tx.reason AS reason
            FROM inventory_transactions tx
            JOIN product_variants v ON v.id = tx.variant_id
            JOIN products pm ON pm.id = v.product_master_id
            WHERE (:variantId IS NULL OR tx.variant_id = :variantId)
              AND (:orderId IS NULL OR tx.order_id = :orderId)
              AND (:type IS NULL OR tx.type = :type)
            ORDER BY tx.created_at DESC, tx.id DESC
        """,
        countQuery = """
            SELECT COUNT(*)
            FROM inventory_transactions tx
            WHERE (:variantId IS NULL OR tx.variant_id = :variantId)
              AND (:orderId IS NULL OR tx.order_id = :orderId)
              AND (:type IS NULL OR tx.type = :type)
        """,
        nativeQuery = true
)
Page<AdminInventoryTransactionProjection> findAdminHistory(
        @Param("variantId") Long variantId,
        @Param("orderId") Long orderId,
        @Param("type") String type,
        Pageable pageable
);
```

Why this matters:
- Supports advanced admin filtering with dynamic optional parameters.
- Returns paged results using a projection interface.

### `HomeDashboardRepository.java`

This repository is a read-only reporting repository for dashboard queries.

```java
@Query("""
    SELECT
        oi.variant.id AS productVariantId,
        SUM(oi.quantity) AS totalQuantity
    FROM OrderItem oi
    JOIN oi.order o
    WHERE o.user.id = :userId
      AND o.createdAt >= :since
      AND o.status IN (:completedStatuses)
    GROUP BY oi.variant.id
    ORDER BY SUM(oi.quantity) DESC, oi.variant.id ASC
""")
List<MonthlyUsageProjection> findMonthlyUsage(
        @Param("userId") Long userId,
        @Param("since") LocalDateTime since,
        @Param("completedStatuses") List<OrderStatus> completedStatuses
);
```

Why this matters:
- Uses JPQL and projections for dashboard aggregation.
- Includes a default method that reduces service-layer complexity.

Example native query from the same repository:

```java
@Query(
        value = """
            SELECT
                oi.product_variant_id AS productVariantId,
                COUNT(oi.id) AS orderCount,
                MAX(o.created_at) AS lastOrderedAt
            FROM order_items oi
            JOIN orders o ON o.id = oi.order_id
            JOIN product_variants v ON v.id = oi.product_variant_id
            WHERE o.user_id = :userId
              AND o.status IN ('CONFIRMED','DELIVERED')
              AND v.stock > 0
            GROUP BY oi.product_variant_id
            ORDER BY COUNT(oi.id) DESC, MAX(o.created_at) DESC, oi.product_variant_id ASC
            LIMIT 3
        """,
        nativeQuery = true
)
List<BuyAgainProjection> findTop3BuyAgain(@Param("userId") Long userId);
```

Why this matters:
- Combines SQL ranking and filtering for “buy again” recommendations.
- Shows why projections are useful for read-only reporting.

### `CouponRepository.java`

This repository shows derived lookup and modifying update logic.

```java
Optional<Coupon> findByCodeIgnoreCase(String code);

@Modifying
@Query("""
    UPDATE Coupon c
    SET c.timesUsed = c.timesUsed + 1
    WHERE c.id = :couponId
      AND (c.usageLimit IS NULL OR c.timesUsed < c.usageLimit)
""")
int incrementTimesUsedIfAvailable(@Param("couponId") Long couponId);
```

Why this matters:
- `findByCodeIgnoreCase` is a derived query for case-insensitive lookup.
- `@Modifying` is required for write operations with `@Query`.
- The update preserves coupon limits atomically.

### `OrderRepository.java`

This repository mixes derived queries, counts, and projections.

```java
List<Order> findByUserId(Long userId);
long countByCreatedAtGreaterThanEqual(LocalDateTime since);

@Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.status IN :statuses")
BigDecimal sumTotalAmountByStatusIn(@Param("statuses") Collection<OrderStatus> statuses);
```

For admin summaries:

```java
@Query("""
    SELECT
        o.id as orderId,
        u.email as userEmail,
        o.totalAmount as totalAmount,
        o.status as status,
        o.createdAt as createdAt,
        COUNT(oi.id) as itemsCount
    FROM Order o
    JOIN o.user u
    LEFT JOIN o.orderItems oi
    WHERE (:status IS NULL OR o.status = :status)
        AND (:orderId IS NULL OR o.id = :orderId)
        AND (:email IS NULL OR LOWER(u.email) LIKE LOWER(CONCAT('%', :email, '%')))
    GROUP BY o.id, u.email, o.totalAmount, o.status, o.createdAt
""")
Page<AdminOrderSummaryProjection> findAdminOrderSummaries(
        @Param("status") OrderStatus status,
        @Param("orderId") Long orderId,
        @Param("email") String email,
        Pageable pageable
);
```

Why this matters:
- Supports both simple entity retrieval and rich admin reporting.
- Uses projection interfaces for summary rows.

## Repository categories and purpose

### Entity repositories
- `UserRepository.java` — login, registration, and user lookup.
- `ProductMasterRepository.java` — product catalog and admin product queries.
- `ProductVariantRepository.java` — variant-specific inventory and pricing queries.
- `CategoryRepository.java` — category listing and lookup.
- `CartRepository.java` — shopping cart session storage.
- `CartItemRepository.java` — item-level cart operations.
- `OrderRepository.java` — order retrieval, reporting, and summary queries.
- `OrderItemRepository.java` — order item persistence.
- `CouponRepository.java` — coupon validation and usage updates.
- `InventoryByStoreRepository.java` — store-level stock reports.
- `InventoryTransactionRepository.java` — audit of stock changes.
- `StoreRepository.java` — store metadata and lookup.
- `HomeDashboardRepository.java` — dashboard aggregations and recommendations.
- `ProductListingRepository.java` — native SQL product listing optimized for a large catalog.

### Projection interfaces
- `AdminInventoryTransactionProjection.java` — transaction history fields.
- `AdminLowStockInventoryProjection.java` — low-stock inventory summary.
- `AdminOrderSummaryProjection.java` — order summary for admin tables.
- `AdminStoreInventoryProjection.java` — store inventory row data.
- `BuyAgainProjection.java` — recommended buy-again products.
- `MonthlyUsageProjection.java` — monthly usage totals.
- `LowStockProjection.java` — low stock alert fields.

## Why repositories matter

- They provide a stable, typed API for data access.
- They avoid spreading SQL and query logic across services.
- They support method name queries, JPQL, native queries, and projections.
- They make the backend easier to maintain and easier for beginners to extend.

## Beginner tips

- Prefer derived methods (`findBy...`) for simple lookups.
- Use `@Query` when you need joins, grouping, or custom filtering.
- Use projections for DTO-like query results instead of returning full entities.
- Put all custom database logic in repositories, not services.
- Remember to use `@Modifying` for update/delete queries.
