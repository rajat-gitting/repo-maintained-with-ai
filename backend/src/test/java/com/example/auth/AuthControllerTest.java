package com.example.auth;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.nio.file.Files;
import java.nio.file.Paths;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private static final String USERS_FILE_PATH = "data/users.json";

    @BeforeEach
    public void setUp() throws Exception {
        Files.deleteIfExists(Paths.get(USERS_FILE_PATH));
    }

    @Test
    public void testSignupUserSuccess() throws Exception {
        String userJson = "{"email":"test@example.com", "password":"password123"}";

        mockMvc.perform(post("/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(userJson))
                .andExpect(status().isCreated())
                .andExpect(content().string("User registered successfully."));
    }

    @Test
    public void testSignupUserBadRequest() throws Exception {
        String userJson = "{"email":"test@example.com"}";

        mockMvc.perform(post("/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(userJson))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Email and password are required."));
    }

    @Test
    public void testSignupUserInternalServerError() throws Exception {
        Files.createDirectories(Paths.get("data"));
        Files.write(Paths.get(USERS_FILE_PATH), "invalid json".getBytes());

        String userJson = "{"email":"test@example.com", "password":"password123"}";

        mockMvc.perform(post("/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(userJson))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string("Error saving user data."));
    }
}
