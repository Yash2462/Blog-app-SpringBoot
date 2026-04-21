package com.blog_app.controller;

import com.blog_app.entity.CheatSheet;
import com.blog_app.service.CheatSheetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/cheat-sheets")
public class CheatSheetController {

    @Autowired
    private CheatSheetService cheatSheetService;

    @GetMapping
    public ResponseEntity<List<CheatSheet>> getAll() {
        return ResponseEntity.ok(cheatSheetService.getAllCheatSheets());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CheatSheet> create(@RequestBody CheatSheet cheatSheet) {
        return ResponseEntity.ok(cheatSheetService.saveCheatSheet(cheatSheet));
    }
}
