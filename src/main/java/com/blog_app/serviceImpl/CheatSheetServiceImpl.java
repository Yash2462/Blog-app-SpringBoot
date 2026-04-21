package com.blog_app.serviceImpl;

import com.blog_app.entity.CheatSheet;
import com.blog_app.repository.CheatSheetRepository;
import com.blog_app.service.CheatSheetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CheatSheetServiceImpl implements CheatSheetService {

    @Autowired
    private CheatSheetRepository cheatSheetRepository;

    @Override
    public CheatSheet saveCheatSheet(CheatSheet cheatSheet) {
        return cheatSheetRepository.save(cheatSheet);
    }

    @Override
    public List<CheatSheet> getAllCheatSheets() {
        return cheatSheetRepository.findAll();
    }

    @Override
    public CheatSheet getCheatSheetById(Long id) {
        return cheatSheetRepository.findById(id).orElse(null);
    }

    @Override
    public void deleteCheatSheet(Long id) {
        cheatSheetRepository.deleteById(id);
    }
}
