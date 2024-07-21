package com.blog_app.entity;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	@Column(name = "username")
	@JsonProperty(value = "username")
	@NotBlank(message = "username must not be empty")
	private String username;
	@Column(name = "password")
	@JsonProperty(value = "password")
    @NotBlank(message = "password must not be empty")
    @Size(min = 6 , message = "password must be minimum 6 length")
	private String password;
	
	@Column(name = "email")
	@NotBlank(message ="email must not be empty")
	@Email(message = "email must be valid")
	private String email;
	@Column(name = "about_user")
	private String about;
	
	 @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
	    @JoinTable(name = "users_roles",
	        joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id"),
	            inverseJoinColumns = @JoinColumn(name = "role_id", referencedColumnName = "id")
	    )
	    private Set<Role> roles;
	
		/*
		 * @OneToMany(mappedBy = "user", fetch = FetchType.EAGER, cascade
		 * =CascadeType.ALL , orphanRemoval =true )
		 * 
		 * @JsonIgnore private List<Post> posts = new ArrayList<>();
		 */
	
	/*
	 * @OneToMany(mappedBy = "user" , fetch = FetchType.EAGER,cascade =
	 * CascadeType.ALL,orphanRemoval = true)
	 * 
	 * @JsonIgnore private List<Comment> comments = new ArrayList<>();
	 */
}
