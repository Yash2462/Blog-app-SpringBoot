package com.blog_app.config;

import com.blog_app.entity.*;
import com.blog_app.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Set;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired private RoleRepository roleRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private CategoryRepository categoryRepository;
    @Autowired private PostRepository postRepository;
    @Autowired private DsaSheetRepository dsaSheetRepository;
    @Autowired private DsaTopicRepository dsaTopicRepository;
    @Autowired private DsaProblemRepository dsaProblemRepository;
    @Autowired private CheatSheetRepository cheatSheetRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // 1. Seed Roles
        seedRole("ADMIN");
        seedRole("USER");

        // 2. Seed Admin User
        User admin = userRepository.findByEmail("admin@techcore.com");
        if (admin == null) {
            Role adminRole = roleRepository.findByName("ADMIN");
            admin = new User();
            admin.setUsername("YashAdmin");
            admin.setEmail("admin@techcore.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRoles(Set.of(adminRole));
            admin = userRepository.save(admin);
        }

        // 3. Seed Categories (Matching codewitharyan navigation)
        Category systemDesign = seedCategory("System Design", "system-design", "High Level and Low Level Design guides.");
        Category interviewExp = seedCategory("Interview Experience", "interview-experience", "Real interview stories from top companies.");
        Category contestSolutions = seedCategory("Contest Solution", "contest-solution", "Solutions for LeetCode, Codeforces, and more.");
        Category react = seedCategory("React", "react", "Modern Frontend development.");

        // 4. Seed Articles
        if (postRepository.count() == 0) {
            createArticle("Mastering System Design: The Intuitive Way", "system-design-intro",
                "Understanding scalable systems through intuition and trade-offs.",
                "System design is not about memorizing components, but about understanding trade-offs. In this guide, we dive into how to build a scalable chat application from scratch.", 
                admin, systemDesign);

            createArticle("My Goldman Sachs Interview Experience", "goldman-sachs-exp",
                "Detailed breakdown of 4 rounds of interviews at GS.",
                "I recently interviewed at Goldman Sachs for an SDE role. The process was quite standard but the questions were very deep on OS and Java fundamentals...", 
                admin, interviewExp);
        }

        // 5. Seed DSA Sheets
        if (dsaSheetRepository.count() == 0) {
            DsaSheet sheet = new DsaSheet();
            sheet.setTitle("Top 150 Interview Questions");
            sheet.setDescription("A curated list of problems asked in FAANG companies.");
            sheet = dsaSheetRepository.save(sheet);

            DsaTopic arrays = new DsaTopic();
            arrays.setName("Arrays & Hashing");
            arrays.setDsaSheet(sheet);
            arrays.setOrderIndex(1);
            arrays = dsaTopicRepository.save(arrays);

            DsaProblem p1 = new DsaProblem();
            p1.setTitle("Two Sum");
            p1.setDifficulty("EASY");
            p1.setPracticeLink("https://leetcode.com/problems/two-sum/");
            p1.setDsaTopic(arrays);
            p1.setOrderIndex(1);
            dsaProblemRepository.save(p1);
        }

        // 6. Seed Cheat Sheets
        if (cheatSheetRepository.count() == 0) {
            CheatSheet cs = new CheatSheet();
            cs.setTitle("SQL Mastery Cheat Sheet");
            cs.setDescription("From basic joins to advanced window functions.");
            cs.setTechTags("SQL, Database, Backend");
            cs.setContent("# SQL Cheat Sheet\n\n## Joins\n- INNER JOIN\n- LEFT JOIN...");
            cheatSheetRepository.save(cs);
        }
    }

    private void seedRole(String name) {
        if (roleRepository.findByName(name) == null) {
            Role role = new Role();
            role.setName(name);
            roleRepository.save(role);
        }
    }

    private Category seedCategory(String name, String slug, String desc) {
        Category cat = categoryRepository.findAll().stream()
                .filter(c -> c.getName().equalsIgnoreCase(name))
                .findFirst().orElse(null);
        if (cat == null) {
            cat = new Category();
            cat.setName(name);
            cat.setSlug(slug);
            cat.setDescription(desc);
            cat = categoryRepository.save(cat);
        }
        return cat;
    }

    private void createArticle(String title, String slug, String desc, String data, User user, Category cat) {
        Post p = new Post();
        p.setTitle(title);
        p.setSlug(slug);
        p.setDescription(desc);
        p.setData(data);
        p.setUser(user);
        p.setCategory(cat);
        p.setCreatedAt(LocalDateTime.now());
        postRepository.save(p);
    }
}
