package com.culinaryrecipes.recipes;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {

    @EntityGraph(attributePaths = {"author", "category"})
    Optional<Recipe> findBySlug(String slug);

    boolean existsBySlug(String slug);

    @EntityGraph(attributePaths = {"author", "category"})
    Page<Recipe> findByIsPublishedTrue(Pageable pageable);

    @EntityGraph(attributePaths = {"author", "category"})
    Page<Recipe> findByCategorySlugAndIsPublishedTrue(String categorySlug, Pageable pageable);

    @EntityGraph(attributePaths = {"author", "category"})
    Page<Recipe> findByAuthorUsernameAndIsPublishedTrue(String username, Pageable pageable);

    @EntityGraph(attributePaths = {"author", "category"})
    Page<Recipe> findByAuthorId(Long authorId, Pageable pageable);

    long countByCategoryId(Long categoryId);

    @EntityGraph(attributePaths = {"author", "category"})
    List<Recipe> findTop5ByIsPublishedTrueOrderByCreatedAtDesc();

    @EntityGraph(attributePaths = {"author", "category"})
    List<Recipe> findTop6ByIsPublishedTrueOrderByCreatedAtDesc();

    @Query("""
           SELECT r FROM Recipe r
           WHERE r.isPublished = true
           AND (
                :query IS NULL
                OR :query = ''
                OR LOWER(r.title) LIKE LOWER(CONCAT('%', :query, '%'))
                OR LOWER(r.description) LIKE LOWER(CONCAT('%', :query, '%'))
           )
           """)
    Page<Recipe> searchPublishedRecipes(
            @Param("query") String query,
            Pageable pageable
    );

    @EntityGraph(attributePaths = {"author", "category"})
    @Query("""
           SELECT r FROM Recipe r
           WHERE r.isPublished = true
           AND (
                :query IS NULL
                OR :query = ''
                OR LOWER(r.title) LIKE LOWER(CONCAT('%', :query, '%'))
                OR LOWER(r.description) LIKE LOWER(CONCAT('%', :query, '%'))
           )
           AND (:categoryId IS NULL OR r.category.id = :categoryId)
           """)
    Page<Recipe> searchByTitleAndCategory(
            @Param("query") String query,
            @Param("categoryId") Long categoryId,
            Pageable pageable
    );

    @EntityGraph(attributePaths = {"author", "category"})
    @Query("""
           SELECT r FROM Recipe r
           LEFT JOIN r.ratings rating
           WHERE r.isPublished = true
           GROUP BY r
           ORDER BY COALESCE(AVG(rating.rating), 0) DESC, COUNT(rating.id) DESC, r.createdAt DESC
           """)
    List<Recipe> findTopRatedPublishedRecipes(Pageable pageable);

    @EntityGraph(attributePaths = {"author", "category"})
    @Query("""
           SELECT r FROM Recipe r
           WHERE r.isPublished = true
           AND r.category.id = :categoryId
           AND r.id <> :excludeId
           ORDER BY r.createdAt DESC
           """)
    List<Recipe> findSimilarRecipes(
            @Param("categoryId") Long categoryId,
            @Param("excludeId") Long excludeId,
            Pageable pageable
    );
}