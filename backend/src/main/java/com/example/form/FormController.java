package com.example.form;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.model.FormData;
import com.example.service.FormService;
import com.example.util.JwtUtil;

@RestController
@RequestMapping("/api/form")
public class FormController {

    private final FormService formService;
    private final JwtUtil jwtUtil;

    public FormController(FormService formService, JwtUtil jwtUtil) {
        this.formService = formService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/submit")
    public ResponseEntity<Void> submitForm(@RequestHeader("Authorization") String token, @RequestBody FormData formData) {
        String userId = jwtUtil.extractUserId(token.replace("Bearer ", ""));
        formData.setUserId(userId);
        formService.submitForm(formData);
        return ResponseEntity.ok().build();
    }
}
