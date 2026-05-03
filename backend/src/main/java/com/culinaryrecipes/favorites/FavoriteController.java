package com.culinaryrecipes.favorites;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    @PostMapping("/{username}/{slug}/toggle")
    public ResponseEntity<String> toggleFavorite(
            @PathVariable String username,
            @PathVariable String slug) {
        return ResponseEntity.ok(
                favoriteService.toggleFavorite(username, slug));
    }

    @GetMapping("/{username}")
    public ResponseEntity<List<FavoriteDto>> getFavorites(
            @PathVariable String username) {
        return ResponseEntity.ok(
                favoriteService.getUserFavorites(username));
    }
}