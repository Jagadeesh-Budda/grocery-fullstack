# Backend Overview

The backend of this project lives in `springboot-groceries/` and is built with **Spring Boot** using **Java 21**.

## Purpose

This backend provides the API, business rules, security, database access, and server-side state for the grocery application.

## Architecture

The backend follows a common Spring Boot layered architecture:

- `controller/` — HTTP request handling and REST endpoints.
- `service/` — business logic and orchestration.
- `repository/` — database access with Spring Data JPA.
- `model/` — domain entities and enums mapped to database tables.
- `config/` — application configuration, security, timezone, and initialization.
- `security/` — authentication and user principal handling.
- `audit/` — auditing support for tracking changes.
- `exception/` — custom error types and exception handling.

## Why this structure?

- **Separation of concerns**: controllers only handle HTTP and request/response mapping while services implement business rules.
- **Testability**: each layer can be tested independently.
- **Maintainability**: modular packages make the code easier to understand and extend.
- **Scalability**: the application can grow with more controllers, services, and repository logic without becoming tangled.

## How the backend is built and run

- `springboot-groceries/pom.xml` defines dependencies and build plugins.
- `springboot-groceries/Dockerfile` packages the compiled JAR into a container.
- `springboot-groceries/src/main/resources/application.properties` configures database access, Flyway, JPA, logging, and server behavior.

## Entry points

- `GroceryApplication.java` is the Spring Boot entry point.
- `application.properties` is the main application configuration.
- `pom.xml` defines dependencies and the build process.
- `docker-compose.yml` in the project root starts the backend along with PostgreSQL and the frontend.

## How a beginner should read this

- Start with `GroceryApplication.java` to see how Spring Boot launches the app.
- Read `application.properties` to understand the database connection and JPA settings.
- Open `pom.xml` to see which Spring modules and libraries are included.
- Explore `controller/`, `service/`, and `repository/` in that order to follow the request flow.

### Example: Spring Boot entry point

```java
@SpringBootApplication
public class GroceryApplication {
    public static void main(String[] args) {
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Kolkata"));
        SpringApplication.run(GroceryApplication.class, args);
    }
}
```

Why this matters:
- `@SpringBootApplication` tells Spring Boot to scan for components and start the embedded server.
- `TimeZone.setDefault(...)` sets a consistent timezone for the whole JVM.
- `SpringApplication.run(...)` starts the application and loads all configured beans.
