package com.blog_app.service;

import java.util.List;

import com.blog_app.entity.Comment;
import com.blog_app.entity.User;

public interface CommentService {

//	 methods to manipulate comments
	
	Comment saveComment(Comment comment);
	
	void deleteComment(Long id);
	
	Comment updateComment(Comment comment , Long id);
	
	//List<Comment> findCommentsforPost(Long postId);
	
	Comment findCommentbyId(Long commentId);
	
	List<Comment> AllComments();
	
	List<Comment> findAllCommentsForPost(Long postId);
}
