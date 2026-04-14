package com.blog_app.serviceImpl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.blog_app.entity.Category;
import com.blog_app.repository.CategoryRepository;
import com.blog_app.service.CategoryService;

@Service
public class CategoryServiceImpl implements CategoryService{
	
	Logger logger = LoggerFactory.getLogger(CategoryServiceImpl.class);
	
	@Autowired
	private CategoryRepository categoryRepository;

	@Override
	public Category createCategory(Category category) {
		Category createdCategory = new Category();
		createdCategory.setName(category.getName());
		return categoryRepository.save(createdCategory);
	}

	@Override
	public Category updateCategory(Category category, Long categoryId) throws Exception{
		Category updateCategory = categoryRepository.findById(categoryId).orElseThrow(()-> new Exception("Not found category"));
		updateCategory.setName(category.getName());
		return categoryRepository.save(updateCategory);
	}

	@Override
	public List<Category> getAllCategory() {
		List<Category> categories = categoryRepository.findAll();
		return categories;
	}

	@Override
	public Category getCategorybyId(Long id) throws Exception{
		Category category = categoryRepository.findById(id).orElseThrow(() -> new Exception("Not found category"));
		return category;
	}

	@Override
	public void deleteCategory(Long id) throws Exception{
		try {
			categoryRepository.deleteById(id);
			logger.info("category deleted successfully");
		}catch (Exception e) {
			throw new Exception("Error in delete category : "+e.getMessage());
		}
		
	}

}
