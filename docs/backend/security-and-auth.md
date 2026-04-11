# Backend Security and Authentication

The backend uses Spring Security with session-based authentication, role-based authorization, and custom user details mapping.

## Key security classes

### `SecurityConfig.java`

This class wires Spring Security and defines which endpoints are public, authenticated, or admin-only.

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

Why it matters:
- `permitAll()` opens auth and public read endpoints,
- `hasRole("ADMIN")` protects admin-only APIs,
- `authenticated()` ensures only logged-in users can access order-related endpoints,
- custom handlers return clean 401/403 responses.

The authentication provider is configured as:

```java
@Bean
public DaoAuthenticationProvider authenticationProvider() {
    DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
    provider.setUserDetailsService(userDetailsService);
    provider.setPasswordEncoder(passwordEncoder());
    return provider;
}
```

This links Spring Security to the database-backed user lookup and password hashing.

### `CustomUserDetailsService.java`

This service loads a `User` entity from the database and converts it into Spring Security credentials.

Example:

```java
@Override
public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

    String roleName = user.getRole().name();
    String finalAuthority = roleName.startsWith("ROLE_") ? roleName : "ROLE_" + roleName;

    return new UserPrincipal(
            user.getId(),
            user.getUsername(),
            user.getPassword(),
            List.of(new SimpleGrantedAuthority(finalAuthority))
    );
}
```

Why it exists:
- Spring Security needs a `UserDetails` object to authenticate and authorize users,
- this class bridges the domain `User` entity with Spring Security,
- it also normalizes roles to a `ROLE_` authority format.

### `UserPrincipal.java`

This class is the authenticated user principal stored in the security context.

Example:

```java
public class UserPrincipal implements UserDetails, Serializable {
    private final Long id;
    private final String username;
    private final String password;
    private final Collection<? extends GrantedAuthority> authorities;

    public UserPrincipal(Long id, String username, String password, Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.authorities = authorities;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
```

Why it matters:
- it is immutable and safe to store in the security context,
- it avoids serializing JPA entities directly,
- it carries the internal user ID for later audit and authorization checks.

### `AuthController.java`

This controller implements login, registration, and logout flows for the frontend.

Login example:

```java
@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
    Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
    );

    var context = SecurityContextHolder.createEmptyContext();
    context.setAuthentication(authentication);
    SecurityContextHolder.setContext(context);
    securityContextRepository.saveContext(context, httpRequest, httpResponse);

    User user = userService.findByUsername(request.getUsername()).orElseThrow();
    return ResponseEntity.ok(Map.of(
            "id", user.getId(),
            "username", user.getUsername(),
            "role", user.getRole()
    ));
}
```

Why it matters:
- it authenticates credentials using `AuthenticationManager`,
- it stores the authenticated security context in the HTTP session,
- it returns the logged-in user's ID, username, and role to the frontend.

Registration example:

```java
@PostMapping("/register")
public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
    if (userService.findByUsername(request.getUsername()).isPresent()) {
        return ResponseEntity.badRequest().body("Username already exists");
    }
    if (userService.findByEmail(request.getEmail()).isPresent()) {
        return ResponseEntity.badRequest().body("Email already exists");
    }
    User user = userService.registerUser(request.getUsername(), request.getEmail(), request.getPassword());
    return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
            "id", user.getId(),
            "username", user.getUsername(),
            "role", user.getRole()
    ));
}
```

Logout example:

```java
@PostMapping("/logout")
public ResponseEntity<String> logout(HttpServletRequest request) {
    SecurityContextHolder.clearContext();
    HttpSession session = request.getSession(false);
    if (session != null) {
        session.invalidate();
    }
    return ResponseEntity.ok("Logged out successfully");
}
```

Why these flows matter:
- login creates a session and issues `JSESSIONID`,
- registration prevents duplicate usernames or emails,
- logout clears session state so the user is effectively signed out.

## Security patterns

- Uses session-based authentication with HTTP session state.
- Stores authorities as `ROLE_...` values so Spring Security `hasRole(...)` works correctly.
- Permits frontend access from `http://localhost:5173` using CORS.
- Disables CSRF because the backend is consumed as a JSON API and uses explicit session cookies.

## Beginner reading path

- Start with `AuthController.java` to understand login and logout endpoints.
- Read `SecurityConfig.java` to learn how routes are protected.
- Inspect `CustomUserDetailsService.java` to see how the database user is converted to security credentials.
- Inspect `UserPrincipal.java` to see how authenticated identity is stored.

## Why auth matters

- authentication protects user data and actions,
- authorization ensures admin-only operations stay restricted,
- session handling supports browser-based workflows without JWT complexity.
