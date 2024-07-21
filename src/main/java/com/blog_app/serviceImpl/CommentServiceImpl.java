package com.blog_app.serviceImpl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.blog_app.entity.Comment;
import com.blog_app.entity.Post;
import com.blog_app.exception.CommentNotFoundException;
import com.blog_app.repository.CommentRepository;
import com.blog_app.service.CommentService;
import com.blog_app.service.PostService;

@Service
public class CommentServiceImpl  implements CommentService{
	
	Logger logger = LoggerFactory.getLogger(CommentServiceImpl.class);
	
	@Autowired
	private CommentRepository commentRepository;
	
	@Autowired
	private PostService postService;

	@Override
	public Comment saveComment(Comment comment) {
		try {
			commentRepository.save(comment);
			logger.info("comment saved successfully");
		}catch (Exception e) {
			logger.info("error in comment save :"+e);
		}
		return comment;
	}

	@Override
	public void deleteComment(Long id) {
		try {
			commentRepository.deleteById(id);
			logger.info("comment deleted successfully");
		}catch (Exception e) {
			logger.info("error in delete comment");
		}
	}

	@Override
	public Comment updateComment(Comment comment , Long id) {
		
		Comment savedComment = findCommentbyId(id);
		try {
			savedComment.setComment(comment.getComment());
			commentRepository.save(savedComment);
			logger.info("comment updated successfully");
		}catch (Exception e) {
			logger.info("error in update comment");
		}
		return savedComment;
	}


	@Override
	public List<Comment> AllComments() {
		List<Comment> comments = commentRepository.findAll();
		return comments;
	}

	@Override
	public Comment findCommentbyId(Long commentId) {
		Comment comment = commentRepository.findById(commentId).orElseThrow(() -> new CommentNotFoundException());
		return comment;
	}

	@Override
	public List<Comment> findAllCommentsForPost(Long postId) {
		
		List<Comment> comments = commentRepository.findCommentsByPostId(postId);
		return comments;
	}

}
