package com.blog_app.repository;

import com.blog_app.entity.DsaProblem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DsaProblemRepository extends JpaRepository<DsaProblem, Long> {
    List<DsaProblem> findByDsaTopicIdOrderByOrderIndexAsc(Long dsaTopicId);
}
