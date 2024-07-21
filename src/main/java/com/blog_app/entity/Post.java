package com.blog_app.entity;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "posts")
public class Post {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long postId;
	
	@Column(name = "post_title")
	@NotBlank(message= "post title must not be blank")
	private String title;
	@Column(name = "post_image")
	@JsonProperty(defaultValue = "")
	private String postImage;
	
	@Column(name = "is_favourite")
	boolean isFavourite = false;
	
	@Column(name = "post_data")
	@NotBlank(message = "post data must not be blank")
	private String data;
    
//	here we define many to one relation instead of one to many from users side because it is recommended
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "user_id")
	private User user;
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "category_id")
	private Category category;
	
	//@OneToMany(mappedBy = "post" , cascade = CascadeType.ALL,fetch = FetchType.EAGER,orphanRemoval = true)
    //@JsonIgnore
	//private List<Comment> comments = new ArrayList<>();
}
