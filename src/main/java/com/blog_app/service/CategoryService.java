package com.blog_app.service;

import java.util.List;

import com.blog_app.entity.Category;

public interface CategoryService {

     // create category
	Category createCategory(Category category);
	
	// update category
	Category updateCategory(Category category, Long categoryId) throws Exception;
	
	// get  All category
	List<Category> getAllCategory();
	
	// get category by Id
	Category getCategorybyId(Long id) throws Exception;
	
	void deleteCategory(Long id) throws Exception;
}
