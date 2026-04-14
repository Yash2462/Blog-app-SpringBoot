package com.blog_app.serviceImpl;

import com.blog_app.service.FileService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class LocalFileServiceImpl implements FileService {

    @Override
    public String uploadImage(String path, MultipartFile file) throws IOException {
        String name = file.getOriginalFilename();
        
        // Random name generation file
        String randomID = UUID.randomUUID().toString();
        String fileName1 = randomID.concat(name.substring(name.lastIndexOf(".")));
        
        // Fullpath
        String filePath = path + File.separator + fileName1;
        
        // Create folder if not created
        File f = new File(path);
        if (!f.exists()) {
            f.mkdir();
        }
        
        // File copy
        Files.copy(file.getInputStream(), Paths.get(filePath));
        
        return fileName1;
    }
}
