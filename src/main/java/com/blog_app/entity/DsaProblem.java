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
@Table(name = "dsa_problems")
public class DsaProblem {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotBlank(message = "Title is required")
    private String title;

    private String difficulty; // EASY, MEDIUM, HARD

    private String practiceLink;

    private String videoSolutionUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "article_solution_id")
    private Post articleSolution; // Linking to an internal Post/Article

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dsa_topic_id")
    private DsaTopic dsaTopic;

    private Integer orderIndex;

    // Future Proofing for Code Editor
    @Column(columnDefinition = "LONGTEXT")
    private String problemDescription;

    @Column(columnDefinition = "LONGTEXT")
    private String startingCode; // JSON map for templates

    @Column(columnDefinition = "LONGTEXT")
    private String testCases; // JSON data
}
