package com.culinaryrecipes.favorites;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import com.culinaryrecipes.recipes.Recipe;
import com.culinaryrecipes.recipes.RecipeRepository;
import com.culinaryrecipes.users.User;
import com.culinaryrecipes.users.UserRepository;

@Service
@RequiredArgsConstructor
public class FavoriteService {
        private final UserRepository userRepository;
        private final RecipeRepository recipeRepository;
        private final FavoriteRepository favoriteRepository;

        public List<FavoriteDto> getUserFavorites(String username) {
                return favoriteRepository.findByUserUsername(username)
                                .stream()
                                .map(favorite -> FavoriteDto.builder()
                                                .id(favorite.getId())
                                                .recipeTitle(
                                                                favorite.getRecipe() != null
                                                                                ? favorite.getRecipe().getTitle()
                                                                                : null)
                                                .recipeSlug(
                                                                favorite.getRecipe() != null
                                                                                ? favorite.getRecipe().getSlug()
                                                                                : null)
                                                .build())
                                .toList();
        }

        public String toggleFavorite(String username, String slug) {
                var existingFavorite = favoriteRepository
                                .findByUserUsernameAndRecipeSlug(username, slug);

                if (existingFavorite.isPresent()) {
                        favoriteRepository.delete(existingFavorite.get());
                        return "Favorite removed";
                }

                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Recipe recipe = recipeRepository.findBySlug(slug)
                                .orElseThrow(() -> new RuntimeException("Recipe not found"));

                Favorite favorite = Favorite.builder()
                                .user(user)
                                .recipe(recipe)
                                .build();

                favoriteRepository.save(favorite);

                return "Favorite added";
        }
}