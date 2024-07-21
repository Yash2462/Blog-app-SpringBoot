package com.blog_app.serviceImpl;

import java.security.Key;
import java.sql.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.blog_app.constant.JwtConstant;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

	 public String extractUsername(String token) {
	        return extractClaim(token, Claims::getSubject);
	    }

	    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
	        final Claims claims = extractAllClaims(token);
	        return claimsResolver.apply(claims);
	    }

	    public String generateToken(UserDetails userDetails) {
	        return generateToken(new HashMap<>(), userDetails);
	    }

	    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
	        return buildToken(extraClaims, userDetails, JwtConstant.EXPIRE);
	    }

	    public long getExpirationTime() {
	        return JwtConstant.EXPIRE;
	    }

	    private String buildToken(
	            Map<String, Object> extraClaims,
	            UserDetails userDetails,
	            long expiration
	    ) {
	        return Jwts
	                .builder()
	                .setClaims(extraClaims)
	                .setSubject(userDetails.getUsername())
	                .setIssuedAt(new Date(System.currentTimeMillis()))
	                .setExpiration(new Date(System.currentTimeMillis() + expiration))
	                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
	                .compact();
	    }

	    public boolean isTokenValid(String token, UserDetails userDetails) {
	        final String username = extractUsername(token);
	        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
	    }

	    private boolean isTokenExpired(String token) {
	        return extractExpiration(token).before(new java.util.Date());
	    }

	    private Date extractExpiration(String token) {
	        return (Date) extractClaim(token, Claims::getExpiration);
	    }

	    private Claims extractAllClaims(String token) {
	        return Jwts
	                .parserBuilder()
	                .setSigningKey(getSignInKey())
	                .build()
	                .parseClaimsJws(token)
	                .getBody();
	    }

	    private Key getSignInKey() {
	        byte[] keyBytes = Decoders.BASE64.decode(JwtConstant.JWT_SECRET);
	        return Keys.hmacShaKeyFor(keyBytes);
	    }
}
