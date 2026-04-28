package com.culinaryrecipes.favorites;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    List<Favorite> findByUserUsername(String username);

    Optional<Favorite> findByUserUsernameAndRecipeSlug(String username, String slug);

    boolean existsByUserUsernameAndRecipeSlug(String username, String slug);
}