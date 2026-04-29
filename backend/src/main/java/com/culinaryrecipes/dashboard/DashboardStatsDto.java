package com.culinaryrecipes.dashboard;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardStatsDto {
    private long totalUsers;
    private long totalRecipes;
    private long totalCategories;
    private long totalFavorites;
}