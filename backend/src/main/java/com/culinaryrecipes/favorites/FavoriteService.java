package com.culinaryrecipes.favorites;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;

    public List<FavoriteDto> getUserFavorites(String username) {
        return favoriteRepository.findByUserUsername(username)
                .stream()
                .map(favorite -> FavoriteDto.builder()
                        .id(favorite.getId())
                        .recipeTitle(
                                favorite.getRecipe() != null
                                        ? favorite.getRecipe().getTitle()
                                        : null
                        )
                        .recipeSlug(
                                favorite.getRecipe() != null
                                        ? favorite.getRecipe().getSlug()
                                        : null
                        )
                        .build())
                .toList();
    }
}