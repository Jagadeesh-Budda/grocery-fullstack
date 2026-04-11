# Backend Models

The `model` package defines domain entities, enums, and audit objects used by JPA and the application.

## Core entities

### `User.java`

`User` represents application users and stores authentication details.

Example:

```java
@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @NotBlank
    @Column(unique = true, nullable = false)
    private String username;

    @NotBlank
    @Email
    @Column(unique = true, nullable = false)
    private String email;

    @NotBlank
    @Column(nullable = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    @NotNull
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
}
```

Why this matters:
- `@Entity` and `@Table` map the class to the `users` table.
- Validation annotations like `@NotBlank` and `@Email` enforce field constraints.
- `@JsonProperty(access = WRITE_ONLY)` prevents serialized responses from exposing passwords.

### `Role.java`

`Role` defines safe, constant role values used by `User`.

Example:

```java
public enum Role {
    ROLE_USER,
    ROLE_ADMIN
}
```

Why this matters:
- Enum types are stored as strings in the database with `@Enumerated(EnumType.STRING)`.
- They make role checks safer than raw strings.

### `Category.java`

`Category` stores product categories and generates slugs automatically.

Example:

```java
@Entity
@Table(name = "categories")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @NotBlank
    @Column(nullable = false, unique = true)
    private String slug;

    @NotBlank
    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull
    @Column(nullable = false)
    private Boolean is_active = true;

    @PrePersist
    void prePersist() {
        if (slug == null || slug.isBlank()) {
            slug = slugify(name);
        }
    }

    private static String slugify(String input) {
        String value = input.trim().toLowerCase(Locale.ROOT);
        value = value.replaceAll("[^a-z0-9]+", "-");
        value = value.replaceAll("-+", "-");
        value = value.replaceAll("(^-)|(-$)", "");
        return value.isBlank() ? null : value;
    }
}
```

Why this matters:
- `@PrePersist` automatically normalizes the slug before saving.
- Categories are a key part of product filtering and storefront navigation.

## Product entities

### `ProductMaster.java`

`ProductMaster` defines the main catalog item and holds shared product data.

Example:

```java
@Entity
@Table(name = "products")
public class ProductMaster {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @Pattern(regexp = "^[a-z0-9]+(?:-[a-z0-9]+)*$")
    @Column(name = "slug", length = 255, unique = true)
    private String slug;

    @NotBlank
    @Column(nullable = false, length = 1000)
    private String description;

    @NotBlank
    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    @NotNull
    @ElementCollection
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id", nullable = false))
    @Column(name = "image_url", nullable = false)
    private List<String> images = new ArrayList<>();

    @NotNull
    @Column(nullable = false)
    private Boolean is_active = true;

    @NotNull
    @Min(0)
    @Max(100000)
    @Column(name = "low_stock_threshold", nullable = false)
    private Integer lowStockThreshold = 5;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @OneToMany(mappedBy = "productMaster", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<ProductVariant> variants = new ArrayList<>();
}
```

Why this matters:
- `@ElementCollection` stores product images in a separate collection table.
- `@OneToMany` links product variants to the product master.
- `lowStockThreshold` is stored as part of the product definition.

### `ProductVariant.java`

`ProductVariant` stores price, stock, discount, and the relationship to a `ProductMaster`.

Example:

```java
@Entity
@Table(name = "product_variants")
public class ProductVariant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(name = "sku", nullable = false)
    private String variantName;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal mrp;

    @NotNull
    @Min(0)
    @Max(100)
    @Column(name = "discount_percent", nullable = false)
    private Integer discountPercent = 0;

    @NotBlank
    @Column(nullable = false)
    private String unit;

    @NotBlank
    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    @NotNull
    @Min(0)
    @Column(nullable = false)
    private Integer stock = 0;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_master_id", nullable = false)
    @JsonBackReference
    private ProductMaster productMaster;

    public BigDecimal getPrice() {
        int discount = (discountPercent != null) ? discountPercent : 0;
        BigDecimal discountAmount = mrp.multiply(BigDecimal.valueOf(discount))
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        return mrp.subtract(discountAmount);
    }
}
```

Why this matters:
- `getPrice()` computes the effective price using discount percentage.
- The entity keeps pricing and stock data close to the variant.
- `@ManyToOne` links the variant back to its master product.

## Shopping cart entities

### `Cart.java`

`Cart` represents the user's current shopping cart.

Example:

```java
@Entity
@Table(name = "carts")
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @JsonManagedReference
    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<CartItem> items = new ArrayList<>();
}
```

Why this matters:
- `@OneToOne` ensures each user has at most one cart.
- `orphanRemoval = true` automatically deletes removed cart items.

