package com.culinaryrecipes.recipes;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecipeDto {
    private Long id;
    private String title;
    private String slug;
    private String description;
    private String ingredients;
    private String instructions;
    private Integer preparationTime;
    private Integer cookingTime;
    private Integer totalTime;
    private Integer servings;
    private String imageUrl;
    private boolean isPublished;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long authorId;
    private String authorUsername;
    private Long categoryId;
    private String categoryName;
    private String categorySlug;
    private Double averageRating;
    private Long totalRatings;
    private Long totalComments;
    private boolean isFavorite;
}
