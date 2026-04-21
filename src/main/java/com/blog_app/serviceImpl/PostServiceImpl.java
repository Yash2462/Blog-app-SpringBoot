package com.blog_app.serviceImpl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.blog_app.entity.Category;
import com.blog_app.entity.Post;
import com.blog_app.entity.User;
import com.blog_app.exception.PostNotFoundException;
import com.blog_app.repository.CategoryRepository;
import com.blog_app.repository.PostRepository;
import com.blog_app.service.PostService;
import com.blog_app.service.UserService;


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
        return postRepository.findById(id).orElseThrow(PostNotFoundException::new);
	}

	@Override
	public void deletePost(Long id) {
		try {
			postRepository.deletePost(id);
			logger.info("post deleted Successfully");
		}catch (Exception e) {
			logger.info("error in delete post :{}",e.getMessage());
		}
		
	}

	@Override
	public Post savePost(Post post) {
		try {
			postRepository.save(post);
			logger.info("post saved successfully");
		}catch (Exception e) {
			logger.info("error in saving post : {} ",e.getMessage());
		}
		return post;
	}

	@Override
	public Post updatePost(Post post , Long id) {
		Post savedpost = findPost(id);
		
		try {
			if (post.getTitle() != null) savedpost.setTitle(post.getTitle());
			if (post.getData() != null) savedpost.setData(post.getData());
			if (post.getPostImage() != null) savedpost.setPostImage(post.getPostImage());
			if (post.getType() != null) savedpost.setType(post.getType());
			if (post.getDifficulty() != null) savedpost.setDifficulty(post.getDifficulty());
			if (post.getSolutionCode() != null) savedpost.setSolutionCode(post.getSolutionCode());
			if (post.getTechStack() != null) savedpost.setTechStack(post.getTechStack());
			
			postRepository.save(savedpost);
			
			logger.info("post updated successfully");
		}catch (Exception e) {
			logger.info("error in updating post {}:",e.getMessage());
		}
		return savedpost;
	}

	@Override
	public List<Post> findAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc();
	}

	@Override
	public Page<Post> findAllPostsPaginated(Pageable pageable) {
		return postRepository.findAll(pageable);
	}

	@Override
	public List<Post> findPostsByUser(Long userId) {
		User user = userService.findUserById(userId);
        return postRepository.findByUserOrderByCreatedAtDesc(user);
	}

	@Override
	public List<Post> findLikedPostByUser(Long userId) {
		return postRepository.findByLikedBy_Id(userId);
	}

	@Override
	public List<Post> findPostsByCategory(Long categoryId) {
		Category category = categoryRepository.findById(categoryId).orElseThrow();
        return postRepository.findByCategory(category);
	}

	@Override
	public List<Post> findPosts(String query) {
		return postRepository.findByTitleContainingIgnoreCaseOrDataContainingIgnoreCase(query, query);
	}

	@Override
	public List<Post> findPostsByType(com.blog_app.entity.PostType type) {
		return postRepository.findByType(type);
	}

}
