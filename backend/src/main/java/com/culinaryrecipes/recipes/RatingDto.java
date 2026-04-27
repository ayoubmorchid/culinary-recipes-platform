package com.culinaryrecipes.recipes;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RatingDto {
    private int value;
    private String username;
}