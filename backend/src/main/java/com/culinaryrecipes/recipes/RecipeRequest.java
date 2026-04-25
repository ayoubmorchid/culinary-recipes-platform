package com.culinaryrecipes.recipes;

import lombok.Data;

@Data
public class RecipeRequest {
    private String title;
    private String description;
}