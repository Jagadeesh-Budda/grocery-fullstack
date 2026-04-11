# Backend Database and Migrations

This backend uses **PostgreSQL** as its primary database and **Flyway** for schema migrations.

## Database configuration

### `application.properties`
- Defines the database connection:
  - `spring.datasource.url`
  - `spring.datasource.username`
  - `spring.datasource.password`
- Controls JPA and Hibernate settings such as SQL logging, DDL auto, and timezone handling.
- Enables Flyway migrations using `spring.flyway.locations`.

Example configuration from `application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/groceriesdb
spring.datasource.username=pguser
spring.datasource.password=pgpass
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=validate
spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration/common
```

This shows:
- the database connection details used in development,
- that Hibernate validates the schema rather than generating it,
- and that Flyway runs migration scripts from the classpath.

### `docker-compose.yml`
- Starts a PostgreSQL container on port `5432`.
- Uses the `pgdata` Docker volume for persistent storage.
- Provides environment variables for the backend database connection.
- Why it exists: to make local development environments reproducible and portable.

## Flyway migration files

Flyway migration scripts are stored in:

- `springboot-groceries/src/main/resources/db/migration/common/`

### Migration naming conventions
- `V1__...` through `V9__...` are versioned schema migrations.
- `R__seed_...` scripts are repeatable seed data migrations.

### What the migrations do

- `V1__baseline_schema.sql` — creates the initial database schema.
- `V2__add_unique_products_name.sql` — adds unique constraints.
- `V3__add_username_to_users.sql` — alters the user table.
- `V4__add_slug_to_products.sql` — extends product metadata.
- `V5__add_low_stock_threshold_to_products.sql` — adds stock threshold data.
- `V6__create_inventory_transactions.sql` — creates inventory transaction history.
- `V7__create_audit_log.sql` — creates audit log tables.
- `V8__create_stores_and_inventory_by_store.sql` — adds store and inventory-per-store support.
- `V9__create_coupons_and_order_coupon_fields.sql` — adds coupons and order coupon fields.

Example SQL from `V1__baseline_schema.sql`:

```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    role VARCHAR(50) NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

This code shows how Flyway creates a table that matches the `User` JPA entity. The migration file is the source of truth for schema creation, while JPA maps entities to this schema in Java.

### Seed scripts
- `R__seed_carts.sql`
- `R__seed_categories.sql`
- `R__seed_product_images.sql`
- `R__seed_products.sql`
- `R__seed_users.sql`

Why they exist:
- Seed scripts load sample data automatically during development.
- Repeatable migrations can rerun as data changes without version conflicts.

## How the code uses these migrations

- Flyway runs these scripts automatically before the Spring Boot app starts.
- The backend does not need to create tables manually in code because the migrations define the schema.
- Beginner note: to add a new table, create a new `Vn__` migration file and update the corresponding JPA entity.

## Practical development advice

- If the app fails at startup with a database error, check the latest Flyway migration script first.
- If you want to change schema safely, add a new migration rather than editing old ones.
- Use `spring.flyway.baseline-on-migrate=true` only when you need to initialize Flyway against an existing database.

## Why database and migrations matter

- Flyway ensures the database schema can be recreated consistently.
- The backend can safely evolve schema changes while preserving data.
- Using PostgreSQL locally mirrors production-like behavior.
- Seed data helps frontend developers work with realistic sample data immediately.
