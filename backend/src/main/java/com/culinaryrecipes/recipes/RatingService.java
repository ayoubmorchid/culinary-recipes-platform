package com.culinaryrecipes.recipes;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;
    private final RecipeRepository recipeRepository;

    public List<RatingDto> getRatings() {
        return ratingRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    public List<RatingDto> getRatingsByRecipe(String slug) {
        return ratingRepository.findByRecipeSlug(slug)
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    public RatingDto addRating(String slug, RatingRequest request) {
        Recipe recipe = recipeRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Recipe not found"));

        Rating rating = Rating.builder()
                .value(request.getValue())
                .recipe(recipe)
                .build();

        Rating savedRating = ratingRepository.save(rating);

        return mapToDto(savedRating);
    }

    private RatingDto mapToDto(Rating rating) {
        return RatingDto.builder()
                .value(rating.getValue())
                .username(
                        rating.getUser() != null
                                ? rating.getUser().getUsername()
                                : null
                )
                .build();
    }
}