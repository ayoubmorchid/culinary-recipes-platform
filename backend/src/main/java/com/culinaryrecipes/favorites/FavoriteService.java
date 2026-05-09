package com.culinaryrecipes.favorites;

import com.culinaryrecipes.exceptions.ResourceNotFoundException;
import com.culinaryrecipes.recipes.Recipe;
import com.culinaryrecipes.recipes.RecipeDto;
import com.culinaryrecipes.recipes.RecipeRepository;
import com.culinaryrecipes.users.User;
import com.culinaryrecipes.users.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private static final int MAX_PAGE_SIZE = 50;

    private final FavoriteRepository favoriteRepository;
    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public Page<FavoriteDto> getUserFavorites(Long userId, int page, int size) {
        if (userId == null) {
            throw new IllegalArgumentException("L'utilisateur est obligatoire.");
        }

        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), MAX_PAGE_SIZE);

        Pageable pageable = PageRequest.of(
                safePage,
                safeSize,
                Sort.by("createdAt").descending()
        );

        return favoriteRepository.findByUserId(userId, pageable)
                .map(this::mapToDto);
    }

    @Transactional
    public String addFavorite(Long recipeId, String username) {
        validateRecipeId(recipeId);

        User user = getUserByUsername(username);
        Recipe recipe = getRecipeById(recipeId);

        if (favoriteRepository.existsByUserIdAndRecipeId(user.getId(), recipe.getId())) {
            return "Cette recette est déjà dans vos favoris.";
        }

        Favorite favorite = Favorite.builder()
                .user(user)
                .recipe(recipe)
                .build();

        favoriteRepository.save(favorite);

        return "Recette ajoutée à vos favoris!";
    }

    @Transactional
    public String removeFavorite(Long recipeId, String username) {
        validateRecipeId(recipeId);

        User user = getUserByUsername(username);

        Favorite favorite = favoriteRepository
                .findByUserIdAndRecipeId(user.getId(), recipeId)
                .orElseThrow(() -> new ResourceNotFoundException("Cette recette n'est pas dans vos favoris."));

        favoriteRepository.delete(favorite);

        return "Recette retirée de vos favoris!";
    }

    @Transactional
    public boolean toggleFavorite(Long recipeId, String username) {
        validateRecipeId(recipeId);

        User user = getUserByUsername(username);
        Recipe recipe = getRecipeById(recipeId);

        Optional<Favorite> existing = favoriteRepository
                .findByUserIdAndRecipeId(user.getId(), recipe.getId());

        if (existing.isPresent()) {
            favoriteRepository.delete(existing.get());
            return false;
        }

        Favorite favorite = Favorite.builder()
                .user(user)
                .recipe(recipe)
                .build();

        favoriteRepository.save(favorite);

        return true;
    }

    private void validateRecipeId(Long recipeId) {
        if (recipeId == null) {
            throw new IllegalArgumentException("L'identifiant de la recette est obligatoire.");
        }
    }

    private User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé."));
    }

    private Recipe getRecipeById(Long recipeId) {
        return recipeRepository.findById(recipeId)
                .orElseThrow(() -> new ResourceNotFoundException("Recette non trouvée."));
    }

    private FavoriteDto mapToDto(Favorite favorite) {
        Recipe recipe = favorite.getRecipe();

        RecipeDto recipeDto = RecipeDto.builder()
                .id(recipe.getId())
                .title(recipe.getTitle())
                .slug(recipe.getSlug())
                .description(recipe.getDescription())
                .preparationTime(recipe.getPreparationTime())
                .cookingTime(recipe.getCookingTime())
                .totalTime(recipe.getTotalTime())
                .servings(recipe.getServings())
                .imageUrl(recipe.getImage())
                .isPublished(recipe.isPublished())
                .createdAt(recipe.getCreatedAt())
                .updatedAt(recipe.getUpdatedAt())
                .authorId(recipe.getAuthor() != null ? recipe.getAuthor().getId() : null)
                .authorUsername(recipe.getAuthor() != null ? recipe.getAuthor().getUsername() : null)
                .categoryId(recipe.getCategory() != null ? recipe.getCategory().getId() : null)
                .categoryName(recipe.getCategory() != null ? recipe.getCategory().getName() : null)
                .categorySlug(recipe.getCategory() != null ? recipe.getCategory().getSlug() : null)
                .isFavorite(true)
                .build();

        return FavoriteDto.builder()
                .id(favorite.getId())
                .createdAt(favorite.getCreatedAt())
                .userId(favorite.getUser() != null ? favorite.getUser().getId() : null)
                .recipeId(recipe.getId())
                .recipe(recipeDto)
                .build();
    }
}