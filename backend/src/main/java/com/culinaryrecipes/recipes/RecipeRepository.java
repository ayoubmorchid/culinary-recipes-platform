package com.culinaryrecipes.recipes;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {

    Optional<Recipe> findBySlug(String slug);

    List<Recipe> findAllByOrderByIdDesc();

    List<Recipe> findByTitleContainingIgnoreCaseOrderByIdDesc(String title);

    List<Recipe> findByAuthorUsernameOrderByIdDesc(String username);
}