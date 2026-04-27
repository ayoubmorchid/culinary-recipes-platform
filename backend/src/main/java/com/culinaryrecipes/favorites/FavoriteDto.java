package com.culinaryrecipes.favorites;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FavoriteDto {
    private Long id;
    private String recipeTitle;
    private String recipeSlug;
}