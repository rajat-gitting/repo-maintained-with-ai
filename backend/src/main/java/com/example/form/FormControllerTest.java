package com.example.form;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class FormControllerTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    public void testSubmitFormData() {
        Map<String, Object> formData = new HashMap<>();
        formData.put("userId", "12345");
        formData.put("firstName", "John");
        formData.put("lastName", "Doe");

        ResponseEntity<String> response = restTemplate.postForEntity("/submitForm", formData, String.class);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Form submitted successfully", response.getBody());
    }

    @Test
    public void testSubmitFormDataWithoutUserId() {
        Map<String, Object> formData = new HashMap<>();
        formData.put("firstName", "John");
        formData.put("lastName", "Doe");

        ResponseEntity<String> response = restTemplate.postForEntity("/submitForm", formData, String.class);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("User ID is required", response.getBody());
    }
}
