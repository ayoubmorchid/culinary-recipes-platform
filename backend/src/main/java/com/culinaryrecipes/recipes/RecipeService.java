package com.culinaryrecipes.recipes;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecipeService {
    private final RatingRepository ratingRepository;
    private final RecipeRepository recipeRepository;

    public RecipeDto updateRecipe(String slug, RecipeRequest request) {
        Recipe recipe = recipeRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Recipe not found"));

        recipe.setTitle(request.getTitle());
        recipe.setSlug(request.getTitle().toLowerCase().replace(" ", "-"));
        recipe.setDescription(request.getDescription());

        Recipe updatedRecipe = recipeRepository.save(recipe);

        return mapToDto(updatedRecipe);
    }

    public RecipeDto getRecipeBySlug(String slug) {
        Recipe recipe = recipeRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Recipe not found"));

        return mapToDto(recipe);
    }

    public List<RecipeDto> getAllRecipes() {
        return recipeRepository.findAllByOrderByIdDesc()
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    public RecipeDto createRecipe(RecipeRequest request) {
        Recipe recipe = Recipe.builder()
                .title(request.getTitle())
                .slug(request.getTitle().toLowerCase().replace(" ", "-"))
                .description(request.getDescription())
                .build();

        Recipe savedRecipe = recipeRepository.save(recipe);

        return mapToDto(savedRecipe);
    }

    private RecipeDto mapToDto(Recipe recipe) {
        var ratings = ratingRepository.findByRecipeSlug(recipe.getSlug());

        double averageRating = ratings.isEmpty()
                ? 0
                : ratings.stream()
                        .mapToInt(Rating::getValue)
                        .average()
                        .orElse(0);
        return RecipeDto.builder()
                .averageRating(averageRating)
                .totalRatings(ratings.size())
                .title(recipe.getTitle())
                .slug(recipe.getSlug())
                .description(recipe.getDescription())
                .authorUsername(recipe.getAuthor() != null ? recipe.getAuthor().getUsername() : null)
                .categoryName(recipe.getCategory() != null ? recipe.getCategory().getName() : null)
                .categorySlug(recipe.getCategory() != null ? recipe.getCategory().getSlug() : null)
                .build();
    }

    public List<RecipeDto> searchRecipes(String keyword) {
        return recipeRepository
                .findByTitleContainingIgnoreCaseOrderByIdDesc(keyword)
                .stream()
                .map(this::mapToDto)
                .toList();
    }
}