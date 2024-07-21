package com.blog_app.serviceImpl;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.blog_app.entity.Category;
import com.blog_app.entity.Post;
import com.blog_app.entity.User;
import com.blog_app.exception.PostNotFoundException;
import com.blog_app.repository.CategoryRepository;
import com.blog_app.repository.PostRepository;
import com.blog_app.service.PostService;
import com.blog_app.service.UserService;

import jakarta.persistence.EntityNotFoundException;

@Service
public class PostServiceImpl  implements PostService{
	
	Logger logger = LoggerFactory.getLogger(PostServiceImpl.class);

	    @Autowired
	    private PostRepository postRepository;
	    
	    @Autowired
	    private UserService userService;
	    
	    @Autowired
	    private CategoryRepository categoryRepository;
	    
	@Override
	public Post findPost(Long id) {
		Post post = postRepository.findById(id).orElseThrow(() -> new PostNotFoundException());
		
		return post;
	}

	@Override
	public void deletePost(Long id) {
		try {
			postRepository.deletePost(id);
			logger.info("post deleted Successfully");
		}catch (Exception e) {
			logger.info("error in delete post :"+e);
		}
		
	}

	@Override
	public Post savePost(Post post) {
		try {
			postRepository.save(post);
			logger.info("post saved successfully");
		}catch (Exception e) {
			logger.info("error in saving post :"+e);
		}
		return post;
	}

	@Override
	public Post updatePost(Post post , Long id) {
		Post savedpost = findPost(id);
		
		try {
			savedpost.setTitle(post.getTitle());
			savedpost.setData(post.getData());
			savedpost.setPostImage(post.getPostImage());
			savedpost.setFavourite(post.isFavourite());
			
			postRepository.save(savedpost);
			
			logger.info("post saved successfully");
		}catch (Exception e) {
			logger.info("error in saving post :"+e);
		}
		return savedpost;
	}

	@Override
	public List<Post> findAllPosts() {
		List<Post> posts = postRepository.findAll();
		return posts;
	}

	@Override
	public List<Post> findPostsByUser(Long userId) {
		User user = userService.findUserById(userId);
		List<Post> posts = postRepository.findByUser(user);
		return posts;
	}

	@Override
	public List<Post> findPostsByCategory(Long categoryId) {
		Category category = categoryRepository.findById(categoryId).orElseThrow();
		List<Post> posts = postRepository.findByCategory(category);
		return posts;
	}

	@Override
	public List<Post> findPosts(String name) {
		// posts by title matching
		List<Post> postsByTitle = postRepository.findByTitleContainingIgnoreCase(name);
		
		// posts by content matching
		List<Post> postsByContent = postRepository.findByDataContainingIgnoreCase(name);
		
		// here we created set because if content and title both match found in posts then only one we get in list
		Set<Post> posts = new HashSet<>();
		posts.addAll(postsByTitle);
		posts.addAll(postsByContent);
		//converte set to list cause not want to change all methods to return set from list
		List<Post> matches = new ArrayList<>(posts);
		return matches;
	}

}
