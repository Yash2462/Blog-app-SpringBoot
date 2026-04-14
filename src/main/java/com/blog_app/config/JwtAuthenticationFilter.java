package com.blog_app.config;

import java.io.IOException;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import javax.crypto.SecretKey;

import com.blog_app.entity.User;
import com.blog_app.service.TokenBlacklistService;
import com.blog_app.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.blog_app.constant.JwtConstant;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter{

	@Autowired
	private UserService userService;

	@Autowired
	private TokenBlacklistService tokenBlacklistService;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		
		 String jwt = request.getHeader(JwtConstant.JWT_HEADER);
	        if (jwt != null){
	            jwt = jwt.substring(7);

				if (tokenBlacklistService.isTokenBlacklisted(jwt)) {
					response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401
					response.setContentType("application/json");
					response.getWriter().write("{\"error\": \"Token is blacklisted\"}");
					return;
				}


	            try {
	                SecretKey key = Keys.hmacShaKeyFor(JwtConstant.JWT_SECRET.getBytes());
	                Claims claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(jwt).getBody();
	                String email = String.valueOf(claims.get("email"));
					User user = userService.findUserByEmail(email);
	                if (user == null) {
	                    throw new BadCredentialsException("User not found with email: " + email);
	                }

	                // Create an authentication object and set it in the security context
					Set<GrantedAuthority> authorities = user.getRoles().stream()
							.map((role) -> new SimpleGrantedAuthority("ROLE_" + role.getName()))
							.collect(Collectors.toSet());
	                Authentication authentication = new UsernamePasswordAuthenticationToken(email,null,authorities);
	                SecurityContextHolder.getContext().setAuthentication(authentication);
	            }catch (Exception e){
	               throw  new BadCredentialsException("invalid token !!");
	            }
	        }
	        filterChain.doFilter(request,response);

	}

}
