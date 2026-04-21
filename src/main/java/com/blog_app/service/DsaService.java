package com.blog_app.service;

import com.blog_app.entity.DsaSheet;
import com.blog_app.entity.DsaTopic;
import com.blog_app.entity.DsaProblem;
import java.util.List;

public interface DsaService {
    // Sheet methods
    DsaSheet saveSheet(DsaSheet sheet);
    List<DsaSheet> getAllSheets();
    DsaSheet getSheetById(Long id);
    void deleteSheet(Long id);

    // Topic methods
    DsaTopic saveTopic(DsaTopic topic, Long sheetId);
    List<DsaTopic> getTopicsBySheet(Long sheetId);
    void deleteTopic(Long id);

    // Problem methods
    DsaProblem saveProblem(DsaProblem problem, Long topicId);
    List<DsaProblem> getProblemsByTopic(Long topicId);
    void deleteProblem(Long id);
}
