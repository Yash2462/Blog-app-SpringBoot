package com.blog_app.serviceImpl;

import com.blog_app.entity.DsaProblem;
import com.blog_app.entity.DsaSheet;
import com.blog_app.entity.DsaTopic;
import com.blog_app.repository.DsaProblemRepository;
import com.blog_app.repository.DsaSheetRepository;
import com.blog_app.repository.DsaTopicRepository;
import com.blog_app.service.DsaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DsaServiceImpl implements DsaService {

    @Autowired
    private DsaSheetRepository dsaSheetRepository;

    @Autowired
    private DsaTopicRepository dsaTopicRepository;

    @Autowired
    private DsaProblemRepository dsaProblemRepository;

    @Override
    public DsaSheet saveSheet(DsaSheet sheet) {
        return dsaSheetRepository.save(sheet);
    }

    @Override
    public List<DsaSheet> getAllSheets() {
        return dsaSheetRepository.findAll();
    }

    @Override
    public DsaSheet getSheetById(Long id) {
        return dsaSheetRepository.findById(id).orElse(null);
    }

    @Override
    public void deleteSheet(Long id) {
        dsaSheetRepository.deleteById(id);
    }

    @Override
    public DsaTopic saveTopic(DsaTopic topic, Long sheetId) {
        DsaSheet sheet = dsaSheetRepository.findById(sheetId).orElseThrow();
        topic.setDsaSheet(sheet);
        return dsaTopicRepository.save(topic);
    }

    @Override
    public List<DsaTopic> getTopicsBySheet(Long sheetId) {
        return dsaTopicRepository.findByDsaSheetIdOrderByOrderIndexAsc(sheetId);
    }

    @Override
    public void deleteTopic(Long id) {
        dsaTopicRepository.deleteById(id);
    }

    @Override
    public DsaProblem saveProblem(DsaProblem problem, Long topicId) {
        DsaTopic topic = dsaTopicRepository.findById(topicId).orElseThrow();
        problem.setDsaTopic(topic);
        return dsaProblemRepository.save(problem);
    }

    @Override
    public List<DsaProblem> getProblemsByTopic(Long topicId) {
        return dsaProblemRepository.findByDsaTopicIdOrderByOrderIndexAsc(topicId);
    }

    @Override
    public void deleteProblem(Long id) {
        dsaProblemRepository.deleteById(id);
    }
}
