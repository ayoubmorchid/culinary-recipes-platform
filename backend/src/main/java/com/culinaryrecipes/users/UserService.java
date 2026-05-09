package com.culinaryrecipes.users;

import com.culinaryrecipes.exceptions.ResourceNotFoundException;
import com.culinaryrecipes.exceptions.UnauthorizedActionException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final com.culinaryrecipes.files.FileStorageService fileStorageService;

    public ProfileDto getCurrentProfile(String username) {
        User user = getUserByUsername(username);
        Profile profile = profileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Profil non trouvé."));
        return mapToProfileDto(user, profile);
    }

    @Transactional
    public ProfileDto updateProfile(String username, UpdateProfileRequest request) {
        User user = getUserByUsername(username);
        Profile profile = profileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Profil non trouvé."));

        if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if (request.getLastName() != null) user.setLastName(request.getLastName());
        if (request.getEmail() != null) user.setEmail(request.getEmail());
        if (request.getBio() != null) profile.setBio(request.getBio());

        userRepository.save(user);
        profileRepository.save(profile);

        return mapToProfileDto(user, profile);
    }

    @Transactional
    public ProfileDto updateAvatar(String username, MultipartFile file) {
        User user = getUserByUsername(username);
        Profile profile = profileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Profil non trouvé."));

        String avatarUrl = fileStorageService.storeAvatar(file);
        profile.setAvatar(avatarUrl);
        profileRepository.save(profile);

        return mapToProfileDto(user, profile);
    }

    public ProfileDto getPublicProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé."));
        Profile profile = profileRepository.findByUserId(user.getId())
                .orElse(Profile.builder().build());
        return mapToProfileDto(user, profile);
    }

    private User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé."));
    }

    private ProfileDto mapToProfileDto(User user, Profile profile) {
        return ProfileDto.builder()
                .id(profile.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .bio(profile.getBio())
                .avatar(profile.getAvatar())
                .dateJoined(user.getDateJoined())
                .updatedAt(profile.getUpdatedAt())
                .build();
    }
}
