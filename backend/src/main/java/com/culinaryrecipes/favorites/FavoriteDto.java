package com.culinaryrecipes.favorites;

import com.culinaryrecipes.recipes.RecipeDto;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FavoriteDto {

    private Long id;
    private LocalDateTime createdAt;

    private Long userId;
    private Long recipeId;

    private RecipeDto recipe;
}