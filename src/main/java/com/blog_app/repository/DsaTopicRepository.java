package com.blog_app.repository;

import com.blog_app.entity.DsaTopic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DsaTopicRepository extends JpaRepository<DsaTopic, Long> {
    List<DsaTopic> findByDsaSheetIdOrderByOrderIndexAsc(Long dsaSheetId);
}
