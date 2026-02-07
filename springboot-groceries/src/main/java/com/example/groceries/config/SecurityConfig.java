package com.example.groceries.config;

import com.example.groceries.security.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import jakarta.servlet.http.HttpServletResponse;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    // 🔑 THIS WAS MISSING
    private final CustomUserDetailsService userDetailsService;

    /* ===============================
       PASSWORD ENCODER
       =============================== */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /* ===============================
       AUTH PROVIDER
       =============================== */
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService); // ✅ FIX
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    /* ===============================
       AUTH MANAGER
       =============================== */
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    /* ===============================
       SECURITY FILTER CHAIN
       =============================== */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. ADD CORS CONFIGURATION HERE
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                )
                .authorizeHttpRequests(auth -> auth
                        // 1. Public Auth Endpoints
                        .requestMatchers("/api/auth/**").permitAll()

                        // Categories are public READ-ONLY.
                        // Any write attempts to these paths require authentication and will not be permitted by default rules.
                        .requestMatchers(HttpMethod.GET, "/categories/**", "/api/categories/**").permitAll()

                        // 2. Public Data Endpoints (Consolidated)
                        .requestMatchers(
                                "/products/**",
                                "/api/products/**",
                                "/api/images/**",
                                "/images/**",
                                "/api/user/me",
                                "/api/home-dashboard/**"
                        ).permitAll()

                        // Admin APIs: must be authenticated AND have ADMIN role.
                        // Assumption: roles are stored as Spring authorities with ROLE_ prefix (e.g. ROLE_ADMIN).
                        // TODO(security): when expanding roles/permissions, revisit admin authorization rules.
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // Defense-in-depth: order status mutation must be admin-only, even if a public mapping is added later.
                        .requestMatchers(HttpMethod.PUT, "/api/orders/**/status").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/orders/**/status").hasRole("ADMIN")

                        // Orders APIs: must be authenticated (session-based).
                        .requestMatchers("/api/orders/**").authenticated()

                        // 3. ANY OTHER request must be authenticated (ONLY ONCE and MUST BE LAST)
                        .anyRequest().authenticated()
                )
                // Ensure API clients get correct status codes.
                // - 401 for unauthenticated
                // - 403 for authenticated but insufficient role
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

    // 2. ADD THIS NEW BEAN
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOriginPatterns(
                java.util.List.of(
                        "http://localhost:5173",
                        "https://*.app.github.dev"
                )
        );

        configuration.setAllowedMethods(
                java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")
        );

        configuration.setAllowedHeaders(java.util.List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}