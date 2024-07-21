package com.blog_app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.blog_app.entity.Category;
import com.blog_app.entity.Post;
import com.blog_app.entity.User;

import jakarta.transaction.Transactional;

@Repository
public interface PostRepository extends JpaRepository<Post,Long>{

//	 code to manipulate posts
	@Modifying
	@Transactional
	@Query("delete from Post p where p.id = ?1")
	void deletePost(Long id);
	
//	find posts by user
	List<Post> findByUser(User user);
	// find posts by category
	List<Post> findByCategory(Category category);
	
	//search functionality
	
	// 1. find posts by title by ignore case(we can write custom query using like if we want to strictly check then use Regex)
	List<Post> findByTitleContainingIgnoreCase(String keyword);

	// 2. find posts by content
    List<Post> findByDataContainingIgnoreCase(String keyword);
}
