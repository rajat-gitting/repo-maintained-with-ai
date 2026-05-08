package com.example.auth;

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
public class AuthControllerTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    public void testSignupUser() {
        Map<String, String> user = new HashMap<>();
        user.put("email", "test@example.com");
        user.put("password", "password123");

        ResponseEntity<String> response = restTemplate.postForEntity("/signup", user, String.class);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals("User registered successfully", response.getBody());
    }

    @Test
    public void testLoginUser() {
        Map<String, String> user = new HashMap<>();
        user.put("email", "test@example.com");
        user.put("password", "password123");

        ResponseEntity<String> response = restTemplate.postForEntity("/login", user, String.class);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        // Additional assertions can be made to check the token format
    }
}
