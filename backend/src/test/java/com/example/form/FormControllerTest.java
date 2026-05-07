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
import static org.mockito.ArgumentMatchers.any;
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
        String token = "Bearer validToken";

        when(jwtUtil.validateToken(any())).thenReturn(true);
        when(jwtUtil.extractUserId(any())).thenReturn("userId");

        ResponseEntity<Void> response = formController.submitForm(token, formData);

        assertEquals(200, response.getStatusCodeValue());
        verify(formService, times(1)).submitForm(any());
    }

    @Test
    void testSubmitFormInvalidToken() {
        FormData formData = new FormData();
        String token = "Bearer invalidToken";

        when(jwtUtil.validateToken(any())).thenReturn(false);

        ResponseEntity<Void> response = formController.submitForm(token, formData);

        assertEquals(401, response.getStatusCodeValue());
    }

    @Test
    void testSubmitFormJwtException() {
        FormData formData = new FormData();
        String token = "Bearer token";

        doThrow(new ExpiredJwtException(null, null, "Token expired")).when(jwtUtil).validateToken(any());

        ResponseEntity<Void> response = formController.submitForm(token, formData);

        assertEquals(401, response.getStatusCodeValue());
    }
}
