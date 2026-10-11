package rw.ac.auca.gymequipmentrentalapi.security;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.io.IOException;
import java.util.List;

/**
 * Who can call what.
 *
 * Public:   login, membership application.
 * Any login: equipment list, own profile (/api/me), rentals and renewals (ownership checked in code).
 * Staff only: equipment changes, all members, all payments, all rentals, approvals, deletes.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JwtService jwtService) throws Exception {
        http
            .csrf(csrf -> csrf.disable())                       // stateless JWT API, no cookies
            .cors(Customizer.withDefaults())
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/auth/login", "/api/applications").permitAll()

                // Equipment: everyone logged in can browse; only staff can change it
                .requestMatchers(HttpMethod.GET, "/api/equipment", "/api/equipment/**").authenticated()
                .requestMatchers("/api/equipment/**").hasRole("STAFF")

                // Members renewing or changing their own plan (ownership checked in MemberController)
                .requestMatchers(HttpMethod.POST, "/api/members/*/renewals").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/members/*/plan").authenticated()
                // Everything else about members is staff-only
                .requestMatchers("/api/members/**").hasRole("STAFF")

                // Payment history and full rental lists are staff-only; members use /api/me/*
                .requestMatchers("/api/payments/**").hasRole("STAFF")
                .requestMatchers(HttpMethod.GET, "/api/rentals", "/api/rentals/overdue").hasRole("STAFF")
                .requestMatchers(HttpMethod.DELETE, "/api/rentals/**").hasRole("STAFF")

                // Booking and returning rentals: any login; ownership checked in RentalService
                .requestMatchers("/api/rentals/**", "/api/me/**", "/api/auth/me").authenticated()

                .anyRequest().authenticated())
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((req, res, e) ->
                        writeJson(res, HttpServletResponse.SC_UNAUTHORIZED, "Please log in to continue."))
                .accessDeniedHandler((req, res, e) ->
                        writeJson(res, HttpServletResponse.SC_FORBIDDEN, "You do not have permission to do that.")))
            .addFilterBefore(new JwtAuthFilter(jwtService), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource(
            @Value("${app.cors.allowed-origins:http://localhost:5173,http://localhost:4173,http://localhost:3000}")
            List<String> allowedOrigins) {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(allowedOrigins);
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        return source;
    }

    private static void writeJson(HttpServletResponse response, int status, String message) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json");
        response.getWriter().write("{\"message\":\"" + message + "\"}");
    }
}
