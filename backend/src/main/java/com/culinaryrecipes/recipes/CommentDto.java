package com.culinaryrecipes.recipes;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CommentDto {
    private String content;
    private String authorUsername;
}