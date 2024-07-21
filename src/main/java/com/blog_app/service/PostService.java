package com.blog_app.service;

import java.util.List;

import com.blog_app.entity.Post;
import com.blog_app.entity.User;

public interface PostService {

//	 all the methods to implement post manipulation
	
	Post findPost(Long id);
	
	void deletePost(Long id);
	
	Post savePost(Post post);
	
	Post updatePost(Post post , Long id);
	
	List<Post> findAllPosts();
	
	List<Post> findPostsByUser(Long userId);
	
	List<Post> findPostsByCategory(Long categoryId);
	
	List<Post> findPosts(String name);
}

