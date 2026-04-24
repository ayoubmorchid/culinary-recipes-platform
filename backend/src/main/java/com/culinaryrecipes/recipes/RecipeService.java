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
}