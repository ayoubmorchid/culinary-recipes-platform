package com.culinaryrecipes.recipes;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByRecipeIdAndIsApprovedTrueOrderByCreatedAtDesc(Long recipeId);
    List<Comment> findByRecipeIdOrderByCreatedAtDesc(Long recipeId);
    long countByRecipeId(Long recipeId);
}
