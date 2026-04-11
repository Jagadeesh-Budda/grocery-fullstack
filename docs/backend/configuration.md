# Backend Configuration

The `config` package configures Spring Boot application behavior, security, startup initialization, and runtime environment settings.

## `application.properties`

This file contains the backend runtime settings for database connectivity, Flyway, JPA, logging, and session cookies.

Example:

```properties
spring.application.name=groceries
server.port=8080

spring.datasource.url=jdbc:postgresql://localhost:5432/groceriesdb
spring.datasource.username=pguser
spring.datasource.password=pgpass
spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=validate

spring.flyway.enabled=true
spring.flyway.baseline-on-migrate=true
spring.flyway.locations=classpath:db/migration/common

spring.jpa.show-sql=true
spring.jpa.open-in-view=false
spring.jpa.properties.hibernate.jdbc.time_zone=Asia/Kolkata

server.servlet.session.cookie.same-site=None
server.servlet.session.cookie.secure=true

management.endpoints.web.exposure.include=mappings
logging.level.org.springframework.security=DEBUG
```

Why it exists:
- centralizes environment-specific settings,
- keeps secrets and connection details out of code,
- lets you run the same application in local, Docker, or cloud environments by changing only properties.

## `SecurityConfig.java`

This class defines the Spring Security rules and authentication provider used by the backend.

Example:

```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
            .authorizeHttpRequests(auth -> auth
                    .requestMatchers("/api/auth/**").permitAll()
                    .requestMatchers(HttpMethod.GET, "/categories/**", "/api/categories/**").permitAll()
                    .requestMatchers(
                            "/products/**",
                            "/api/products/**",
                            "/api/images/**",
                            "/images/**",
                            "/api/user/me",
                            "/api/home-dashboard/**"
                    ).permitAll()
                    .requestMatchers("/api/admin/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/api/orders/**/status").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PATCH, "/api/orders/**/status").hasRole("ADMIN")
                    .requestMatchers("/api/orders/**").authenticated()
                    .anyRequest().authenticated()
            )
            .exceptionHandling(ex -> ex
                    .authenticationEntryPoint((request, response, authException) ->
                            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized")
                    )
                    .accessDeniedHandler((request, response, accessDeniedException) ->
                            response.sendError(HttpServletResponse.SC_FORBIDDEN, "Forbidden")
                    )
            )
            .authenticationProvider(authenticationProvider());

    return http.build();
}
```

This configuration shows:
- CORS allowed origins for the frontend and GitHub Codespaces,
- CSRF disabled for the JSON API workflow,
- session-based authentication with `JSESSIONID`,
- fine-grained route protection for public, authenticated, and admin paths,
- custom handling of 401 and 403 responses.

The authentication provider is:

```java
@Bean
public DaoAuthenticationProvider authenticationProvider() {
    DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
    provider.setUserDetailsService(userDetailsService);
    provider.setPasswordEncoder(passwordEncoder());
    return provider;
}
```

Why it exists:
- it connects Spring Security to the database-backed user service,
- it tells Spring how to verify passwords with BCrypt,
- it keeps security wiring separate from controllers and services.

## `WebConfig.java`

This class customizes static resource handling.

Example:

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/images/**", "/api/images/**")
                .addResourceLocations("classpath:/static/images/");
    }
}
```

Why it exists:
- serves static image assets from the classpath,
- maps both API and direct paths to the same resource location,
- is useful when the backend needs to serve image content for the frontend.

## `TimeConfig.java`

This class exposes a `Clock` bean for consistent time handling.

Example:

```java
@Configuration
public class TimeConfig {
    @Bean
    public Clock clock() {
        return Clock.systemDefaultZone();
    }
}
```

Why it exists:
- makes time easier to test by injecting a clock,
- keeps date/time behavior consistent across services,
- avoids coupling code to `Instant.now()` or `LocalDateTime.now()` directly.

## Startup initializers

### `UserInitializer.java`

This class seeds default admin and test users at application startup.

Example:

```java
@Bean
CommandLineRunner initializeUsers(UserService userService) {
    return args -> {
        if (userService.findByUsername("admin").isEmpty()) {
            System.out.println("Creating default admin user...");
            userService.createAdminUser("admin", "admin@example.com", "admin123");
        }
        if (userService.findByUsername("user").isEmpty()) {
            System.out.println("Creating default test user...");
            userService.registerUser("user", "user@example.com", "user123");
        }
    };
}
```

Why it exists:
- provides initial data for development,
- avoids manual admin account creation after every database reset,
- demonstrates how Spring Boot runs startup logic automatically.

### `CategoryInitializer.java`

This class seeds default product categories if none exist.

Example:

```java
@PostConstruct
public void init() {
    if (categoryRepository.count() == 0) {
        categoryRepository.saveAll(List.of(veg, fruits, dairy, bakery, beverages));
    }
}
```

Why it exists:
- ensures the app has category data for the storefront,
- improves first-run experience for developers,
- keeps seeding logic separate from application business code.

## Why configuration matters

- configuration controls runtime behavior without changing code,
- it separates environment-specific settings from the application logic,
- it makes the backend portable across local, Docker, and deployment environments.
