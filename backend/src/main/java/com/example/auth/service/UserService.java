package com.example.auth.service;

import com.example.auth.model.User;
import com.example.auth.model.UserDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {

    private static final String USERS_FILE_PATH = "data/users.json";
    private final BCryptPasswordEncoder passwordEncoder;
    private final ObjectMapper objectMapper;

    public UserService() {
        this.passwordEncoder = new BCryptPasswordEncoder();
        this.objectMapper = new ObjectMapper();
    }

    public User signUp(UserDto userDto) throws IOException {
        User user = new User();
        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        user.setEmail(userDto.getEmail());
        user.setPasswordHash(passwordEncoder.encode(userDto.getPassword()));

        List<User> users = readUsersFromFile();
        users.add(user);
        writeUsersToFile(users);

        return user;
    }

    private List<User> readUsersFromFile() throws IOException {
        File file = new File(USERS_FILE_PATH);
        if (!file.exists()) {
            return new ArrayList<>();
        }
        return objectMapper.readValue(file, objectMapper.getTypeFactory().constructCollectionType(List.class, User.class));
    }

    private void writeUsersToFile(List<User> users) throws IOException {
        objectMapper.writeValue(new File(USERS_FILE_PATH), users);
    }
}
