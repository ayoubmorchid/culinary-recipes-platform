package com.culinaryrecipes.recipes;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RecipeDto {

    private String title;
    private String slug;
    private String description;
    private String authorUsername;
}