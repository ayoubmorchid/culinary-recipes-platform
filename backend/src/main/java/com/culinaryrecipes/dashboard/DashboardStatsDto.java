package com.culinaryrecipes.dashboard;

import com.culinaryrecipes.recipes.RecipeDto;
import com.culinaryrecipes.users.UserDto;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsDto {

    private long totalUsers;
    private long totalRecipes;
    private long totalCategories;
    private long totalComments;
    private long totalFavorites;

    private List<UserDto> lastUsers;
    private List<RecipeDto> lastRecipes;
}