package com.blog_app.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blog_app.constant.AppConstants;
import com.blog_app.entity.Comment;
import com.blog_app.entity.CommentDto;
import com.blog_app.entity.Post;
import com.blog_app.entity.User;
import com.blog_app.response.ResponseMessageVo;
import com.blog_app.service.CommentService;
import com.blog_app.service.PostService;
import com.blog_app.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping(AppConstants.API+AppConstants.COMMENT)
public class CommentController {

	@Autowired
	private CommentService commentService;
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private PostService postService;
	
	//create comment for particular post
	@PostMapping("/user/{userId}/post/{postId}/createComment")
	public ResponseEntity<Object> createComment(@Valid @RequestBody Comment comment , @PathVariable Long postId, @PathVariable
	 Long userId){
		Post post = postService.findPost(postId);
		User user = userService.findUserById(userId);
		ResponseMessageVo response = new ResponseMessageVo();
		Comment createComment = new Comment();
		try {
		createComment.setComment(comment.getComment());
		createComment.setPost(post);
		createComment.setUser(user);
		commentService.saveComment(createComment);
		response.setMessage("saved commented");
		response.setStatus(201);
		response.setData(createComment);
		
		return new ResponseEntity<Object>(response,HttpStatus.CREATED);
	 }catch (Exception e) {
		 response.setMessage("error in saving comment");
		 response.setStatus(500);
		 response.setData(e.getMessage());
		 
		 return new ResponseEntity<Object>(response ,HttpStatus.INTERNAL_SERVER_ERROR);
	}
 }


	@PutMapping("/{commentId}")
	public ResponseEntity<Object> updateComment(@RequestBody CommentDto comment , @PathVariable Long commentId){
		ResponseMessageVo response = new ResponseMessageVo();
		Comment updateComment = commentService.findCommentbyId(commentId);
		try {
		updateComment.setComment(comment.getComment());
		commentService.updateComment(updateComment,commentId);
		response.setMessage("updated commented");
		response.setStatus(200);
		response.setData(updateComment);
		
		return new ResponseEntity<Object>(response,HttpStatus.OK);
	 }catch (Exception e) {
		 response.setMessage("error in updating comment");
		 response.setStatus(500);
		 response.setData(e.getMessage());
		 
		 return new ResponseEntity<Object>(response ,HttpStatus.INTERNAL_SERVER_ERROR);
	}
 }
	
	@DeleteMapping("/{commentId}")
	public ResponseEntity<Object> deleteComment(@PathVariable Long commentId){
		ResponseMessageVo response = new ResponseMessageVo();
		try {
			commentService.deleteComment(commentId);
		response.setMessage("deleted commented");
		response.setStatus(200);
		response.setData(null);
		
		return new ResponseEntity<Object>(response,HttpStatus.OK);
	 }catch (Exception e) {
		 response.setMessage("error in deleting comment");
		 response.setStatus(500);
		 response.setData(e.getMessage());
		 
		 return new ResponseEntity<Object>(response ,HttpStatus.INTERNAL_SERVER_ERROR);
	}
 }
	
	@GetMapping("/{commenttId}")
	public ResponseEntity<Object> findComment(@PathVariable Long commenttId){
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		 authentication.getAuthorities();
		 String currentusername =authentication.getName();
		 System.out.println("Current user :"+ currentusername);
		ResponseMessageVo response = new ResponseMessageVo();
		
		try {
			Comment comment =  commentService.findCommentbyId(commenttId);
		response.setMessage("found comment");
		response.setStatus(200);
		response.setData(comment);
		
		return new ResponseEntity<Object>(response,HttpStatus.OK);
	 }catch (Exception e) {
		 response.setMessage("not foun any comment for this post");
		 response.setStatus(500);
		 response.setData(e.getMessage());
		 
		 return new ResponseEntity<Object>(response ,HttpStatus.INTERNAL_SERVER_ERROR);
	}
 }
	@GetMapping("/post/{postId}")
	public ResponseEntity<Object> findCommentsForPost(@PathVariable Long postId){
		ResponseMessageVo vo = new ResponseMessageVo();
		
		try {
			List<Comment> comments = commentService.findAllCommentsForPost(postId);
			vo.setMessage("found comments for post");
			vo.setStatus(200);
			vo.setData(comments);
			
			return new ResponseEntity<>(vo,HttpStatus.OK);
		}catch (Exception e) {
			vo.setMessage("error in finding comments for post");
			vo.setStatus(200);
			
			return new ResponseEntity<>(vo,HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
