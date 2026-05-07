package com.example.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.model.User;
import com.example.model.UserDto;
import com.example.service.AuthService;
import com.example.util.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.nio.channels.FileChannel;
import java.nio.channels.FileLock;
import java.io.IOException;
import java.nio.file.NoSuchFileException;
import java.nio.file.AccessDeniedException;
import java.nio.file.Path;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private final AuthService authService;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final ObjectMapper objectMapper;

    public AuthController(AuthService authService, BCryptPasswordEncoder passwordEncoder, JwtUtil jwtUtil, ObjectMapper objectMapper) {
        this.authService = authService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.objectMapper = objectMapper;
    }

    @PostMapping("/signup")
    public ResponseEntity<User> signUp(@RequestBody UserDto userDto) {
        userDto.setPassword(passwordEncoder.encode(userDto.getPassword()));
        User user = authService.signUp(userDto);
        try {
            saveUserToFile(user);
        } catch (IOException e) {
            logger.error("Failed to save user to file", e);
            return ResponseEntity.status(500).build();
        }
        return ResponseEntity.ok(user);
    }

    private void saveUserToFile(User user) throws IOException {
        Path dataDir = Paths.get("data");
        if (!Files.exists(dataDir)) {
            Files.createDirectories(dataDir);
        }
        try (FileChannel channel = FileChannel.open(Paths.get("data/users.json"), StandardOpenOption.CREATE, StandardOpenOption.WRITE, StandardOpenOption.APPEND);
             FileLock lock = channel.lock()) {
            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", user.getId());
            userMap.put("firstName", user.getFirstName());
            userMap.put("lastName", user.getLastName());
            userMap.put("email", user.getEmail());
            String userJson = objectMapper.writeValueAsString(userMap);
            channel.write(java.nio.ByteBuffer.wrap((userJson + System.lineSeparator()).getBytes()));
        } catch (NoSuchFileException | AccessDeniedException e) {
            logger.error("File access error", e);
            throw new IOException("File access error", e);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody UserDto userDto) {
        User user = authService.login(userDto);
        if (user == null || !passwordEncoder.matches(userDto.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
        String token = jwtUtil.generateToken(user);
        return ResponseEntity.ok(token);
    }
}
