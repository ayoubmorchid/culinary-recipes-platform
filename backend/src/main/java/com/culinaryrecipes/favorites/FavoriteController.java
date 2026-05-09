package com.culinaryrecipes.favorites;

import com.culinaryrecipes.exceptions.ResourceNotFoundException;
import com.culinaryrecipes.users.User;
import com.culinaryrecipes.users.UserRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<Page<FavoriteDto>> getFavorites(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé."));

        return ResponseEntity.ok(
                favoriteService.getUserFavorites(user.getId(), page, size)
        );
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> addFavorite(
            @RequestBody FavoriteRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String message = favoriteService.addFavorite(
                request.getRecipeId(),
                userDetails.getUsername()
        );

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", message
        ));
    }

    @DeleteMapping("/{recipeId}")
    public ResponseEntity<Map<String, Object>> removeFavorite(
            @PathVariable Long recipeId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String message = favoriteService.removeFavorite(
                recipeId,
                userDetails.getUsername()
        );

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", message
        ));
    }

    @PostMapping("/toggle")
    public ResponseEntity<Map<String, Object>> toggleFavorite(
            @RequestBody FavoriteRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        boolean isFavorite = favoriteService.toggleFavorite(
                request.getRecipeId(),
                userDetails.getUsername()
        );

        return ResponseEntity.ok(Map.of(
                "success", true,
                "favorite", isFavorite,
                "message", isFavorite
                        ? "Recette ajoutée aux favoris!"
                        : "Recette retirée des favoris!"
        ));
    }

    @Data
    public static class FavoriteRequest {
        private Long recipeId;
    }
}