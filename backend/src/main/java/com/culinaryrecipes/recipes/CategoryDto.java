package com.culinaryrecipes.recipes;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryDto {

    private Long id;
    private String name;
    private String slug;
    private String description;
    private LocalDateTime createdAt;
    private Long recipeCount;
}