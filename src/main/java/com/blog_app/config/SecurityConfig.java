package com.blog_app.config;

import java.util.Arrays;
import java.util.List;

import jakarta.annotation.Nonnull;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import jakarta.servlet.http.HttpServletRequest;

@Configuration
@EnableMethodSecurity(prePostEnabled = true)
@EnableWebSecurity
public class SecurityConfig {

	private static final String[] SWAGGER_WHITELIST = {
			"/swagger-ui.html",
			"/v3/api-docs/**",
			"/swagger-resources/**",
           "/swagger-resources" ,
           "/swagger-ui/**", "/api-docs/**",
           "/login",
           "/signup",
           "/actuator/**"
	};

	@Autowired
	private JwtAuthenticationFilter jwtAuthenticationFilter;

	  @Bean
	    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{

	        http.sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
	                .authorizeHttpRequests(request -> request.requestMatchers("/api/auth/**","/css/**","/js/**","/image/**","/static/**", "/api/upload", "/uploads/**").permitAll()
	                		//.requestMatchers(HttpMethod.DELETE, "/**").hasRole("ADMIN")
	                		.requestMatchers(SWAGGER_WHITELIST).permitAll()
	                        .anyRequest().authenticated())
					.exceptionHandling(exception -> exception
							.accessDeniedHandler((request, response, accessDeniedException) -> {
								response.setStatus(HttpServletResponse.SC_FORBIDDEN);
								response.setContentType("application/json");
								response.getWriter().write("""
								{
								  "status": 403,
								  "error": "Forbidden",
								  "message": "You are not authorized to perform this action."
								}
							""");
							})
					)

					.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
//	                .formLogin(login -> login.loginPage("/login")
//	                		.loginProcessingUrl("/login")
//	                		.successForwardUrl("/dashboard"))
	                .csrf(AbstractHttpConfigurer::disable)
	                .cors(cors -> cors.configurationSource(CorsConfigSource()));

	        return http.build();
	    }

	    private CorsConfigurationSource CorsConfigSource() {
	        return new CorsConfigurationSource() {
	            @Override
	            public CorsConfiguration getCorsConfiguration(@Nonnull HttpServletRequest request) {
	                CorsConfiguration configuration = new CorsConfiguration();
	                // allowedOrigins("*") + allowCredentials(true) is rejected by browsers.
	                // Explicitly list allowed origins instead.
	                configuration.setAllowedOrigins(List.of(
	                    "http://localhost:5173",
	                    "http://127.0.0.1:5173",
	                    "http://localhost:5174",
	                    "http://localhost:3000"
	                ));
	                configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
	                configuration.setAllowedHeaders(List.of("*"));
	                configuration.setAllowCredentials(true);
	                configuration.setExposedHeaders(List.of("Authorization"));
	                configuration.setMaxAge(3600L);
	                return configuration;
	            }
	        };
	    }

	    @Bean
	    public static PasswordEncoder passwordEncoder(){
	        return new BCryptPasswordEncoder();
	    }

}
