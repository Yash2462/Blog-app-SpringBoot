package com.blog_app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.blog_app.entity.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment,Long>{

//	code to manipulate comments
	
	@Query(value = "select * from comments where post_id=:postId" , nativeQuery = true)
	List<Comment> findCommentsByPostId(Long postId);
}
