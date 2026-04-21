package com.blog_app.service;

import com.blog_app.entity.CheatSheet;
import java.util.List;

public interface CheatSheetService {
    CheatSheet saveCheatSheet(CheatSheet cheatSheet);
    List<CheatSheet> getAllCheatSheets();
    CheatSheet getCheatSheetById(Long id);
    void deleteCheatSheet(Long id);
}
