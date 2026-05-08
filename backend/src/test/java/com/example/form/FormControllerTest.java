package com.example.form;

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
public class FormControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private static final String SUBMISSIONS_FILE_PATH = "data/submissions.json";

    @BeforeEach
    public void setUp() throws Exception {
        Files.deleteIfExists(Paths.get(SUBMISSIONS_FILE_PATH));
    }

    @Test
    public void testSubmitFormDataSuccess() throws Exception {
        String formDataJson = "{"userId":"user123", "firstName":"John", "lastName":"Doe"}";

        mockMvc.perform(post("/submitForm")
                .contentType(MediaType.APPLICATION_JSON)
                .content(formDataJson))
                .andExpect(status().isCreated())
                .andExpect(content().string("Form submitted successfully."));
    }

    @Test
    public void testSubmitFormDataBadRequest() throws Exception {
        String formDataJson = "{"firstName":"John", "lastName":"Doe"}";

        mockMvc.perform(post("/submitForm")
                .contentType(MediaType.APPLICATION_JSON)
                .content(formDataJson))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("User ID is required."));
    }

    @Test
    public void testSubmitFormDataInternalServerError() throws Exception {
        Files.createDirectories(Paths.get("data"));
        Files.write(Paths.get(SUBMISSIONS_FILE_PATH), "invalid json".getBytes());

        String formDataJson = "{"userId":"user123", "firstName":"John", "lastName":"Doe"}";

        mockMvc.perform(post("/submitForm")
                .contentType(MediaType.APPLICATION_JSON)
                .content(formDataJson))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string("Error saving form submission."));
    }
}
