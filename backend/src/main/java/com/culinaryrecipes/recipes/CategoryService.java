package com.culinaryrecipes.recipes;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(category -> CategoryDto.builder()
                        .name(category.getName())
                        .slug(category.getSlug())
                        .build())
                .toList();
    }
}