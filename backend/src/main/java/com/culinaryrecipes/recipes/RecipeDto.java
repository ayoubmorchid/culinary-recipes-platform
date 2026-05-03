package com.culinaryrecipes.recipes;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RecipeDto {

    private double averageRating;
    private int totalRatings;
    private String title;
    private String slug;
    private String description;
    private String authorUsername;
    private String categoryName;
    private String categorySlug;
}
