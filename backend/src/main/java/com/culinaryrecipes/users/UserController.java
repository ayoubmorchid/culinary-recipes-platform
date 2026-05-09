package com.culinaryrecipes.users;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<ProfileDto> getMyProfile(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(
                userService.getCurrentProfile(userDetails.getUsername())
        );
    }

    @PutMapping(
            value = "/profile",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<ProfileDto> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(value = "firstName", required = false) String firstName,
            @RequestParam(value = "lastName", required = false) String lastName,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "bio", required = false) String bio,
            @RequestParam(value = "avatar", required = false) MultipartFile avatar
    ) {
        UpdateProfileRequest request = new UpdateProfileRequest();
        request.setFirstName(firstName);
        request.setLastName(lastName);
        request.setEmail(email);
        request.setBio(bio);

        ProfileDto updatedProfile = userService.updateProfile(
                userDetails.getUsername(),
                request
        );

        if (avatar != null && !avatar.isEmpty()) {
            updatedProfile = userService.updateAvatar(
                    userDetails.getUsername(),
                    avatar
            );
        }

        return ResponseEntity.ok(updatedProfile);
    }

    @PutMapping(
            value = "/profile/json",
            consumes = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ProfileDto> updateProfileJson(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UpdateProfileRequest request
    ) {
        return ResponseEntity.ok(
                userService.updateProfile(userDetails.getUsername(), request)
        );
    }

    @PostMapping(
            value = "/profile/avatar",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<ProfileDto> updateAvatar(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("avatar") MultipartFile avatar
    ) {
        return ResponseEntity.ok(
                userService.updateAvatar(userDetails.getUsername(), avatar)
        );
    }

    @GetMapping("/profile/{username}")
    public ResponseEntity<ProfileDto> getPublicProfile(
            @PathVariable String username
    ) {
        return ResponseEntity.ok(
                userService.getPublicProfile(username)
        );
    }
}