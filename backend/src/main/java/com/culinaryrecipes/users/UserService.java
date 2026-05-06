package com.culinaryrecipes.users;

import com.culinaryrecipes.storage.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final FileStorageService fileStorageService;

    public ProfileDto getPublicProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return mapToProfileDto(user);
    }

    public ProfileDto getMyProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return mapToProfileDto(user);
    }

    public ProfileDto updateMyProfile(String username, UpdateProfileRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());

        Profile profile = profileRepository.findByUserUsername(username)
                .orElse(Profile.builder()
                        .user(user)
                        .build());

        profile.setBio(request.getBio());
        user.setProfile(profile);

        userRepository.save(user);
        profileRepository.save(profile);

        return mapToProfileDto(user);
    }

    public String uploadAvatar(String username, MultipartFile file) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String avatarPath = fileStorageService.saveFile(file);

        Profile profile = profileRepository.findByUserUsername(username)
                .orElse(Profile.builder()
                        .user(user)
                        .build());

        profile.setAvatar(avatarPath);
        user.setProfile(profile);

        userRepository.save(user);
        profileRepository.save(profile);

        return avatarPath;
    }

    private ProfileDto mapToProfileDto(User user) {
        Profile profile = user.getProfile();

        return ProfileDto.builder()
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .bio(profile != null ? profile.getBio() : null)
                .avatar(profile != null ? profile.getAvatar() : null)
                .build();
    }
}