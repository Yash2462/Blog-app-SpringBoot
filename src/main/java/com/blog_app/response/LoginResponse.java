package com.blog_app.response;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL) // it excludes null fields when we send response in responseEntity
public class LoginResponse {

	private String token;
	private int status;
	private String message;
	private String token_type;
}
