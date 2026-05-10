package com.example.backend.storage;

import com.example.backend.models.UserProfile;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class UserStorage {
    private final Map<String, UserProfile> userProfiles = new HashMap<>();

    /**
     * Retrieve the user profile for a given user ID.
     *
     * @param userId the ID of the user
     * @return the user's profile
     */
    public UserProfile getUserProfile(String userId) {
        return userProfiles.getOrDefault(userId, new UserProfile());
    }

    /**
     * Update the user profile for a given user ID.
     *
     * @param userId the ID of the user
     * @param profile the new profile data
     * @return the updated user profile
     */
    public UserProfile updateUserProfile(String userId, UserProfile profile) {
        userProfiles.put(userId, profile);
        return profile;
    }
}
