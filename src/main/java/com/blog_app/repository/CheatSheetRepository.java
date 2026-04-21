package com.blog_app.repository;

import com.blog_app.entity.CheatSheet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CheatSheetRepository extends JpaRepository<CheatSheet, Long> {
}
