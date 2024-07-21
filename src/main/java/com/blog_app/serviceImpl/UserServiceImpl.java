package com.blog_app.serviceImpl;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.blog_app.entity.User;
import com.blog_app.repository.UserRepository;
import com.blog_app.service.UserService;

import jakarta.persistence.EntityNotFoundException;

@Service
public class UserServiceImpl implements UserService{
	
	Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);
	
	@Autowired
	private UserRepository userRepository;

	@Override
	public User findUserById(Long id) {
		// find user from database using given id
		User user = userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("not found user"));
		logger.info("user found successfully using given id");
		return user;
	}

	@Override
	public User findUserByEmail(String email) {
		User user = userRepository.findByEmail(email);
		logger.info("user founf successfully using given email");
		return user;
	}

	@Override
	public User saveUser(User user) {
		try {
			userRepository.save(user);
			logger.info("user data saved successfully");
		}catch (Exception e) {
			logger.info("error in user data saving");
		}
		return user;
	}

	@Override
	public void deleteUser(Long id) {
		try {
			userRepository.deleteById(id);
			logger.info("user deleted successfully");
		}catch (Exception e) {
			logger.info("error in delete user");
		}
	}

	@Override
	public User updateUser(User user , Long id) {
		
		User saveduser = findUserById(id);
		try {
		saveduser.setUsername(user.getUsername());
		saveduser.setAbout(user.getAbout());
		saveduser.setEmail(user.getEmail());
		
		userRepository.save(saveduser);
		
		logger.info("user updated successfully");
		}catch (Exception e) {
			logger.info("error in update user");
		}
		return saveduser;
	}

	@Override
	public List<User> findAllUsers() {
		List<User> users = userRepository.findAll();
		return users;
	}

}
