package com.culinaryrecipes.recipes;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/recipes")
@RequiredArgsConstructor
public class RecipeController {

    private final RecipeService recipeService;

    @GetMapping("/{slug}")
    public ResponseEntity<RecipeDto> getRecipeBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(recipeService.getRecipeBySlug(slug));
    }

    @GetMapping
    public ResponseEntity<List<RecipeDto>> getAllRecipes() {
        return ResponseEntity.ok(recipeService.getAllRecipes());
    }

    @GetMapping("/search")
    public ResponseEntity<List<RecipeDto>> searchRecipes(
            @RequestParam String query) {
        return ResponseEntity.ok(recipeService.searchRecipes(query));
    }

    @PostMapping
    public ResponseEntity<RecipeDto> createRecipe(@RequestBody RecipeRequest request) {
        return ResponseEntity.ok(recipeService.createRecipe(request));
    }

    @PutMapping("/{slug}")
    public ResponseEntity<RecipeDto> updateRecipe(
            @PathVariable String slug,
            @RequestBody RecipeRequest request) {
        return ResponseEntity.ok(recipeService.updateRecipe(slug, request));
    }
}