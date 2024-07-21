package com.blog_app.controller;

import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.blog_app.constant.AppConstants;
import com.blog_app.entity.Role;
import com.blog_app.entity.User;
import com.blog_app.response.ResponseMessageVo;
import com.blog_app.service.UserService;

@RestController
@RequestMapping(AppConstants.API)
public class UserController {
//	@Autowired
//	private PasswordEncoder passwordEncoder;

	@Autowired
	private UserService userService;
	
	//create user (signup user)
//	@PostMapping("/signup")
//	public ResponseEntity<Object> signup(@RequestBody User user){
//		ResponseMessageVo response = new ResponseMessageVo();
//		User createUser = new User();
//		Role roles  = new Role();
//		roles.setName("ROLE_USER");
//		try {
//		createUser.setEmail(user.getEmail());
//		createUser.setUsername(user.getUsername());
//		createUser.setAbout(user.getAbout());
//		createUser.setPassword(passwordEncoder.encode(user.getPassword()));
//		createUser.setRoles(Set.of(roles));
//		
//		userService.saveUser(createUser);
//		response.setMessage("data saved success");
//		response.setStatus(201);
//		response.setData(createUser);
//		
//		return new ResponseEntity<Object>(response,HttpStatus.CREATED);
//		}catch (Exception e) {
//			
//			response.setMessage("error in data save");
//			response.setStatus(500);
//			response.setData(e.getMessage());
//			
//			return new ResponseEntity<Object>(response,HttpStatus.INTERNAL_SERVER_ERROR);
//		}
//	}
//	
    @GetMapping("/users")
	public ResponseEntity<Object> getAllUsers(){
		ResponseMessageVo response = new ResponseMessageVo();
		try {
			List<User> users = userService.findAllUsers();
		
		response.setMessage("find all users ");
		response.setStatus(200);
		response.setData(users);
		
		return new ResponseEntity<Object>(response,HttpStatus.OK);
		}catch (Exception e) {
			
			response.setMessage("error in find users");
			response.setStatus(500);
			response.setData(e.getMessage());
			
			return new ResponseEntity<Object>(response,HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
    
	@DeleteMapping("/users/{userId}")
	public ResponseEntity<Object> deleteUserById(@PathVariable Long userId){
		ResponseMessageVo response = new ResponseMessageVo();
		//User user = userService.findUserById(userId);
		try {
			userService.deleteUser(userId);
		response.setMessage("deleted  user");
		response.setStatus(200);
		response.setData("");
		
		return new ResponseEntity<Object>(response,HttpStatus.OK);
		}catch (Exception e) {
			
			response.setMessage("error in delete user");
			response.setStatus(500);
			response.setData(e.getMessage());
			
			return new ResponseEntity<Object>(response,HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@PutMapping("/users/{userId}")
	public ResponseEntity<Object> update(@RequestBody User user, @PathVariable Long userId) {
	    ResponseMessageVo response = new ResponseMessageVo();
	    User updateUser = userService.findUserById(userId);
	    
	    if (updateUser == null) {
	        response.setMessage("User not found");
	        response.setStatus(HttpStatus.NOT_FOUND.value());
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
	    }

	    try {
	        // Only update fields that are provided in the request
	        if (user.getEmail() != null) {
	            updateUser.setEmail(user.getEmail());
	        }
	        if (user.getUsername() != null) {
	            updateUser.setUsername(user.getUsername());
	        }
	        if (user.getAbout() != null) {
	            updateUser.setAbout(user.getAbout());
	        }
	        if (user.getPassword() != null) {
	            updateUser.setPassword(user.getPassword());
	        }
	        
	        userService.saveUser(updateUser);
	        
	        response.setMessage("Data update success");
	        response.setStatus(HttpStatus.OK.value());
	        response.setData(updateUser);
	        
	        return ResponseEntity.ok(response);
	    } catch (Exception e) {
	        response.setMessage("Error in data update");
	        response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
	        response.setData(e.getMessage());
	        
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
	    }
	}

	@GetMapping("/users/{userId}")
	public ResponseEntity<Object> getUserById(@PathVariable Long userId){
		ResponseMessageVo response = new ResponseMessageVo();
		try {
			User user = userService.findUserById(userId);
		
		response.setMessage("user found successfully ");
		response.setStatus(200);
		response.setData(user);
		
		return new ResponseEntity<Object>(response,HttpStatus.OK);
		}catch (Exception e) {
			
			response.setMessage("error in find user");
			response.setStatus(500);
			response.setData(e.getMessage());
			
			return new ResponseEntity<Object>(response,HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@GetMapping("/users/getByMail")
	public ResponseEntity<Object> getUserByEmail(@RequestParam String  email){
		ResponseMessageVo response = new ResponseMessageVo();
		try {
			User user = userService.findUserByEmail(email);
		
		response.setMessage("user found successfully ");
		response.setStatus(200);
		response.setData(user);
		
		return new ResponseEntity<Object>(response,HttpStatus.OK);
		}catch (Exception e) {
			
			response.setMessage("error in find user");
			response.setStatus(500);
			response.setData(e.getMessage());
			
			return new ResponseEntity<Object>(response,HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
    
}
