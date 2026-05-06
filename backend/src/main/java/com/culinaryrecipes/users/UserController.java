package com.culinaryrecipes.users;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ProfileDto> getMyProfile(Principal principal) {
        return ResponseEntity.ok(
                userService.getMyProfile(principal.getName())
        );
    }

    @PutMapping("/me")
    public ResponseEntity<ProfileDto> updateMyProfile(
            Principal principal,
            @RequestBody UpdateProfileRequest request
    ) {
        return ResponseEntity.ok(
                userService.updateMyProfile(principal.getName(), request)
        );
    }

    @PostMapping("/me/avatar")
    public ResponseEntity<String> uploadMyAvatar(
            Principal principal,
            @RequestParam("file") MultipartFile file
    ) {
        return ResponseEntity.ok(
                userService.uploadAvatar(principal.getName(), file)
        );
    }

    @GetMapping("/{username}")
    public ResponseEntity<ProfileDto> getPublicProfile(
            @PathVariable String username
    ) {
        return ResponseEntity.ok(
                userService.getPublicProfile(username)
        );
    }
}