### `CartItem.java`

`CartItem` stores a selected variant and quantity.

Example:

```java
@Entity
@Table(name = "cart_items")
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonBackReference
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "product_variant_id", nullable = false)
    private ProductVariant productVariant;

    @NotNull
    @Min(value = 1, message = "Quantity must be at least 1")
    @Column(nullable = false)
    private Integer quantity;
}
```

Why this matters:
- The cart item links to both a cart and a product variant.
- `@ManyToOne(fetch = FetchType.EAGER)` loads variant details immediately, which is useful for cart display.

## Order entities

### `Order.java`

`Order` stores order totals, status, and line items.

Example:

```java
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = true)
    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = true)
    @Column(name = "subtotal_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotalAmount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coupon_id")
    private Coupon coupon;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private OrderStatus status = OrderStatus.CREATED;

    @NotNull
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<OrderItem> orderItems = new ArrayList<>();

    @PrePersist
    @PreUpdate
    private void ensureAmountBreakdown() {
        if (discountAmount == null) {
            discountAmount = BigDecimal.ZERO;
        }
        if (subtotalAmount == null) {
            subtotalAmount = (totalAmount != null) ? totalAmount : BigDecimal.ZERO;
        }
        if (totalAmount == null) {
            totalAmount = subtotalAmount.subtract(discountAmount);
        }
    }

    public void addOrderItem(OrderItem item) {
        orderItems.add(item);
        item.setOrder(this);
    }
}
```

Why this matters:
- `@PrePersist` and `@PreUpdate` ensure totals are consistent.
- `addOrderItem()` keeps the bidirectional relationship in sync.
- The order contains both `subtotalAmount` and `discountAmount` for accurate billing.

### `OrderItem.java`

`OrderItem` stores the product snapshot for each line item.

Example:

```java
@Entity
@Table(name = "order_items")
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    @JsonBackReference
    private Order order;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_variant_id", nullable = false)
    private ProductVariant variant;

    @NotNull
    @Column(name = "product_id", nullable = false)
    private Long productId;

    @NotBlank
    @Column(name = "product_name", nullable = false)
    private String productName;

    @NotBlank
    @Column(name = "variant_name", nullable = false)
    private String variantName;

    @NotNull
    @Min(1)
    @Column(nullable = false)
    private Integer quantity;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;

    @PrePersist
    @PreUpdate
    private void calculateSubtotal() {
        this.subtotal = price.multiply(BigDecimal.valueOf(quantity));
    }
}
```

Why this matters:
- `OrderItem` keeps a snapshot of product details so order history remains stable even if the product later changes.
- `calculateSubtotal()` guarantees line item totals are computed consistently.

## Coupon and inventory models

### `Coupon.java`

`Coupon` stores promotion rules and usage state.

Example:

```java
@Entity
@Table(name = "coupons")
public class Coupon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @NotNull
    @Min(1)
    @Max(100)
    @Column(name = "percent_off", nullable = false)
    private Integer percentOff;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @Column(name = "usage_limit")
    private Integer usageLimit;

    @NotNull
    @Min(0)
    @Column(name = "times_used", nullable = false)
    private Integer timesUsed = 0;

    @NotNull
    @Column(nullable = false)
    private Boolean is_active = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
```

Why this matters:
- It includes both percentage discount and expiration/usage limit.
- The model is used by `CouponService` to validate and consume coupons.

### `InventoryByStore.java`

`InventoryByStore` tracks stock at each physical store.

Example:

```java
@Entity
@Table(name = "inventory_by_store", uniqueConstraints = {
        @UniqueConstraint(name = "uq_inventory_by_store_store_variant", columnNames = {"store_id", "product_variant_id"})
})
public class InventoryByStore {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "store_id", nullable = false)
    private Store store;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_variant_id", nullable = false)
    private ProductVariant productVariant;

    @NotNull
    @Min(0)
    @Column(nullable = false)
    private Integer stock = 0;

    @NotNull
    @Column(nullable = false)
    private Boolean is_active = true;
}
```

Why this matters:
- It supports store-specific stock data for multi-store inventory.
- Unique constraints prevent duplicate store/variant rows.

### `InventoryTransaction.java`

`InventoryTransaction` records stock changes and the actor for audit.

Example:

