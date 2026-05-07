package com.example.form;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.model.FormData;
import com.example.service.FormService;
import com.example.util.JwtUtil;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/form")
public class FormController {

    private final FormService formService;
    private final JwtUtil jwtUtil;
    private final ObjectMapper objectMapper;

    public FormController(FormService formService, JwtUtil jwtUtil, ObjectMapper objectMapper) {
        this.formService = formService;
        this.jwtUtil = jwtUtil;
        this.objectMapper = objectMapper;
    }

    @PostMapping("/submit")
    public ResponseEntity<Void> submitForm(@RequestHeader("Authorization") String token, @RequestBody FormData formData) {
        String userId = jwtUtil.extractUserId(token.replace("Bearer ", ""));
        formData.setUserId(userId);
        formService.submitForm(formData);
        saveFormDataToFile(formData);
        return ResponseEntity.ok().build();
    }

    private void saveFormDataToFile(FormData formData) {
        try {
            String formDataJson = objectMapper.writeValueAsString(formData);
            Files.write(Paths.get("data/submissions.json"), (formDataJson + System.lineSeparator()).getBytes(), StandardOpenOption.CREATE, StandardOpenOption.APPEND);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
