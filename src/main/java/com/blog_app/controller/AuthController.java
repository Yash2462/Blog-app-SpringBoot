package com.blog_app.controller;

import java.util.Set;

import com.blog_app.constant.JwtConstant;
import com.blog_app.service.TokenBlacklistService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blog_app.config.CustomUserDetailsService;
import com.blog_app.config.JwtProvider;
import com.blog_app.entity.LoginRequest;
import com.blog_app.entity.Role;
import com.blog_app.entity.User;
import com.blog_app.response.LoginResponse;
import com.blog_app.service.UserService;

import jakarta.validation.Valid;



@RestController
@RequestMapping("/api/auth")
public class AuthController {
	
	Logger logger= LoggerFactory.getLogger(AuthController.class);
    @Autowired
    private UserService userService;
    @Autowired
    private PasswordEncoder passwordEncoder;
 
    @Autowired
    private CustomUserDetailsService customUserDetails;

    @Autowired
    private TokenBlacklistService tokenBlacklistService;

    // signup api
    @PostMapping("/signup")
    public ResponseEntity<Object> createUserHandler(@Valid @RequestBody User user) throws Exception {
        LoginResponse loginResponse = new LoginResponse();
        User isExist = userService.findUserByEmail(user.getEmail());

        if (isExist != null){
        	logger.info("email already exist");
            loginResponse.setMessage("email already exist");
            loginResponse.setStatus(400);
            return new ResponseEntity<>(loginResponse, HttpStatus.BAD_REQUEST);
//            throw new Exception("email already exist with another Account");
        }
        User createUser = new User();
        Role role = new Role();
        role.setName("USER");
    	createUser.setEmail(user.getEmail());
		createUser.setUsername(user.getUsername());
		createUser.setPassword(passwordEncoder.encode(user.getPassword()));
		createUser.setRoles(Set.of(role));

        userService.saveUser(createUser);

        Authentication authentication = new UsernamePasswordAuthenticationToken(user.getEmail(),user.getPassword());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = JwtProvider.generateToken(authentication);

        loginResponse.setMessage("User Saved Successfully");
        loginResponse.setStatus(201);
        loginResponse.setToken(jwt);
        loginResponse.setToken_type("Bearer");

        return new ResponseEntity<>(loginResponse, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody LoginRequest loginRequest){
        LoginResponse authResponse = new LoginResponse();
        try {
        String username = loginRequest.getEmail();
        String password = loginRequest.getPassword();
        Authentication authentication = authenticate(username,password);

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = JwtProvider.generateToken(authentication);
        authResponse.setToken(jwt);
        authResponse.setMessage("User Logged in successfully");
        authResponse.setStatus(200);
        authResponse.setToken_type("Bearer");
        logger.info("User logged in successfully");
        return new ResponseEntity<>(authResponse,HttpStatus.OK);
    } catch (BadCredentialsException e) {
        authResponse.setMessage(e.getMessage());
        authResponse.setStatus(401);
        return new ResponseEntity<>(authResponse,HttpStatus.UNAUTHORIZED);
    }
}

    private Authentication authenticate(String username , String password) {

        UserDetails userDetails  = customUserDetails.loadUserByUsername(username);

        if (userDetails == null){
        	logger.info("invalid username");
            throw new BadCredentialsException("invalid username");
        }
        if (!passwordEncoder.matches(password,userDetails.getPassword())){
        	logger.info("invalid password");
            throw new BadCredentialsException("invalid password");
        }

        return new UsernamePasswordAuthenticationToken(userDetails,null,userDetails.getAuthorities());
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body("No token provided");
        }

        String token = header.substring(7);

        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(Keys.hmacShaKeyFor(JwtConstant.JWT_SECRET.getBytes()))
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            long expiry = claims.getExpiration().getTime();
            tokenBlacklistService.blacklistToken(token, expiry);
            return ResponseEntity.ok("Logged out successfully");

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid token");
        }
    }
}