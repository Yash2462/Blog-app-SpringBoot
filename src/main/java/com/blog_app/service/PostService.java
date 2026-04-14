package com.blog_app.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.blog_app.entity.Post;

public interface PostService {

//	 all the methods to implement post manipulation
	
	Post findPost(Long id);
	
	void deletePost(Long id);
	
	Post savePost(Post post);
	
	Post updatePost(Post post , Long id);
	
	List<Post> findAllPosts();

	Page<Post> findAllPostsPaginated(Pageable pageable);
	
	List<Post> findPostsByUser(Long userId);

	List<Post> findLikedPostByUser(Long userId);

	List<Post> findPostsByCategory(Long categoryId);
	
	List<Post> findPosts(String query);
}
