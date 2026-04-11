# Backend Services

The `service` package contains the backend business logic. Controllers call services to validate input, orchestrate repositories, calculate values, and build DTOs.

## UserService.java

`UserService` centralizes user creation, lookup, and password handling.

Example:

```java
public User registerUser(String username, String email, String password) {
    User user = new User();
    user.setUsername(username);
    user.setEmail(email);
    user.setPassword(passwordEncoder.encode(password));
    user.setRole(Role.ROLE_USER);
    return userRepository.save(user);
}
```

Why this matters:
- Password encoding is done here, not in the controller.
- The service sets the default user role.
- `findByUsername` and `findByEmail` are simple repository delegations used by auth flows.

## CartService.java

`CartService` manages cart creation, merging, updates, and summary calculation.

Example: get or create cart

```java
public Cart getOrCreateCart(Long userId) {
    Cart cart = cartRepository.findByUserId(userId)
            .orElseGet(() -> {
                User user = userRepository.findById(userId)
                        .orElseThrow(() -> new RuntimeException("User not found"));
                Cart c = new Cart();
                c.setUser(user);
                c.setItems(new ArrayList<>());
                return cartRepository.save(c);
            });

    if (cart.getItems() == null) {
        cart.setItems(new ArrayList<>());
    }
    return cart;
}
```

Example: add item to cart

```java
public Cart addItem(Long userId, Long variantId, Integer quantity) {
    Cart cart = getOrCreateCart(userId);
    ProductVariant variant = productVariantRepository.findById(variantId)
            .orElseThrow(() -> new RuntimeException("Variant not found"));
    int qty = quantity != null && quantity > 0 ? quantity : 1;
    Optional<CartItem> existing = cart.getItems().stream()
            .filter(i -> i.getProductVariant().getId().equals(variantId))
            .findFirst();
    if (existing.isPresent()) {
        existing.get().setQuantity(existing.get().getQuantity() + qty);
    } else {
        CartItem item = new CartItem();
        item.setCart(cart);
        item.setProductVariant(variant);
        item.setQuantity(qty);
        cart.getItems().add(item);
    }
    return cartRepository.save(cart);
}
```

Example: calculate summary

```java
@Transactional(readOnly = true)
public CartSummaryResponse getSummary(Long userId) {
    Cart cart = getOrCreateCart(userId);
    BigDecimal total = BigDecimal.ZERO;
    int count = 0;
    for (CartItem item : cart.getItems()) {
        total = total.add(item.getProductVariant().getPrice()
                .multiply(BigDecimal.valueOf(item.getQuantity())));
        count += item.getQuantity();
    }
    return new CartSummaryResponse(count, total);
}
```

Why this matters:
- Business rules like quantity merging and cart initialization stay in the service.
- DTO conversion is separate from controller logic.
- Transactions ensure multi-step cart updates are atomic.

## ProductService.java

`ProductService` exposes shopping product behavior and catalog queries.

Example: paged user products

```java
public Page<UserProductDTO> getUserProducts(Pageable pageable) {
    Page<ProductVariant> page = productVariantRepository.findActiveVariants(pageable);
    return page.map(productMapper::toUserProductDTO);
}
```

Example: recommended products

```java
public List<UserProductDTO> getRecommendations(Long productId, Long userId) {
    ProductMaster product = productMasterRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));
    List<ProductMaster> sameCategoryProducts = productMasterRepository.findByCategoryId(product.getCategory().getId());
    Set<Long> productsInCart = cartRepository.findByUserId(userId)
            .map(Cart::getItems)
            .orElse(Collections.emptyList())
            .stream()
            .map(item -> item.getProductVariant().getProductMaster().getId())
            .collect(Collectors.toSet());
    return sameCategoryProducts.stream()
            .filter(pm -> !pm.getId().equals(productId))
            .filter(pm -> !productsInCart.contains(pm.getId()))
            .filter(pm -> pm.getIs_active() != null && pm.getIs_active())
            .flatMap(pm -> pm.getVariants().stream())
            .limit(5)
            .map(productMapper::toUserProductDTO)
            .collect(Collectors.toList());
}
```

Why this matters:
- Shows how product browsing and recommendation logic live in services.
- Demonstrates DTO mapping from entities.
- Separates query orchestration from controller request handling.

## OrderCreateService.java

`OrderCreateService` handles checkout and cart-to-order conversion.

Example: create order safely

