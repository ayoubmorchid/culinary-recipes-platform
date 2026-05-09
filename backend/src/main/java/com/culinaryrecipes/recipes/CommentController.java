package com.culinaryrecipes.recipes;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recipes/{slug}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping
    public ResponseEntity<List<CommentDto>> getComments(@PathVariable String slug) {
        return ResponseEntity.ok(
                commentService.getCommentsByRecipe(slug)
        );
    }

    @PostMapping
    public ResponseEntity<CommentDto> addComment(
            @PathVariable String slug,
            @Valid @RequestBody CommentRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(
                commentService.addComment(slug, request.getContent(), userDetails.getUsername())
        );
    }

    @Data
    public static class CommentRequest {

        @NotBlank(message = "Le commentaire est obligatoire.")
        @Size(min = 2, max = 1000, message = "Le commentaire doit contenir entre 2 et 1000 caractères.")
        private String content;
    }
}