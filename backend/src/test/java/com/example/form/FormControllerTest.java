package com.example.form;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

@SpringBootTest
@AutoConfigureMockMvc
public class FormControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    public void setup() throws Exception {
        Files.deleteIfExists(Paths.get("data/submissions.json"));
    }

    @Test
    public void testSubmitFormData() throws Exception {
        Map<String, Object> formData = new HashMap<>();
        formData.put("userId", "12345");
        formData.put("firstName", "John");
        formData.put("lastName", "Doe");

        mockMvc.perform(MockMvcRequestBuilders.post("/form/submit")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(formData)))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.content().string("Form submitted successfully"));
    }

    @Test
    public void testSubmitFormDataWithoutUserId() throws Exception {
        Map<String, Object> formData = new HashMap<>();
        formData.put("firstName", "John");
        formData.put("lastName", "Doe");

        mockMvc.perform(MockMvcRequestBuilders.post("/form/submit")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(formData)))
                .andExpect(MockMvcResultMatchers.status().isBadRequest())
                .andExpect(MockMvcResultMatchers.content().string("User ID is required"));
    }
}
