package com.example.form.service;

import com.example.form.model.FormData;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class FormService {

    private static final String SUBMISSIONS_FILE_PATH = "data/submissions.json";
    private final ObjectMapper objectMapper;

    public FormService() {
        this.objectMapper = new ObjectMapper();
    }

    public void saveFormData(FormData formData) throws IOException {
        List<FormData> submissions = readSubmissionsFromFile();
        submissions.add(formData);
        writeSubmissionsToFile(submissions);
    }

    private List<FormData> readSubmissionsFromFile() throws IOException {
        File file = new File(SUBMISSIONS_FILE_PATH);
        if (!file.exists()) {
            return new ArrayList<>();
        }
        return objectMapper.readValue(file, objectMapper.getTypeFactory().constructCollectionType(List.class, FormData.class));
    }

    private void writeSubmissionsToFile(List<FormData> submissions) throws IOException {
        objectMapper.writeValue(new File(SUBMISSIONS_FILE_PATH), submissions);
    }
}
