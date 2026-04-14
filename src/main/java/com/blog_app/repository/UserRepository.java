package com.blog_app.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.blog_app.entity.User;

@Repository
public interface UserRepository  extends JpaRepository<User,Long>{
	
//	 methods to  manipulate user data
	User findByEmail(String email);
	

}
