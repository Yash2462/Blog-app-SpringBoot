package com.blog_app.entity;

import jakarta.persistence.*;
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
@Table(name = "cheat_sheets")
public class CheatSheet {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    private String techTags;

    private String fileUrl; // For PDF downloads

    @Column(columnDefinition = "LONGTEXT")
    private String content; // Optional Markdown fallback
}
