package com.blog_app.controller;

import java.util.Set;
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

    // signup api
    @PostMapping("/signup")
    public ResponseEntity<Object> createUserHandler(@Valid @RequestBody User user) throws Exception {

        User isExist = userService.findUserByEmail(user.getEmail());

        if (isExist != null){
        	logger.info("email already exist");
            throw new Exception("email already exist with another Account");
        }
        User createUser = new User();
        Role role = new Role();
        role.setName("ADMIN");
    	createUser.setEmail(user.getEmail());
		createUser.setUsername(user.getUsername());
		createUser.setAbout(user.getAbout());
		createUser.setPassword(passwordEncoder.encode(user.getPassword()));
		createUser.setRoles(Set.of(role));

        User savedUser = userService.saveUser(createUser);

//        Authentication authentication = new UsernamePasswordAuthenticationToken(user.getEmail(),user.getPassword());
//        SecurityContextHolder.getContext().setAuthentication(authentication);

//        String jwt = JwtProvider.generateToken(authentication);
        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setMessage("User Saved Successfully");
        loginResponse.setStatus(201);
//        loginResponse.setToken(jwt);
        loginResponse.setToken_type("Bearer");

        return new ResponseEntity<>(loginResponse, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody LoginRequest loginRequest){

        String username = loginRequest.getEmail();
        String password = loginRequest.getPassword();
        Authentication authentication = authenticate(username,password);

        Authentication authentication1 = new UsernamePasswordAuthenticationToken(username,password);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = JwtProvider.generateToken(authentication);
        LoginResponse authResponse = new LoginResponse();
        authResponse.setToken(jwt);
        authResponse.setMessage("User Logged in successfully");
        authResponse.setStatus(200);
        authResponse.setToken_type("Bearer");
         logger.info("User logged in successfully");
        return new ResponseEntity<>(authResponse,HttpStatus.OK);
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
}