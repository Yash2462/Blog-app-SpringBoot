package com.blog_app.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewPageController {

	@GetMapping(value = {"/dashboard","/"})
	public String dashboard() {
		return "dashboard";
	}
	
	@GetMapping(value = "/login")
	public String login(){
		return "login";
	}
	
	@GetMapping(value = "/signup")
	public String signup(){
		return "signup";
	}
	
}
