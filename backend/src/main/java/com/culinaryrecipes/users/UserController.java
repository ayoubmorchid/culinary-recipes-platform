package com.culinaryrecipes.users;

import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{username}")
    public ResponseEntity<ProfileDto> getPublicProfile(
            @PathVariable String username) {
        return ResponseEntity.ok(
                userService.getPublicProfile(username));
    }

    @PostMapping("/upload-avatar")
    public ResponseEntity<String> uploadAvatar(
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(
                userService.uploadAvatar(file));
    }
}