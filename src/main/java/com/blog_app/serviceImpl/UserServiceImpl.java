package com.blog_app.serviceImpl;

import java.util.List;

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
		logger.info("user found successfully using given email");
		return user;
	}

	@Override
	public User saveUser(User user) {
		User saved = userRepository.save(user);
		logger.info("user data saved successfully");
		return saved;
	}

	@Override
	public void deleteUser(Long id) {
		// Ensure user exists before deletion
		findUserById(id);
		userRepository.deleteById(id);
		logger.info("user deleted successfully with id: {}", id);
	}

	@Override
	public User updateUser(User user, Long id) {
		User saveduser = findUserById(id);

		if (user.getUsername() != null && !user.getUsername().isBlank()) {
			saveduser.setUsername(user.getUsername());
		}
		if (user.getEmail() != null && !user.getEmail().isBlank()) {
			saveduser.setEmail(user.getEmail());
		}
		// Password is expected to arrive already encoded by the caller (UserController)
		if (user.getPassword() != null && !user.getPassword().isBlank()) {
			saveduser.setPassword(user.getPassword());
		}

		User updated = userRepository.save(saveduser);
		logger.info("user updated successfully with id: {}", id);
		return updated;
	}

	@Override
	public List<User> findAllUsers() {
		List<User> users = userRepository.findAll();
		return users;
	}

}
