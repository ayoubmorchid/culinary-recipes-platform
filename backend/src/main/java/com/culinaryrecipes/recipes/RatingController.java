package com.culinaryrecipes.recipes;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    @GetMapping("/ratings")
    public ResponseEntity<List<RatingDto>> getRatings() {
        return ResponseEntity.ok(ratingService.getRatings());
    }

    @GetMapping("/recipes/{slug}/ratings")
    public ResponseEntity<List<RatingDto>> getRecipeRatings(
            @PathVariable String slug
    ) {
        return ResponseEntity.ok(ratingService.getRatingsByRecipe(slug));
    }

    @PostMapping("/recipes/{slug}/ratings")
    public ResponseEntity<RatingDto> addRating(
            @PathVariable String slug,
            @RequestBody RatingRequest request
    ) {
        return ResponseEntity.ok(ratingService.addRating(slug, request));
    }
}