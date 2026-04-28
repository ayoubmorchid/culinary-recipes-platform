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

    @GetMapping("/{username}")
    public ResponseEntity<List<FavoriteDto>> getFavorites(
            @PathVariable String username
    ) {
        return ResponseEntity.ok(
                favoriteService.getUserFavorites(username)
        );
    }
}