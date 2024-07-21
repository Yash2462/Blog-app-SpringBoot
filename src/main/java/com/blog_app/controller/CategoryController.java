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
import org.springframework.web.bind.annotation.RestController;

import com.blog_app.entity.Category;
import com.blog_app.response.ResponseMessageVo;
import com.blog_app.service.CategoryService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/category")
public class CategoryController {
	
	@Autowired
	private CategoryService categoryService;

	@PostMapping
	public ResponseEntity<Object> createCategory(@Valid @RequestBody Category category){
		ResponseMessageVo message = new ResponseMessageVo();
		try {
			Category create = categoryService.createCategory(category);
			
			message.setMessage("data save success");
			message.setStatus(200);
			
			return new ResponseEntity<>(message,HttpStatus.CREATED);
		}catch (Exception e) {
			message.setMessage("error :"+e.getMessage());
			message.setStatus(500);
			
			return new ResponseEntity<>(message,HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@GetMapping
	public ResponseEntity<Object> getAllCategory(){
		ResponseMessageVo message = new ResponseMessageVo();
		try {
			List<Category> categories = categoryService.getAllCategory();
			
			message.setMessage("data found");
			message.setStatus(200);
			message.setData(categories);
			
			return new ResponseEntity<>(message ,HttpStatus.OK);
		}catch (Exception e) {
           message.setMessage("error : "+e.getMessage());
           message.setStatus(500);
           
           return new ResponseEntity<>(message,HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@GetMapping("/{categoryId}")
	public ResponseEntity<Object> getCategory(@PathVariable Long categoryId){
		ResponseMessageVo message = new ResponseMessageVo();
		try {
			Category category = categoryService.getCategorybyId(categoryId);
			message.setMessage("data found");
			message.setStatus(200);
			message.setData(category);
			
			return new ResponseEntity<>(category ,HttpStatus.OK);
		}catch (Exception e) {
			message.setMessage("error :"+e.getMessage());
			message.setStatus(500);
			
			return new ResponseEntity<>(message,HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@PutMapping("/{categoryId}")
	public ResponseEntity<Object> updateCategory(@PathVariable Long categoryId , @RequestBody Category category){
		ResponseMessageVo messageVo = new ResponseMessageVo();
		
		try {
			Category updatedCategory = categoryService.updateCategory(category, categoryId);
			
			messageVo.setMessage("data update success");
			messageVo.setStatus(200);
			messageVo.setData(updatedCategory);
			
			return new ResponseEntity<>(messageVo,HttpStatus.OK);
		}catch (Exception e) {
			messageVo.setMessage("error :"+e.getMessage());
			messageVo.setStatus(500);
			
			return new ResponseEntity<>(messageVo,HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@DeleteMapping("/{categoryId}")
	public ResponseEntity<Object> deleteCategory(@PathVariable Long categoryId){
		ResponseMessageVo messageVo = new ResponseMessageVo();
		
		try {
			 categoryService.deleteCategory(categoryId);
			 
			 messageVo.setMessage("deleted successfully");
			 messageVo.setStatus(200);
			 
			 return new ResponseEntity<>(messageVo,HttpStatus.OK);
		}catch (Exception e) {
			messageVo.setMessage("error :"+e.getMessage());
			messageVo.setStatus(500);
			
			return new ResponseEntity<>(messageVo,HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
