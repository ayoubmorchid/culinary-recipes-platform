package com.culinaryrecipes.recipes;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recipes")
@RequiredArgsConstructor
public class RecipeController {

    private final RecipeService recipeService;

    @GetMapping("/{slug}")
    public ResponseEntity<RecipeDto> getRecipeBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(recipeService.getRecipeBySlug(slug));
    }
}