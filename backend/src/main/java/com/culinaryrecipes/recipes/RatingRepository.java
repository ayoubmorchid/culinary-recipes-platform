package com.culinaryrecipes.recipes;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface RatingRepository extends JpaRepository<Rating, Long> {

    Optional<Rating> findByRecipeIdAndUserId(Long recipeId, Long userId);

    long countByRecipeId(Long recipeId);

    @Query("SELECT COALESCE(AVG(r.rating), 0) FROM Rating r WHERE r.recipe.id = :recipeId")
    double findAverageRatingByRecipeId(@Param("recipeId") Long recipeId);
}
