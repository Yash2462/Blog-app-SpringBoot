package com.blog_app.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import com.blog_app.response.ErrorResponse;

@ControllerAdvice
public class BlogAppGlobalException extends ResponseEntityExceptionHandler{

	@Override
	@Nullable
	protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
			HttpHeaders headers, HttpStatusCode status, WebRequest request) {
			Map<String, String> errors = new HashMap<>();
			ex.getBindingResult().getAllErrors().forEach((error) ->{
				
				String fieldName = ((FieldError) error).getField();
				String message = error.getDefaultMessage();
				errors.put(fieldName, message);
			});
			return new ResponseEntity<Object>(errors, HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(BlogNotFoundException.class)
	@ResponseStatus(HttpStatus.NOT_FOUND)
	@ResponseBody
	public ErrorResponse handleNoBlogFoundException(BlogNotFoundException ex) 
	{

	    ErrorResponse errorResponse = new ErrorResponse();
	    errorResponse.setMessage("No Record Found");
	    errorResponse.setStatus(404);
	    return errorResponse;
	}
	
	@ExceptionHandler(PostNotFoundException.class)
	@ResponseStatus(HttpStatus.NOT_FOUND)
	@ResponseBody
	public ErrorResponse handleNoPostFoundException(PostNotFoundException ex) 
	{

	    ErrorResponse errorResponse = new ErrorResponse();
	    errorResponse.setMessage("No Posts Found");
	    errorResponse.setStatus(404);
	    return errorResponse;
	}
	
	@ExceptionHandler(CommentNotFoundException.class)
	@ResponseStatus(HttpStatus.NOT_FOUND)
	@ResponseBody
	public ErrorResponse handleNoCommentFoundException(BlogNotFoundException ex) 
	{

	    ErrorResponse errorResponse = new ErrorResponse();
	    errorResponse.setMessage("No Comments Found");
	    errorResponse.setStatus(404);
	    return errorResponse;
	}
}