```java
@Transactional
public OrderCreateResponse createOrderSafely(Long userId, String couponCode) {
    Cart cart = cartRepository.findByUserId(userId)
            .orElseThrow(() -> new OrderCreateException(OrderCreateErrorCode.EMPTY_CART, "Cart is empty"));
    User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
    Order order = new Order();
    order.setUser(user);
    order.setStatus(OrderStatus.CREATED);
    order.setCreatedAt(LocalDateTime.now());
    order.setSubtotalAmount(BigDecimal.ZERO);
    order.setDiscountAmount(BigDecimal.ZERO);
    order.setTotalAmount(BigDecimal.ZERO);

    BigDecimal subtotal = BigDecimal.ZERO;
    for (CartItem cartItem : cart.getItems()) {
        ProductVariant variant = productVariantRepository.findById(cartItem.getProductVariant().getId())
                .orElseThrow(() -> new RuntimeException("Variant not found"));
        if (variant.getStock() == null || variant.getStock() < cartItem.getQuantity()) {
            throw new OrderCreateException(OrderCreateErrorCode.OUT_OF_STOCK, "Out of stock for variantId=" + variant.getId());
        }
        BigDecimal lineTotal = variant.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity()));
        OrderItem orderItem = new OrderItem();
        orderItem.setVariant(variant);
        orderItem.setProductId(variant.getProductMaster().getId());
        orderItem.setProductName(variant.getProductMaster().getName());
        orderItem.setVariantName(variant.getVariantName());
        orderItem.setQuantity(cartItem.getQuantity());
        orderItem.setPrice(variant.getPrice());
        orderItem.setSubtotal(lineTotal);
        order.addOrderItem(orderItem);
        subtotal = subtotal.add(lineTotal);
    }
    order.setSubtotalAmount(subtotal);
    BigDecimal discountAmount = BigDecimal.ZERO;
    if (couponCode != null && !couponCode.isBlank()) {
        CouponService.CouponApplication applied = couponService.applyAndConsume(couponCode, subtotal);
        order.setCoupon(applied.coupon());
        discountAmount = applied.discountAmount();
    }
    order.setDiscountAmount(discountAmount);
    order.setTotalAmount(subtotal.subtract(discountAmount).max(BigDecimal.ZERO));
    Order saved = orderRepository.save(order);
    return OrderCreateResponse.builder()
            .orderId(saved.getId())
            .subtotalAmount(saved.getSubtotalAmount())
            .discountAmount(saved.getDiscountAmount())
            .totalAmount(saved.getTotalAmount())
            .couponCode(saved.getCoupon() != null ? saved.getCoupon().getCode() : null)
            .status(saved.getStatus())
            .build();
}
```

Why this matters:
- Complex checkout validation is centralized in one service.
- It loads fresh product pricing before creating line items.
- It applies coupon logic through `CouponService`.

## OrderService.java

`OrderService` manages order lifecycle events and stock adjustments.

Example: update order status

```java
@Transactional
public Order updateOrderStatus(Long orderId, OrderStatus newStatus) {
    Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));
    OrderStatus oldStatus = order.getStatus();
    if (oldStatus == newStatus) {
        return order;
    }
    OrderStatusValidator.validate(oldStatus, newStatus);
    if (newStatus == OrderStatus.CONFIRMED && oldStatus != OrderStatus.CONFIRMED) {
        reduceStockForOrder(order);
    } else if (newStatus == OrderStatus.CANCELLED && (oldStatus == OrderStatus.CONFIRMED || oldStatus == OrderStatus.SHIPPED)) {
        restoreStockForOrder(order);
    }
    order.setStatus(newStatus);
    return orderRepository.save(order);
}
```

Example: reduce stock for order

```java
private void reduceStockForOrder(Order order) {
    for (OrderItem item : order.getOrderItems()) {
        ProductVariant variant = item.getVariant();
        int before = variant.getStock();
        int after = before - item.getQuantity();
        variant.setStock(after);
        productVariantRepository.save(variant);
        inventoryTransactionService.record(
                InventoryTransactionType.ORDER_CONFIRMED,
                variant.getId(),
                order.getId(),
                -item.getQuantity(),
                before,
                after,
                null
        );
    }
}
```

Why this matters:
- Order state transitions have business rules and audit hooks.
- Stock reduction and restoration are done in the service layer.
- The service keeps order lifecycle behavior separate from controllers.

## CategoryService.java

`CategoryService` keeps category management simple.

Example: save category with admin audit

```java
@AdminAuditMutation(
        entity = "Category",
        entityClass = Category.class,
        entityIdBefore = "#category.id",
        entityIdAfter = "#result.id",
        operation = AdminAuditMutation.Operation.UPDATE
)
public Category saveCategory(Category category) {
    return categoryRepository.save(category);
}
```

Why this matters:
- Admin audit annotations are applied in the service.
- The service hides repository details from controllers.

## InventoryService.java

`InventoryService` manages stock reads and adjustments.

Example: adjust stock and record a transaction

