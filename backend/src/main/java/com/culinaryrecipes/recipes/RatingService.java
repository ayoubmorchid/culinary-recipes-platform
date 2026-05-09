package com.culinaryrecipes.recipes;

import com.culinaryrecipes.exceptions.ResourceNotFoundException;
import com.culinaryrecipes.users.User;
import com.culinaryrecipes.users.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RatingService {

    private static final int MIN_RATING = 1;
    private static final int MAX_RATING = 5;

    private final RatingRepository ratingRepository;
    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;

    @Transactional
    public RatingDto rateRecipe(String slug, Integer ratingValue, String username) {
        validateRatingValue(ratingValue);

        Recipe recipe = recipeRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Recette non trouvée."));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé."));

        Rating rating = ratingRepository.findByRecipeIdAndUserId(recipe.getId(), user.getId())
                .orElseGet(Rating::new);

        rating.setRecipe(recipe);
        rating.setUser(user);
        rating.setRating(ratingValue);

        return mapToDto(ratingRepository.save(rating));
    }

    private void validateRatingValue(Integer ratingValue) {
        if (ratingValue == null) {
            throw new IllegalArgumentException("La note est obligatoire.");
        }

        if (ratingValue < MIN_RATING || ratingValue > MAX_RATING) {
            throw new IllegalArgumentException("La note doit être comprise entre 1 et 5.");
        }
    }

    private RatingDto mapToDto(Rating rating) {
        return RatingDto.builder()
                .id(rating.getId())
                .rating(rating.getRating())
                .createdAt(rating.getCreatedAt())
                .userId(rating.getUser().getId())
                .recipeId(rating.getRecipe().getId())
                .build();
    }
}