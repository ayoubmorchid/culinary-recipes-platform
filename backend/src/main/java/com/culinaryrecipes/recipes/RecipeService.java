package com.culinaryrecipes.recipes;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RecipeService {

    private final RecipeRepository recipeRepository;

    public RecipeDto getRecipeBySlug(String slug) {

        Recipe recipe = recipeRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Recipe not found"));

        return RecipeDto.builder()
                .title(recipe.getTitle())
                .slug(recipe.getSlug())
                .description(recipe.getDescription())
                .authorUsername(recipe.getAuthor().getUsername())
                .build();
    }

    public List<RecipeDto> getAllRecipes() {
        return recipeRepository.findAllByOrderByIdDesc()
                .stream()
                .map(recipe -> RecipeDto.builder()
                        .title(recipe.getTitle())
                        .slug(recipe.getSlug())
                        .description(recipe.getDescription())
                        .authorUsername(recipe.getAuthor().getUsername())
                        .build())
                .toList();
    }

    public RecipeDto createRecipe(RecipeRequest request) {
        Recipe recipe = Recipe.builder()
                .title(request.getTitle())
                .slug(request.getTitle().toLowerCase().replace(" ", "-"))
                .description(request.getDescription())
                .build();

        Recipe savedRecipe = recipeRepository.save(recipe);

        return RecipeDto.builder()
                .title(savedRecipe.getTitle())
                .slug(savedRecipe.getSlug())
                .description(savedRecipe.getDescription())
                .build();
    }
}