package com.culinaryrecipes.recipes;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {
        private final RecipeRepository recipeRepository;

        public CommentDto addComment(String slug, CommentRequest request) {
                Recipe recipe = recipeRepository.findBySlug(slug)
                                .orElseThrow(() -> new RuntimeException("Recipe not found"));

                Comment comment = Comment.builder()
                                .content(request.getContent())
                                .recipe(recipe)
                                .build();

                Comment savedComment = commentRepository.save(comment);

                return CommentDto.builder()
                                .content(savedComment.getContent())
                                .authorUsername(null)
                                .build();
        }

        private final CommentRepository commentRepository;

        public List<CommentDto> getCommentsByRecipe(String slug) {
                return commentRepository.findByRecipeSlug(slug)
                                .stream()
                                .map(comment -> CommentDto.builder()
                                                .content(comment.getContent())
                                                .authorUsername(
                                                                comment.getAuthor() != null
                                                                                ? comment.getAuthor().getUsername()
                                                                                : null)
                                                .build())
                                .toList();
        }
}