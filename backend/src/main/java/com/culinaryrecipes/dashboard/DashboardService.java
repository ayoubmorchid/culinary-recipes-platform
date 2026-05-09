package com.culinaryrecipes.dashboard;

import com.culinaryrecipes.recipes.*;
import com.culinaryrecipes.users.User;
import com.culinaryrecipes.users.UserDto;
import com.culinaryrecipes.users.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final RecipeRepository recipeRepository;
    private final CategoryRepository categoryRepository;
    private final CommentRepository commentRepository;
    private final com.culinaryrecipes.favorites.FavoriteRepository favoriteRepository;

    public DashboardStatsDto getStats() {
        return DashboardStatsDto.builder()
                .totalUsers(userRepository.count())
                .totalRecipes(recipeRepository.count())
                .totalCategories(categoryRepository.count())
                .totalComments(commentRepository.count())
                .totalFavorites(favoriteRepository.count())
                .lastUsers(getLastUsers())
                .lastRecipes(getLastRecipes())
                .build();
    }

    private List<UserDto> getLastUsers() {
        return userRepository.findAll(PageRequest.of(0, 5, org.springframework.data.domain.Sort.by("dateJoined").descending()))
                .getContent().stream()
                .map(this::mapToUserDto)
                .collect(Collectors.toList());
    }

    private List<RecipeDto> getLastRecipes() {
        return recipeRepository.findTop5ByIsPublishedTrueOrderByCreatedAtDesc()
                .stream().map(this::mapToRecipeDto)
                .collect(Collectors.toList());
    }

    private UserDto mapToUserDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .dateJoined(user.getDateJoined())
                .build();
    }

    private RecipeDto mapToRecipeDto(Recipe recipe) {
        Double avgRating = recipe.getRatings().isEmpty() ? 0.0 :
                recipe.getRatings().stream().mapToInt(Rating::getRating).average().orElse(0.0);

        return RecipeDto.builder()
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
                .authorId(recipe.getAuthor().getId())
                .authorUsername(recipe.getAuthor().getUsername())
                .categoryId(recipe.getCategory() != null ? recipe.getCategory().getId() : null)
                .categoryName(recipe.getCategory() != null ? recipe.getCategory().getName() : null)
                .averageRating(Math.round(avgRating * 10.0) / 10.0)
                .totalRatings((long) recipe.getRatings().size())
                .totalComments((long) recipe.getComments().size())
                .build();
    }
}
