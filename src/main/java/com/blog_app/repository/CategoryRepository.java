package com.blog_app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.blog_app.entity.Category;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long>{
    Category findByName(String name);
    Optional<Category> findBySlug(String slug);
}
