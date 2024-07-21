package com.blog_app.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
import com.blog_app.entity.Category;
import com.blog_app.entity.Post;
import com.blog_app.entity.User;
import com.blog_app.response.ResponseMessageVo;
import com.blog_app.service.CategoryService;
import com.blog_app.service.PostService;
import com.blog_app.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping(AppConstants.API+AppConstants.POST)
public class PostController {
	
	@Autowired
	private PostService postService;
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private CategoryService categoryService;
	
	//create post for blog
	@PostMapping("/user/{userId}/category/{categoryId}")
	public ResponseEntity<Object> createPost(@Valid @RequestBody Post post , @PathVariable Long userId,
																			 @PathVariable Long categoryId){
		
		User user = userService.findUserById(userId);
		Post createPost = new Post();
		ResponseMessageVo response = new ResponseMessageVo();
		try {
		Category category = categoryService.getCategorybyId(categoryId);
		createPost.setTitle(post.getTitle());
		createPost.setData(post.getData());
		createPost.setFavourite(post.isFavourite());
		createPost.setPostImage(post.getPostImage());
		createPost.setUser(user);
		createPost.setCategory(category);
		
		response.setMessage("post created successfully");
		response.setStatus(201);
		response.setData(createPost);
		postService.savePost(createPost);
		
		return new ResponseEntity<>(response,HttpStatus.CREATED);
		}catch (Exception e) {
			response.setMessage("error in create post");
			response.setStatus(500);
			response.setData(e.getMessage());
			
			return new ResponseEntity<>(response,HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	
	@GetMapping
	public ResponseEntity<Object> getAllPosts(){
		
		ResponseMessageVo response = new ResponseMessageVo();
		try {
			List<Post> posts = postService.findAllPosts();
			response.setMessage("posts found successfully");
			response.setStatus(200);
			response.setData(posts);
			
			return new ResponseEntity<>(response , HttpStatus.OK);
		}catch (Exception e) {
			response.setMessage("error in find post");
			response.setStatus(404);
			response.setData(e.getMessage());
			
			return new ResponseEntity<>(response , HttpStatus.NOT_FOUND);
		}
	}
	
	@GetMapping("/{postId}")
	public ResponseEntity<Object> getpostById(@PathVariable Long postId){
		
		ResponseMessageVo response = new ResponseMessageVo();
		try {
			Post post = postService.findPost(postId);
			response.setMessage("post found successfully");
			response.setStatus(200);
			response.setData(post);
			
			return new ResponseEntity<>(response , HttpStatus.OK);
		}catch (Exception e) {
			response.setMessage("error in find post");
			response.setStatus(404);
			response.setData(e.getMessage());
			
			return new ResponseEntity<>(response , HttpStatus.NOT_FOUND);
		}
	}
	
	@GetMapping("/user/{userId}/posts")
	public ResponseEntity<Object> findPostsByUser(@PathVariable Long userId){
		ResponseMessageVo message = new ResponseMessageVo();
		List<Post> posts = postService.findPostsByUser(userId);
		if (posts != null) {
			message.setMessage("posts found successfully");
			message.setStatus(200);
			message.setData(posts);
			
			
			return new ResponseEntity<>(message,HttpStatus.OK);
		}
		
		message.setMessage("not found any posts");
		message.setStatus(500);
		
		return new ResponseEntity<>(message,HttpStatus.INTERNAL_SERVER_ERROR);
	}
	
	@GetMapping("/category/{categoryId}/posts")
	public ResponseEntity<Object> findPostsByCategory(@PathVariable Long categoryId){
		ResponseMessageVo message = new ResponseMessageVo();
		List<Post> posts = postService.findPostsByCategory(categoryId);
		if (posts != null) {
			message.setMessage("posts found successfully");
			message.setStatus(200);
			message.setData(posts);
			
			return new ResponseEntity<>(message,HttpStatus.OK);
		}
		
		message.setMessage("not found any posts");
		message.setStatus(500);
		
		return new ResponseEntity<>(message,HttpStatus.INTERNAL_SERVER_ERROR);
	}
	
	@GetMapping("/search")
	public ResponseEntity<Object> searchPosts(@RequestParam String  keyword){
		ResponseMessageVo message = new ResponseMessageVo();
		List<Post> posts = postService.findPosts(keyword);
		if (posts != null) {
			message.setMessage("posts found successfully");
			message.setStatus(200);
			message.setData(posts);
			
			return new ResponseEntity<>(message,HttpStatus.OK);
		}
		
		message.setMessage("not found any posts");
		message.setStatus(500);
		
		return new ResponseEntity<>(message,HttpStatus.INTERNAL_SERVER_ERROR);
	}
	
	
	@PutMapping("/{postId}")
	public ResponseEntity<Object> updatePost(@RequestBody Post post, @PathVariable Long postId){
		
		Post updatePost = postService.findPost(postId);
		ResponseMessageVo response = new ResponseMessageVo();
		try {
			if (post.getTitle() != null) {
				updatePost.setTitle(post.getTitle());		
			}
			if (post.getData() != null) {
				updatePost.setData(post.getData());		
			}
		   
			if (post.getPostImage() != null) {
				updatePost.setPostImage(post.getPostImage());	  
			}
		   if (post.isFavourite() == true) {
			   updatePost.setFavourite(true);		
		    }
		   else {
		   updatePost.setFavourite(false);
		   }
		
		
		response.setMessage("post updated successfully");
		response.setStatus(200);
		response.setData(updatePost);
		postService.updatePost(updatePost , postId);
		
		return new ResponseEntity<>(response,HttpStatus.CREATED);
		}catch (Exception e) {
			response.setMessage("error in update post");
			response.setStatus(500);
			response.setData(e.getMessage());
			
			return new ResponseEntity<>(response,HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@DeleteMapping("/{postId}")
	public ResponseEntity<Object> deletePostById(@PathVariable Long postId){
		
		ResponseMessageVo response = new ResponseMessageVo();
		try {
			postService.deletePost(postId);
			response.setMessage("post deleted successfully");
			response.setStatus(200);
			response.setData(null);
			
			return new ResponseEntity<>(response , HttpStatus.OK);
		}catch (Exception e) {
			response.setMessage("error in delete post");
			response.setStatus(500);
			response.setData(e.getMessage());
			
			return new ResponseEntity<>(response , HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

}
