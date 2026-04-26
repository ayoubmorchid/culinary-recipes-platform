package com.culinaryrecipes.recipes;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;

    public List<CommentDto> getCommentsByRecipe(String slug) {
        return commentRepository.findByRecipeSlug(slug)
                .stream()
                .map(comment -> CommentDto.builder()
                        .content(comment.getContent())
                        .authorUsername(
                                comment.getAuthor() != null
                                        ? comment.getAuthor().getUsername()
                                        : null
                        )
                        .build())
                .toList();
    }
}