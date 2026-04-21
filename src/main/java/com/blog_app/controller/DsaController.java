package com.blog_app.controller;

import com.blog_app.entity.DsaProblem;
import com.blog_app.entity.DsaSheet;
import com.blog_app.entity.DsaTopic;
import com.blog_app.response.ResponseMessageVo;
import com.blog_app.service.DsaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/dsa")
public class DsaController {

    @Autowired
    private DsaService dsaService;

    // Public endpoints
    @GetMapping("/sheets")
    public ResponseEntity<List<DsaSheet>> getAllSheets() {
        return ResponseEntity.ok(dsaService.getAllSheets());
    }

    @GetMapping("/sheets/{id}")
    public ResponseEntity<DsaSheet> getSheet(@PathVariable Long id) {
        return ResponseEntity.ok(dsaService.getSheetById(id));
    }

    // Admin endpoints
    @PostMapping("/sheets")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DsaSheet> createSheet(@RequestBody DsaSheet sheet) {
        return ResponseEntity.ok(dsaService.saveSheet(sheet));
    }

    @PostMapping("/sheets/{sheetId}/topics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DsaTopic> createTopic(@RequestBody DsaTopic topic, @PathVariable Long sheetId) {
        return ResponseEntity.ok(dsaService.saveTopic(topic, sheetId));
    }

    @PostMapping("/topics/{topicId}/problems")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DsaProblem> createProblem(@RequestBody DsaProblem problem, @PathVariable Long topicId) {
        return ResponseEntity.ok(dsaService.saveProblem(problem, topicId));
    }
}