```java
@Entity
@Table(name = "inventory_transactions")
public class InventoryTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 50)
    private InventoryTransactionType type;

    @NotNull
    @Column(name = "variant_id", nullable = false)
    private Long variantId;

    @Column(name = "order_id")
    private Long orderId;

    @NotNull
    @Column(name = "delta", nullable = false)
    private Integer delta;

    @NotNull
    @Column(name = "stock_before", nullable = false)
    private Integer stockBefore;

    @NotNull
    @Column(name = "stock_after", nullable = false)
    private Integer stockAfter;

    @Column(name = "reason")
    private String reason;

    @Column(name = "actor_username")
    private String actorUsername;

    @Column(name = "actor_user_id")
    private Long actorUserId;
}
```

Why this matters:
- It supports audit trails for stock adjustments.
- It stores both before/after stock values and the user performing the action.

### `Store.java`

`Store` defines physical store metadata.

Example:

```java
@Entity
@Table(name = "stores")
public class Store {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @NotNull
    @Column(nullable = false)
    private Boolean is_active = true;
}
```

Why this matters:
- Store data supports multi-location inventory and admin store management.

### `AuditLog.java`

`AuditLog` stores change history for admin operations.

Example:

```java
@Entity
@Table(name = "audit_log")
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "actor_username")
    private String actorUsername;

    @Column(name = "actor_user_id")
    private Long actorUserId;

    @Column(name = "entity", nullable = false, length = 100)
    private String entity;

    @Column(name = "entity_id", nullable = false, length = 64)
    private String entityId;

    @Column(name = "before_json", length = 100000)
    private String beforeJson;

    @Column(name = "after_json", length = 100000)
    private String afterJson;
}
```

Why this matters:
- It captures a JSON snapshot of before and after state.
- It enables auditing of admin mutations.

## Order state validation

### `OrderStatus.java`

`OrderStatus` defines the allowed lifecycle values for an order.

Example:

```java
public enum OrderStatus {
    PENDING,
    CREATED,
    CONFIRMED,
    PACKED,
    SHIPPED,
    DELIVERED,
    CANCELLED
}
```

Why this matters:
- Enums restrict order statuses to a defined set.
- They are stored as strings with `@Enumerated(EnumType.STRING)`.

### `OrderStatusValidator.java`

`OrderStatusValidator` enforces valid transitions between statuses.

Example:

```java
public class OrderStatusValidator {
    private static final Map<OrderStatus, Set<OrderStatus>> ALLOWED_TRANSITIONS = new EnumMap<>(OrderStatus.class);

    static {
        ALLOWED_TRANSITIONS.put(OrderStatus.CREATED, EnumSet.of(OrderStatus.PENDING, OrderStatus.CANCELLED));
        ALLOWED_TRANSITIONS.put(OrderStatus.PENDING, EnumSet.of(OrderStatus.CONFIRMED, OrderStatus.CANCELLED));
        ALLOWED_TRANSITIONS.put(OrderStatus.CONFIRMED, EnumSet.of(OrderStatus.PACKED, OrderStatus.CANCELLED));
        ALLOWED_TRANSITIONS.put(OrderStatus.PACKED, EnumSet.of(OrderStatus.SHIPPED));
        ALLOWED_TRANSITIONS.put(OrderStatus.SHIPPED, EnumSet.of(OrderStatus.DELIVERED));
        ALLOWED_TRANSITIONS.put(OrderStatus.DELIVERED, EnumSet.noneOf(OrderStatus.class));
        ALLOWED_TRANSITIONS.put(OrderStatus.CANCELLED, EnumSet.noneOf(OrderStatus.class));
    }

    public static void validate(OrderStatus currentStatus, OrderStatus nextStatus) {
        if (currentStatus == nextStatus) {
            return;
        }
        Set<OrderStatus> allowedNextStatuses = ALLOWED_TRANSITIONS.getOrDefault(currentStatus, EnumSet.noneOf(OrderStatus.class));
        if (!allowedNextStatuses.contains(nextStatus)) {
            throw new IllegalStateException("Invalid status transition from " + currentStatus + " to " + nextStatus);
        }
    }
}
```

Why this matters:
- It prevents invalid order state changes at the service layer.
- It makes order processing rules explicit and maintainable.

## How models fit together

- `User` owns `Cart` and `Order` records.
- `ProductMaster` groups multiple `ProductVariant`s.
- `CartItem` references a `ProductVariant` and belongs to a `Cart`.
- `OrderItem` references a `ProductVariant`, stores product snapshot fields, and belongs to an `Order`.
- `InventoryByStore` links `Store` and `ProductVariant` stock levels.
- `InventoryTransaction` records every stock change for audit.

## Why models matter

- Models define the database schema and business data structure.
- They combine persistence annotations, validation, and lifecycle hooks.
- Clear model design makes it easier to reason about services and controllers.
- Builders, enums, and validators help keep the domain consistent and safe.
