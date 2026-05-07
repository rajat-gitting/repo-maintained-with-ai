package com.example.form;

import com.example.model.FormData;
import com.example.service.FormService;
import com.example.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureException;

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

        when(jwtUtil.validateToken("validToken")).thenReturn(true);
        doNothing().when(formService).submitForm(formData);

        ResponseEntity<Void> response = formController.submitForm(token, formData);

        assertEquals(200, response.getStatusCodeValue());
    }

    @Test
    void testSubmitFormInvalidToken() {
        FormData formData = new FormData();
        String token = "Bearer invalidToken";

        when(jwtUtil.validateToken("invalidToken")).thenReturn(false);

        ResponseEntity<Void> response = formController.submitForm(token, formData);

        assertEquals(401, response.getStatusCodeValue());
    }

    @Test
    void testSubmitFormServiceFailure() {
        FormData formData = new FormData();
        String token = "Bearer validToken";

        when(jwtUtil.validateToken("validToken")).thenReturn(true);
        doThrow(new RuntimeException("Service failure")).when(formService).submitForm(formData);

        ResponseEntity<Void> response = formController.submitForm(token, formData);

        assertEquals(500, response.getStatusCodeValue());
    }
}