```java
@Transactional
@AdminAuditMutation(
        entity = "ProductVariant",
        entityClass = ProductVariant.class,
        entityIdBefore = "#variantId",
        entityIdAfter = "#variantId",
        operation = AdminAuditMutation.Operation.UPDATE
)
public InventoryResponse adjustVariantInventory(Long variantId, InventoryAdjustRequest request) {
    ProductVariant variant = findVariantOrThrow(variantId);
    int currentStock = variant.getStock() != null ? variant.getStock() : 0;
    long newStockLong = (long) currentStock + request.getDelta();
    if (newStockLong < 0) {
        throw new IllegalStateException("Insufficient stock: current=" + currentStock + ", delta=" + request.getDelta());
    }
    variant.setStock((int) newStockLong);
    ProductVariant saved = productVariantRepository.save(variant);
    inventoryTransactionService.record(
            InventoryTransactionType.ADMIN_ADJUSTMENT,
            saved.getId(),
            null,
            request.getDelta(),
            currentStock,
            saved.getStock(),
            null
    );
    return new InventoryResponse(saved.getId(), saved.getStock());
}
```

Why this matters:
- It validates stock changes before persisting them.
- It records inventory transactions for audit and traceability.

## InventoryTransactionService.java

`InventoryTransactionService` writes inventory audit records.

Example:

```java
public void record(InventoryTransactionType type, Long variantId, Long orderId, int delta, int stockBefore, int stockAfter, String reason) {
    InventoryTransaction tx = new InventoryTransaction();
    tx.setType(type);
    tx.setVariantId(variantId);
    tx.setOrderId(orderId);
    tx.setDelta(delta);
    tx.setStockBefore(stockBefore);
    tx.setStockAfter(stockAfter);
    tx.setReason(reason);
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication != null) {
        tx.setActorUsername(authentication.getName());
        if (authentication.getPrincipal() instanceof UserPrincipal up) {
            tx.setActorUserId(up.getId());
        }
    }
    inventoryTransactionRepository.save(tx);
}
```

Why this matters:
- It captures the current user from Spring Security.
- It centralizes inventory audit persistence.

## CouponService.java

`CouponService` checks coupon validity and consumption.

Example: apply and consume coupon

```java
@Transactional
public CouponApplication applyAndConsume(String code, BigDecimal subtotal) {
    Coupon coupon = getByCodeOrThrow(code);
    if (!Boolean.TRUE.equals(coupon.getIs_active())) {
        throw new IllegalStateException("Coupon is inactive");
    }
    if (coupon.getExpiresAt() != null && coupon.getExpiresAt().isBefore(LocalDateTime.now())) {
        throw new IllegalStateException("Coupon has expired");
    }
    BigDecimal discount = subtotal.multiply(BigDecimal.valueOf(coupon.getPercentOff()))
            .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
    int updated = couponRepository.incrementTimesUsedIfAvailable(coupon.getId());
    if (updated != 1) {
        throw new IllegalStateException("Coupon usage limit reached");
    }
    return new CouponApplication(coupon, discount);
}
```

Why this matters:
- Coupon validation is isolated from controller logic.
- The service handles expiration, activity, and usage limits.

## HomeDashboardService.java

`HomeDashboardService` composes read models for the home dashboard.

Example: build dashboard DTO

```java
public HomeDashboardDTO getDashboard(Long userId) {
    return new HomeDashboardDTO(
            monthlyStock(userId),
            buyAgainTop3(userId),
            lowStock(userId)
    );
}
```

Example: use repository projections

```java
public List<BuyAgainDTO> buyAgainTop3(Long userId) {
    List<BuyAgainProjection> rows = homeDashboardRepository.findTop3BuyAgain(userId);
    return rows.stream()
            .map(r -> new BuyAgainDTO(r.getProductVariantId(), r.getOrderCount(), r.getLastOrderedAt()))
            .toList();
}
```

Why this matters:
- It maps repository projections into UI DTOs.
- It keeps dashboard aggregation logic in one place.
- Injecting `Clock` makes time-based behavior testable.

## AdminProductService.java

`AdminProductService` demonstrates a typical admin service with creation, update, and audit annotations.

Example: create a product

```java
@Transactional
@AdminAuditMutation(
        entity = "ProductMaster",
        entityClass = ProductMaster.class,
        entityIdAfter = "#result",
        operation = AdminAuditMutation.Operation.CREATE
)
public Long createProduct(ProductCreateRequest request) {
    Category category = findCategoryOrThrow(request.getCategoryId());
    ProductMaster product = new ProductMaster();
    product.setName(request.getName());
    product.setSlug(request.getSlug());
    product.setDescription(request.getDescription());
    product.setImageUrl(request.getImageUrl());
    product.setIs_active(request.getActive() != null ? request.getActive() : true);
    product.setLowStockThreshold(request.getLowStockThreshold());
    product.setCategory(category);
    return productMasterRepository.save(product).getId();
}
```

Why this matters:
- It shows admin-specific creation logic.
- Audit metadata is attached at the service layer.
- Service methods validate request payloads and relationships.

## Why services matter

- Services implement domain rules, not controllers.
- They provide transactional boundaries.
- They combine repository data into business outputs.
- They make testing easier by isolating business logic.

## Practical notes for beginners

- Keep controllers thin: controllers should call services, not perform business logic.
- Use services to coordinate multiple repositories and DTO construction.
- Put validation, calculation, and auditing in services.
- Keep entity mapping in mapper classes so services remain readable.
