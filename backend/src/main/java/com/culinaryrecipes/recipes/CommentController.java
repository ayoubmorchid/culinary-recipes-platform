package com.culinaryrecipes.recipes;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recipes/{slug}/comments")
@RequiredArgsConstructor
public class CommentController {

    @PostMapping
    public ResponseEntity<CommentDto> addComment(
            @PathVariable String slug,
            @RequestBody CommentRequest request) {
        return ResponseEntity.ok(commentService.addComment(slug, request));
    }

    private final CommentService commentService;

    @GetMapping
    public ResponseEntity<List<CommentDto>> getComments(
            @PathVariable String slug) {
        return ResponseEntity.ok(commentService.getCommentsByRecipe(slug));
    }
}