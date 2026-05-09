package com.culinaryrecipes.recipes;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/recipes")
@RequiredArgsConstructor
public class RecipeController {

    private final RecipeService recipeService;
    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<Page<RecipeDto>> getRecipes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId
    ) {
        return ResponseEntity.ok(
                recipeService.searchRecipes(search, categoryId, page, size)
        );
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<RecipeDto> getRecipeBySlug(
            @PathVariable String slug
    ) {
        return ResponseEntity.ok(
                recipeService.getRecipeBySlug(slug, null)
        );
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<RecipeDto> createRecipe(
            @AuthenticationPrincipal UserDetails principal,
            @Valid @ModelAttribute RecipeRequest request,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) {
        return ResponseEntity.ok(
                recipeService.createRecipe(request, image, principal.getUsername())
        );
    }

    @PutMapping(value = "/{slug}", consumes = "multipart/form-data")
    public ResponseEntity<RecipeDto> updateRecipe(
            @AuthenticationPrincipal UserDetails principal,
            @PathVariable String slug,
            @Valid @ModelAttribute RecipeRequest request,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) {
        return ResponseEntity.ok(
                recipeService.updateRecipe(slug, request, image, principal.getUsername())
        );
    }

    @DeleteMapping("/{slug}")
    public ResponseEntity<Void> deleteRecipe(
            @AuthenticationPrincipal UserDetails principal,
            @PathVariable String slug
    ) {
        recipeService.deleteRecipe(slug, principal.getUsername());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/categories")
    public ResponseEntity<List<CategoryDto>> getCategories() {
        return ResponseEntity.ok(
                categoryService.getAllCategories()
        );
    }

    @GetMapping("/latest")
    public ResponseEntity<List<RecipeDto>> getLatestRecipes() {
        return ResponseEntity.ok(
                recipeService.getLatestRecipes()
        );
    }

    @GetMapping("/top-rated")
    public ResponseEntity<List<RecipeDto>> getTopRatedRecipes() {
        return ResponseEntity.ok(
                recipeService.getTopRatedRecipes()
        );
    }

    @GetMapping("/my-recipes")
    public ResponseEntity<Page<RecipeDto>> getMyRecipes(
            @AuthenticationPrincipal UserDetails principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        return ResponseEntity.ok(
                recipeService.getMyRecipesByUsername(principal.getUsername(), page, size)
        );
    }
}