package com.example.englishaiapp.controller;

import com.example.englishaiapp.service.DataImportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/api/import")
public class DataImportController {

    @Autowired
    private DataImportService dataImportService;

    @GetMapping("/run")
    public ResponseEntity<String> runImport() {
        // IMPORTANT: Hardcoded path. Make sure this path is correct on your system.
        String sqlFilePath = "C:/Users/Administrator/CascadeProjects/english-ai-app/english-ai-app-backend/cet4_dict-master/wine_cet4_word.sql";
        
        try {
            dataImportService.importWordsFromSqlFile(sqlFilePath);
            return ResponseEntity.ok("Data import completed successfully!");
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Data import failed: " + e.getMessage());
        }
    }
}
