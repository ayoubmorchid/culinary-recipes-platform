package com.culinaryrecipes.dashboard;

import com.culinaryrecipes.favorites.FavoriteRepository;
import com.culinaryrecipes.recipes.CategoryRepository;
import com.culinaryrecipes.recipes.RecipeRepository;
import com.culinaryrecipes.users.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final RecipeRepository recipeRepository;
    private final CategoryRepository categoryRepository;
    private final FavoriteRepository favoriteRepository;

    public DashboardStatsDto getStats() {
        return DashboardStatsDto.builder()
                .totalUsers(userRepository.count())
                .totalRecipes(recipeRepository.count())
                .totalCategories(categoryRepository.count())
                .totalFavorites(favoriteRepository.count())
                .build();
    }
}