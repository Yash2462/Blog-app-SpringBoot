package com.blog_app.entity;

import java.time.LocalDateTime;
import java.util.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

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

	@Column(name = "post_description", columnDefinition = "TEXT")
	@NotBlank(message = "post description must not be blank")
	private String description;

	@Column(name = "post_image")
	@JsonProperty(defaultValue = "")
	private String postImage;
	

	@Column(name = "post_data", columnDefinition = "LONGTEXT")
	@NotBlank(message = "post data must not be blank")
	private String data;
    
//	here we define many to one relation instead of one to many from users side because it is recommended
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "user_id")
	private User user;
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "category_id")
	private Category category;

	@CreationTimestamp
	@Column(name = "created_at")
	@JsonProperty(value = "created_at")
	private LocalDateTime createdAt;
	
	//@OneToMany(mappedBy = "post" , cascade = CascadeType.ALL,fetch = FetchType.EAGER,orphanRemoval = true)
    //@JsonIgnore
	//private List<Comment> comments = new ArrayList<>();

	// count who liked the post
	@ManyToMany
	@JoinTable(
			name = "post_likes",
			joinColumns = @JoinColumn(name = "post_id"),
			inverseJoinColumns = @JoinColumn(name = "user_id")
	)
	private Set<User> likedBy = new HashSet<>();
}
