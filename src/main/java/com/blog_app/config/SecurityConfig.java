package com.blog_app.config;

import java.util.Arrays;
import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
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
@EnableWebSecurity
public class SecurityConfig {
	
	private static String[] SWAGGER_WHITELIST = {
			"/swagger-ui.html",
			"/v3/api-docs/**",
			"/swagger-resources/**",
           "/swagger-resources" ,
           "/swagger-ui/**", "/api-docs/**",
           "/login",
           "/signup",
	};

	  @Bean
	    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{

	        http.sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
	                .authorizeHttpRequests(request -> request.requestMatchers("/api/auth/**","/css/**","/js/**","/image/**","/static/**").permitAll()
	                		//.requestMatchers(HttpMethod.DELETE, "/**").hasRole("ADMIN")
	                		.requestMatchers(SWAGGER_WHITELIST).permitAll()
	                        .anyRequest().authenticated())
	                .exceptionHandling(exception -> exception.accessDeniedPage("/403"))
	                .addFilterBefore(new JwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)
	                .formLogin(login -> login.loginPage("/login")
	                		.loginProcessingUrl("/login")
	                		.successForwardUrl("/dashboard")
	                		.failureForwardUrl("/login?error"))
	                .csrf(csrf -> csrf.disable())
	                .cors(cors -> cors.configurationSource(CorsConfigSource()));

	        return http.build();
	    }

	    private CorsConfigurationSource CorsConfigSource() {
	        return new CorsConfigurationSource() {
	            @Override
	            public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
	                CorsConfiguration configuration = new CorsConfiguration();
	                configuration.setAllowedOrigins(Arrays.asList("*"));
	                configuration.setAllowedMethods(Collections.singletonList("*"));
	                configuration.setAllowedHeaders(Collections.singletonList("*"));
	                configuration.setAllowCredentials(true);
	                configuration.setExposedHeaders(Arrays.asList("Authorization"));
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
