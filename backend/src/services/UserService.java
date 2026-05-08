package com.example.backend.services;

import com.example.backend.models.UserProfile;
import com.example.backend.storage.UserStorage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserStorage userStorage;

    /**
     * Retrieve the user profile for a given user ID.
     *
     * @param userId the ID of the user
     * @return the user's profile
     */
    public UserProfile getUserProfile(String userId) {
        return userStorage.getUserProfile(userId);
    }

    /**
     * Update the user profile for a given user ID.
     *
     * @param userId the ID of the user
     * @param profile the new profile data
     * @return the updated user profile
     */
    public UserProfile updateUserProfile(String userId, UserProfile profile) {
        return userStorage.updateUserProfile(userId, profile);
    }
}
