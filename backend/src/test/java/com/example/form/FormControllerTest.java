package com.example.form;

import com.example.model.FormData;
import com.example.service.FormService;
import com.example.util.JwtUtil;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class FormControllerTest {

    @Mock
    private FormService formService;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private FormController formController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSubmitFormSuccess() {
        FormData formData = new FormData();
        formData.setUserId("1");

        when(jwtUtil.validateToken(anyString())).thenReturn(true);
        when(jwtUtil.extractUserId(anyString())).thenReturn("1");

        ResponseEntity<Void> response = formController.submitForm("Bearer jwtToken", formData);

        assertEquals(200, response.getStatusCodeValue());
    }

    @Test
    void testSubmitFormInvalidToken() {
        FormData formData = new FormData();

        when(jwtUtil.validateToken(anyString())).thenReturn(false);

        ResponseEntity<Void> response = formController.submitForm("Bearer invalidToken", formData);

        assertEquals(401, response.getStatusCodeValue());
    }
}
