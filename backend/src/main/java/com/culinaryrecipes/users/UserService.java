package com.culinaryrecipes.users;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final ProfileRepository profileRepository;

    public ProfileDto getPublicProfile(String username) {

        Profile profile = profileRepository.findByUserUsername(username)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        return ProfileDto.builder()
                .username(profile.getUser().getUsername())
                .bio(profile.getBio())
                .avatar(profile.getAvatar())
                .build();
    }
}