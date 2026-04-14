package com.blog_app.controller;

import com.blog_app.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/upload")
public class FileController {

    @Autowired
    private FileService fileService;

    @Value("${project.image}")
    private String path;

    @PostMapping
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("image") MultipartFile image) {
        Map<String, String> response = new HashMap<>();
        try {
            String fileName = fileService.uploadImage(path, image);
            // Construct the public URL
            String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/uploads/")
                    .path(fileName)
                    .toUriString();
            
            response.put("url", fileDownloadUri);
            response.put("fileName", fileName);
            return new ResponseEntity<>(response, HttpStatus.OK);
            
        } catch (IOException e) {
            e.printStackTrace();
            response.put("error", "Image uploading failed");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
