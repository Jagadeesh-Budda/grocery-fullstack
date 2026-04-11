# Backend Audit and Error Handling

This section explains the audit support and exception handling implementation in the backend.

## Audit support

The audit system is built around admin mutation tracing. It captures before/after snapshots for audited entities and stores them in the `audit_log` table.

### `AuditLog.java`

`AuditLog` is the JPA entity that stores audit records.

```java
@Entity
@Table(name = "audit_log")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
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

Why it exists:
- stores who changed what and when,
- keeps before/after snapshots for audit review,
- decouples audit history from business entities.

### `AdminAuditAspect.java`

This aspect intercepts methods annotated with `@AdminAuditMutation` and writes audit logs for admin actions.

```java
@Around("@annotation(com.example.groceries.audit.AdminAuditMutation)")
public Object auditMutation(ProceedingJoinPoint pjp) throws Throwable {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (!isAdmin(auth)) {
        return pjp.proceed();
    }

    MethodSignature sig = (MethodSignature) pjp.getSignature();
    Method method = sig.getMethod();
    AdminAuditMutation ann = method.getAnnotation(AdminAuditMutation.class);

    Object idBefore = evalSpel(ann.entityIdBefore(), sig.getParameterNames(), args, null);
    String beforeJson = ...;
    Object result = pjp.proceed();
    Object idAfter = evalSpel(ann.entityIdAfter(), sig.getParameterNames(), args, result);
    String afterJson = ...;

    auditLogService.record(...);
    return result;
}
```

Why it exists:
- separates audit behavior from business logic,
- automatically audits admin methods without manual log calls,
- prevents audit failures from breaking the main operation.

Key behavior:
- only admins are audited (`isAdmin(auth)`),
- before/after snapshots are generated for non-create/delete operations,
- entity IDs can be extracted from method args or the returned result.

### `AdminAuditMutation.java`

This annotation marks methods whose changes should be audited.

```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface AdminAuditMutation {
    String entity();
    Class<?> entityClass();
    String entityIdBefore() default "";
    String entityIdAfter() default "";
    Operation operation();

    enum Operation {
        CREATE,
        UPDATE,
        DELETE
    }
}
```

Why it exists:
- declares audit metadata in one place,
- makes admin audit rules explicit and readable,
- supports SpEL expressions for flexible ID extraction.

### `AuditSnapshotter.java` and `AuditJson.java`

These classes turn JPA entities into serializable snapshots.

`AuditSnapshotter` reads entity fields, skips collection relationships, and converts nested entity relationships into `fieldNameId` values.

`AuditJson` uses Jackson to produce stable JSON from the snapshot map.

Why they exist:
- they create compact, readable audit records,
- they avoid loading full collections or lazy proxies,
- they store only the important state needed for review.

### `AdminAuditLogService.java`

This service queries saved audit logs using dynamic filters and returns DTO pages.

Why it exists:
- provides a dedicated layer for audit retrieval,
- hides query details from the controller,
- maps `AuditLog` entities to admin-friendly DTOs.

### `AdminAuditLogController.java`

This controller exposes paged audit logs under `/api/admin/audit-logs`.

Why it exists:
- lets administrators inspect audit history,
- supports filtering by entity, entityId, actor, and date range,
- is protected by admin-only security rules.

## Exception handling

The backend uses a centralized `RestControllerAdvice` to convert exceptions into consistent HTTP responses.

### `GlobalExceptionHandler.java`

The real handler covers validation, data integrity, order creation errors, not-found resources, illegal arguments, illegal state, and generic runtime failures.

Example:

```java
@ExceptionHandler(MethodArgumentNotValidException.class)
public ResponseEntity<Map<String, Object>> handleMethodArgumentNotValid(MethodArgumentNotValidException ex) {
    HttpStatus status = HttpStatus.BAD_REQUEST;
    Map<String, Object> body = baseErrorBody(status, "Validation failed");
    Map<String, String> fieldErrors = new HashMap<>();
    ex.getBindingResult().getFieldErrors()
            .forEach(err -> fieldErrors.put(err.getField(), err.getDefaultMessage()));
    body.put("fieldErrors", fieldErrors);
    return new ResponseEntity<>(body, status);
}

@ExceptionHandler(DataIntegrityViolationException.class)
public ResponseEntity<Map<String, Object>> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
    String message = ex.getMostSpecificCause() != null ? ex.getMostSpecificCause().getMessage() : ex.getMessage();
    if (message != null && message.toLowerCase().contains("uq_products_slug")) {
        return createErrorResponse(HttpStatus.CONFLICT, "slug already exists");
    }
    return createErrorResponse(HttpStatus.CONFLICT, "Data constraint violation");
}

@ExceptionHandler(OrderCreateException.class)
public ResponseEntity<Map<String, Object>> handleOrderCreateException(OrderCreateException ex) {
    HttpStatus status = switch (ex.getCode()) {
        case EMPTY_CART -> HttpStatus.BAD_REQUEST;
        case OUT_OF_STOCK, PRICE_MISMATCH -> HttpStatus.CONFLICT;
    };
    Map<String, Object> body = baseErrorBody(status, ex.getMessage());
    body.put("code", ex.getCode().name());
    return new ResponseEntity<>(body, status);
}
```

Why this matters:
- clients receive consistent error JSON instead of stack traces,
- validation failures return field-specific messages,
- domain-specific errors such as order creation failures use proper HTTP status codes.

### Custom exception classes
- `ResourceNotFoundException.java` — thrown when an entity is missing,
- `OrderCreateException.java` — thrown for cart or order creation failures,
- `OrderCreateErrorCode` — provides structured error codes such as `EMPTY_CART`, `OUT_OF_STOCK`, and `PRICE_MISMATCH`.

## Why audit and exception handling matter

- Audit logging provides accountability and an actionable change history.
- Centralized exception handling keeps controller code simple and API responses predictable.
- The design separates cross-cutting concerns from business logic, making maintenance easier.
