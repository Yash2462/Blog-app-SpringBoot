package com.blog_app.service;

import java.util.List;
import java.util.Optional;

import com.blog_app.entity.User;

public interface UserService {

           //	find user by user id
	        User findUserById(Long id);
	        
	        User findUserByEmail(String email);
	        
	        User saveUser(User user);
	        
	        void deleteUser(Long id);
	        
	        User updateUser(User user , Long id);
	        
	        List<User> findAllUsers();
	
}
