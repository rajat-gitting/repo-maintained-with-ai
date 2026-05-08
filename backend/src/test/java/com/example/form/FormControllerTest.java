package com.example.form;

import com.example.form.model.FormData;
import com.example.form.service.FormService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;

class FormControllerTest {

    @Mock
    private FormService formService;

    @InjectMocks
    private FormController formController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSubmitFormSuccess() throws Exception {
        FormData formData = new FormData();
        formData.setUserId("user123");
        formData.setFirstName("John");
        formData.setLastName("Doe");
        // Set other fields as needed

        doNothing().when(formService).saveFormData(formData);

        ResponseEntity<Void> response = formController.submitForm(formData);

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void testSubmitFormFailure() throws Exception {
        FormData formData = new FormData();
        formData.setUserId("user123");
        formData.setFirstName("John");
        formData.setLastName("Doe");
        // Set other fields as needed

        doThrow(new IOException()).when(formService).saveFormData(formData);

        ResponseEntity<Void> response = formController.submitForm(formData);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
    }
}
