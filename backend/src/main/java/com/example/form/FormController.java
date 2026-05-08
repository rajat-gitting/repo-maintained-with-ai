package com.example.form;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.Map;
import java.util.HashMap;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import java.io.IOException;
import java.util.List;
import java.util.ArrayList;

@RestController
public class FormController {

    private static final String SUBMISSIONS_FILE = "data/submissions.json";
    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostMapping("/submitForm")
    public ResponseEntity<String> submitFormData(@RequestBody Map<String, Object> formData) {
        try {
            String userId = (String) formData.get("userId");
            if (userId == null || userId.isEmpty()) {
                return new ResponseEntity<>("User ID is required", HttpStatus.BAD_REQUEST);
            }

            // Tag submission with userId
            Map<String, Object> submission = new HashMap<>(formData);
            submission.put("userId", userId);

            // Convert submission to JSON string
            String submissionJson = objectMapper.writeValueAsString(submission);

            // Append submission to the JSON file
            Files.write(Paths.get(SUBMISSIONS_FILE), (submissionJson + System.lineSeparator()).getBytes(), StandardOpenOption.CREATE, StandardOpenOption.APPEND);

            return new ResponseEntity<>("Form submitted successfully", HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>("Error submitting form", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
