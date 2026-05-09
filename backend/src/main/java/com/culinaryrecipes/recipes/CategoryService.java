package com.culinaryrecipes.recipes;

import com.culinaryrecipes.exceptions.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final RecipeRepository recipeRepository;

    @Transactional(readOnly = true)
    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CategoryDto getCategoryBySlug(String slug) {
        Category category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Catégorie non trouvée."));

        return mapToDto(category);
    }

    @Transactional
    public CategoryDto createCategory(CategoryRequest request) {
        validateCategoryRequest(request);

        Category category = new Category();
        category.setName(request.getName().trim());
        category.setSlug(generateSlug(request.getName(), null));
        category.setDescription(cleanDescription(request.getDescription()));

        return mapToDto(categoryRepository.save(category));
    }

    @Transactional
    public CategoryDto updateCategory(Long id, CategoryRequest request) {
        validateCategoryRequest(request);

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Catégorie non trouvée."));

        String newName = request.getName().trim();

        if (!category.getName().equalsIgnoreCase(newName)) {
            category.setSlug(generateSlug(newName, category.getId()));
        }

        category.setName(newName);
        category.setDescription(cleanDescription(request.getDescription()));

        return mapToDto(categoryRepository.save(category));
    }

    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Catégorie non trouvée."));

        long recipeCount = recipeRepository.countByCategoryId(category.getId());

        if (recipeCount > 0) {
            throw new IllegalArgumentException("Impossible de supprimer une catégorie qui contient des recettes.");
        }

        categoryRepository.delete(category);
    }

    private void validateCategoryRequest(CategoryRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Les données de la catégorie sont obligatoires.");
        }

        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Le nom de la catégorie est obligatoire.");
        }

        if (request.getName().trim().length() < 2) {
            throw new IllegalArgumentException("Le nom de la catégorie doit contenir au moins 2 caractères.");
        }

        if (request.getName().trim().length() > 100) {
            throw new IllegalArgumentException("Le nom de la catégorie ne doit pas dépasser 100 caractères.");
        }
    }

    private String cleanDescription(String description) {
        if (description == null || description.trim().isEmpty()) {
            return null;
        }

        return description.trim();
    }

    private String generateSlug(String name, Long currentCategoryId) {
        String baseSlug = name.toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "")
                .trim();

        if (baseSlug.isBlank()) {
            baseSlug = "category";
        }

        String slug = baseSlug;
        int counter = 1;

        while (slugExistsForAnotherCategory(slug, currentCategoryId)) {
            slug = baseSlug + "-" + counter++;
        }

        return slug;
    }

    private boolean slugExistsForAnotherCategory(String slug, Long currentCategoryId) {
        return categoryRepository.findBySlug(slug)
                .map(existingCategory -> currentCategoryId == null || !existingCategory.getId().equals(currentCategoryId))
                .orElse(false);
    }

    private CategoryDto mapToDto(Category category) {
        long recipeCount = recipeRepository.countByCategoryId(category.getId());

        return CategoryDto.builder()
                .id(category.getId())
                .name(category.getName())
                .slug(category.getSlug())
                .description(category.getDescription())
                .createdAt(category.getCreatedAt())
                .recipeCount(recipeCount)
                .build();
    }
}