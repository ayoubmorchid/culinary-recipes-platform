package com.culinaryrecipes.favorites;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    Page<Favorite> findByUserId(Long userId, Pageable pageable);

    boolean existsByUserIdAndRecipeId(Long userId, Long recipeId);

    Optional<Favorite> findByUserIdAndRecipeId(Long userId, Long recipeId);
}