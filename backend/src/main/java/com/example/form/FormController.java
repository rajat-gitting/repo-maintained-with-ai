package com.example.form;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import java.util.List;
import java.util.ArrayList;
import java.util.HashMap;
import java.io.IOException;
import java.nio.file.StandardOpenOption;

@RestController
@RequestMapping("/form")
public class FormController {

    private static final String SUBMISSIONS_FILE = System.getenv("SUBMISSIONS_FILE_PATH");
    private ObjectMapper objectMapper = new ObjectMapper();

    @PostMapping("/submit")
    public ResponseEntity<String> submitFormData(@RequestBody Map<String, Object> formData) {
        try {
            String userId = (String) formData.get("userId");
            if (userId == null || userId.isEmpty()) {
                return new ResponseEntity<>("User ID is required", HttpStatus.BAD_REQUEST);
            }

            List<Map<String, Object>> submissions = readSubmissionsFromFile();

            Map<String, Object> submission = new HashMap<>(formData);
            submission.put("submissionId", UUID.randomUUID().toString());
            submissions.add(submission);

            Files.write(Paths.get(SUBMISSIONS_FILE), objectMapper.writeValueAsBytes(submissions), StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);

            return new ResponseEntity<>("Form submitted successfully", HttpStatus.CREATED);
        } catch (JsonProcessingException e) {
            return new ResponseEntity<>("Error processing form data", HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (IOException e) {
            return new ResponseEntity<>("Error submitting form", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private List<Map<String, Object>> readSubmissionsFromFile() throws IOException {
        if (Files.exists(Paths.get(SUBMISSIONS_FILE))) {
            byte[] jsonData = Files.readAllBytes(Paths.get(SUBMISSIONS_FILE));
            try {
                return objectMapper.readValue(jsonData, List.class);
            } catch (JsonProcessingException e) {
                throw new IOException("Malformed JSON in submissions file", e);
            }
        }
        return new ArrayList<>();
    }
}
