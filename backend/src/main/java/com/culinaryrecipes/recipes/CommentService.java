package com.culinaryrecipes.recipes;

import com.culinaryrecipes.exceptions.ResourceNotFoundException;
import com.culinaryrecipes.users.User;
import com.culinaryrecipes.users.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private static final int MIN_COMMENT_LENGTH = 2;
    private static final int MAX_COMMENT_LENGTH = 1000;

    private final CommentRepository commentRepository;
    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<CommentDto> getCommentsByRecipe(String slug) {
        Recipe recipe = recipeRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Recette non trouvée."));

        return commentRepository.findByRecipeIdAndIsApprovedTrueOrderByCreatedAtDesc(recipe.getId())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public CommentDto addComment(String slug, String content, String username) {
        String cleanContent = validateAndCleanContent(content);

        Recipe recipe = recipeRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Recette non trouvée."));

        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé."));

        Comment comment = Comment.builder()
                .recipe(recipe)
                .author(author)
                .content(cleanContent)
                .isApproved(true)
                .build();

        return mapToDto(commentRepository.save(comment));
    }

    private String validateAndCleanContent(String content) {
        if (content == null || content.trim().isEmpty()) {
            throw new IllegalArgumentException("Le commentaire est obligatoire.");
        }

        String cleanContent = content.trim();

        if (cleanContent.length() < MIN_COMMENT_LENGTH) {
            throw new IllegalArgumentException("Le commentaire doit contenir au moins 2 caractères.");
        }

        if (cleanContent.length() > MAX_COMMENT_LENGTH) {
            throw new IllegalArgumentException("Le commentaire ne doit pas dépasser 1000 caractères.");
        }

        return cleanContent;
    }

    private CommentDto mapToDto(Comment comment) {
        return CommentDto.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .authorId(comment.getAuthor().getId())
                .authorUsername(comment.getAuthor().getUsername())
                .authorAvatar(
                        comment.getAuthor().getProfile() != null
                                ? comment.getAuthor().getProfile().getAvatar()
                                : null
                )
                .recipeId(comment.getRecipe().getId())
                .build();
    }
}