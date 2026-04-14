package com.blog_app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.blog_app.entity.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long>{

	 Role findByName(String name);
}
