package com.culinaryrecipes.recipes;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RecipeRequest {

    @NotBlank(message = "Le titre est obligatoire.")
    private String title;

    private Long categoryId;

    @NotBlank(message = "La description est obligatoire.")
    private String description;

    @NotBlank(message = "Les ingrédients sont obligatoires.")
    private String ingredients;

    @NotBlank(message = "Les instructions sont obligatoires.")
    private String instructions;

    @Min(value = 0, message = "Le temps de préparation ne peut pas être négatif.")
    private Integer preparationTime = 0;

    @Min(value = 0, message = "Le temps de cuisson ne peut pas être négatif.")
    private Integer cookingTime = 0;

    @Min(value = 1, message = "Le nombre de portions doit être au moins 1.")
    private Integer servings = 1;

    private boolean published = true;
}