package com.blog_app.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

import com.blog_app.constant.JwtConstant;

import javax.crypto.SecretKey;
import java.util.Collection;
import java.util.Date;

public class JwtProvider {

      public  static SecretKey key = Keys.hmacShaKeyFor(JwtConstant.JWT_SECRET.getBytes());
//    Claims claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(jwt).getBody();
//    String email = String.valueOf(claims.get("email"));
//    String authorities = String.valueOf(claims.get("authorities"));

     public static String generateToken(Authentication authentication){

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        String jwt = Jwts.builder().setIssuedAt(new Date())
                .setExpiration(new Date(new Date().getTime()+86400000))
                .claim("email",authentication.getName())
                .signWith(key)
                .compact();

        return jwt;
    }

    public static String getEmailFromToken(String jwt){
         jwt = jwt.substring(7,jwt.length());
        Claims claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(jwt).getBody();
        String email = String.valueOf(claims.get("email"));

        return email;
    }
}
