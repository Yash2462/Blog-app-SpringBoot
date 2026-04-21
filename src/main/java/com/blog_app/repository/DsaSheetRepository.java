package com.blog_app.repository;

import com.blog_app.entity.DsaSheet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DsaSheetRepository extends JpaRepository<DsaSheet, Long> {
}
