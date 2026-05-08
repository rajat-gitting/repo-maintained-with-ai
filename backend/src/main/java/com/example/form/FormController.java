package com.example.form;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;

@RestController
public class FormController {

    private static final String SUBMISSIONS_FILE_PATH = "data/submissions.json";
    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostMapping("/submitForm")
    public ResponseEntity<String> submitFormData(@RequestBody Map<String, Object> formData) {
        String userId = (String) formData.get("userId");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User ID is required.");
        }

        try {
            Map<String, Object> submissions = loadSubmissions();
            submissions.put(userId, formData);
            saveSubmissions(submissions);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving form submission.");
        }

        return ResponseEntity.status(HttpStatus.CREATED).body("Form submitted successfully.");
    }

    private Map<String, Object> loadSubmissions() throws IOException {
        if (!Files.exists(Paths.get(SUBMISSIONS_FILE_PATH))) {
            return new HashMap<>();
        }
        return objectMapper.readValue(Files.readAllBytes(Paths.get(SUBMISSIONS_FILE_PATH)), new TypeReference<Map<String, Object>>() {});
    }

    private void saveSubmissions(Map<String, Object> submissions) throws IOException {
        try (FileWriter fileWriter = new FileWriter(SUBMISSIONS_FILE_PATH)) {
            objectMapper.writeValue(fileWriter, submissions);
        }
    }
}
