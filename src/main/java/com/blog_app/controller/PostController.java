package com.blog_app.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.blog_app.config.JwtProvider;
import com.blog_app.service.CommentService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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

	@Autowired
	private CommentService commentService;
	
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
		createPost.setDescription(post.getDescription());
		createPost.setData(post.getData());
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
	public ResponseEntity<Object> getAllPosts(
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size) {

		ResponseMessageVo response = new ResponseMessageVo();
		try {
			Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
			Page<Post> postPage = postService.findAllPostsPaginated(pageable);

			Map<String, Object> data = new HashMap<>();
			data.put("data", postPage.getContent());
			data.put("totalPages", postPage.getTotalPages());
			data.put("totalElements", postPage.getTotalElements());
			data.put("currentPage", postPage.getNumber());
			data.put("pageSize", postPage.getSize());

			response.setMessage("posts found successfully");
			response.setStatus(200);
			response.setData(data);

			return new ResponseEntity<>(response, HttpStatus.OK);
		} catch (Exception e) {
			response.setMessage("error in find post");
			response.setStatus(404);
			response.setData(e.getMessage());

			return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
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
		try {
			List<Post> posts = postService.findPostsByUser(userId);
			message.setMessage("posts found successfully");
			message.setStatus(200);
			message.setData(posts);
			return new ResponseEntity<>(message, HttpStatus.OK);
		} catch (Exception e) {
			message.setMessage("Error fetching posts for user");
			message.setStatus(500);
			message.setData(e.getMessage());
			return new ResponseEntity<>(message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/user/{userId}/liked/posts")
	public ResponseEntity<Object> findLikedPostsByUser(@PathVariable Long userId){
		ResponseMessageVo message = new ResponseMessageVo();
		try {
			List<Post> posts = postService.findLikedPostByUser(userId);
			message.setMessage("posts found successfully");
			message.setStatus(200);
			message.setData(posts);
			return new ResponseEntity<>(message, HttpStatus.OK);
		} catch (Exception e) {
			message.setMessage("Error fetching liked posts for user");
			message.setStatus(500);
			message.setData(e.getMessage());
			return new ResponseEntity<>(message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@GetMapping("/category/{categoryId}/posts")
	public ResponseEntity<Object> findPostsByCategory(@PathVariable Long categoryId){
		ResponseMessageVo message = new ResponseMessageVo();
		try {
			List<Post> posts = postService.findPostsByCategory(categoryId);
			message.setMessage("posts found successfully");
			message.setStatus(200);
			message.setData(posts);
			return new ResponseEntity<>(message, HttpStatus.OK);
		} catch (Exception e) {
			message.setMessage("Error fetching posts for category");
			message.setStatus(500);
			message.setData(e.getMessage());
			return new ResponseEntity<>(message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@GetMapping("/search")
	public ResponseEntity<Object> searchPosts(@RequestParam String query){
		ResponseMessageVo message = new ResponseMessageVo();
		try {
			List<Post> posts = postService.findPosts(query);
			message.setMessage("posts found successfully");
			message.setStatus(200);
			message.setData(posts);
			return new ResponseEntity<>(message, HttpStatus.OK);
		} catch (Exception e) {
			message.setMessage("Error searching posts");
			message.setStatus(500);
			message.setData(e.getMessage());
			return new ResponseEntity<>(message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	
	@PutMapping("/{postId}")
	public ResponseEntity<Object> updatePost(@RequestBody Post post, @PathVariable Long postId, HttpServletRequest request){
		
		Post updatePost = postService.findPost(postId);
		ResponseMessageVo response = new ResponseMessageVo();
		
		// Verify the requester is the post author
		try {
			String authHeader = request.getHeader("Authorization");
			if (authHeader != null && authHeader.startsWith("Bearer ")) {
				String email = JwtProvider.getEmailFromToken(authHeader);
				User requestingUser = userService.findUserByEmail(email);
				if (requestingUser == null || !requestingUser.getId().equals(updatePost.getUser().getId())) {
					response.setMessage("You are not authorized to edit this post");
					response.setStatus(403);
					return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
				}
			}
		} catch (Exception e) {
			response.setMessage("Authorization check failed");
			response.setStatus(403);
			return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
		}
		
		try {
			if (post.getTitle() != null) {
				updatePost.setTitle(post.getTitle());		
			}
			if (post.getDescription() != null) {
				updatePost.setDescription(post.getDescription());
			}
			if (post.getData() != null) {
				updatePost.setData(post.getData());		
			}
		   
			if (post.getPostImage() != null) {
				updatePost.setPostImage(post.getPostImage());	  
			}
		
		
		response.setMessage("post updated successfully");
		response.setStatus(200);
		response.setData(updatePost);
		postService.updatePost(updatePost , postId);
		
		return new ResponseEntity<>(response,HttpStatus.OK);
		}catch (Exception e) {
			response.setMessage("error in update post");
			response.setStatus(500);
			response.setData(e.getMessage());
			
			return new ResponseEntity<>(response,HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * Delete a post — allowed for ADMINs or the post's author.
	 */
	@DeleteMapping("/{postId}")
	public ResponseEntity<Object> deletePostById(@PathVariable Long postId, HttpServletRequest request){
		
		ResponseMessageVo response = new ResponseMessageVo();
		try {
			Post post = postService.findPost(postId);
			
			// Check: must be ADMIN or the post's author
			boolean isAdmin = request.isUserInRole("ROLE_ADMIN");
			if (!isAdmin) {
				String authHeader = request.getHeader("Authorization");
				if (authHeader != null && authHeader.startsWith("Bearer ")) {
					String email = JwtProvider.getEmailFromToken(authHeader);
					User requestingUser = userService.findUserByEmail(email);
					if (requestingUser == null || !requestingUser.getId().equals(post.getUser().getId())) {
						response.setMessage("You are not authorized to delete this post");
						response.setStatus(403);
						return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
					}
				}
			}
			
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

	@PostMapping("/{postId}/like/user/{userId}")
	public ResponseEntity<Object> likeOrUnlikePost(@PathVariable Long postId, @PathVariable Long userId) {
		ResponseMessageVo response = new ResponseMessageVo();
		try {
			Post post = postService.findPost(postId);
			User user = userService.findUserById(userId);

			if (post.getLikedBy().contains(user)) {
				post.getLikedBy().remove(user);
				response.setMessage("Post unliked");
			} else {
				post.getLikedBy().add(user);
				response.setMessage("Post liked");
			}

			postService.savePost(post);
			response.setStatus(200);
			response.setData(post.getLikedBy().size());

			return new ResponseEntity<>(response, HttpStatus.OK);
		} catch (Exception e) {
			response.setMessage("Error updating like status");
			response.setStatus(500);
			response.setData(e.getMessage());
			return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	//get stats of post
	@GetMapping("/{postId}/stats")
	public ResponseEntity<Object> getPostStats(@PathVariable Long postId) {
		ResponseMessageVo response = new ResponseMessageVo();
		try {
			Post post = postService.findPost(postId);
			int likeCount = post.getLikedBy() != null ? post.getLikedBy().size() : 0;
			int commentCount = commentService.countCommentsForPost(postId);

			// Create a simple stats map
			Map<String, Integer> stats = new HashMap<>();
			stats.put("likes", likeCount);
			stats.put("comments", commentCount);

			response.setMessage("Post stats retrieved successfully");
			response.setStatus(200);
			response.setData(stats);

			return new ResponseEntity<>(response, HttpStatus.OK);
		} catch (Exception e) {
			response.setMessage("Error retrieving post stats");
			response.setStatus(500);
			response.setData(e.getMessage());
			return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

}
