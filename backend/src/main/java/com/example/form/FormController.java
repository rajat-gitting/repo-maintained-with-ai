package com.example.form;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.model.FormData;
import com.example.service.FormService;

@RestController
@RequestMapping("/api/form")
public class FormController {

    private final FormService formService;

    public FormController(FormService formService) {
        this.formService = formService;
    }

    @PostMapping("/submit")
    public ResponseEntity<Void> submitForm(@RequestBody FormData formData) {
        return formService.submitForm(formData);
    }
}
