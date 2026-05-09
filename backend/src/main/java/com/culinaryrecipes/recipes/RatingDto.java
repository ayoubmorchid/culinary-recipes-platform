package com.culinaryrecipes.recipes;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RatingDto {

    private Long id;
    private Integer rating;
    private LocalDateTime createdAt;
    private Long userId;
    private Long recipeId;
}