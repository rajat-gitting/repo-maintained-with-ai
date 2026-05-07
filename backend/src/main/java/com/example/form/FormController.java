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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.nio.channels.FileChannel;
import java.nio.channels.FileLock;
import java.io.IOException;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureException;
import java.nio.file.NoSuchFileException;
import java.nio.file.AccessDeniedException;

@RestController
@RequestMapping("/api/form")
public class FormController {

    private static final Logger logger = LoggerFactory.getLogger(FormController.class);
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
        try {
            if (!jwtUtil.validateToken(token.replace("Bearer ", ""))) {
                return ResponseEntity.status(401).build();
            }
            String userId = jwtUtil.extractUserId(token.replace("Bearer ", ""));
            formData.setUserId(userId);
            formService.submitForm(formData);
            saveFormDataToFile(formData);
            return ResponseEntity.ok().build();
        } catch (ExpiredJwtException | MalformedJwtException | SignatureException e) {
            logger.error("JWT token is invalid", e);
            return ResponseEntity.status(401).build();
        } catch (IOException e) {
            logger.error("Failed to save form data to file", e);
            return ResponseEntity.status(500).build();
        }
    }

    private void saveFormDataToFile(FormData formData) throws IOException {
        try (FileChannel channel = FileChannel.open(Paths.get("data/submissions.json"), StandardOpenOption.CREATE, StandardOpenOption.WRITE, StandardOpenOption.APPEND);
             FileLock lock = channel.lock()) {
            String formDataJson = objectMapper.writeValueAsString(formData);
            channel.write(java.nio.ByteBuffer.wrap((formDataJson + System.lineSeparator()).getBytes()));
        } catch (NoSuchFileException | AccessDeniedException e) {
            logger.error("File access error", e);
            throw new IOException("File access error", e);
        }
    }
}
