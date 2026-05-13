package com.culinaryrecipes.recipes;

import com.culinaryrecipes.exceptions.ResourceNotFoundException;
import com.culinaryrecipes.exceptions.UnauthorizedActionException;
import com.culinaryrecipes.favorites.FavoriteRepository;
import com.culinaryrecipes.files.FileStorageService;
import com.culinaryrecipes.users.User;
import com.culinaryrecipes.users.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecipeService {

    private static final int MAX_PAGE_SIZE = 50;
    private static final long MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

    private static final Set<String> ALLOWED_IMAGE_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif"
    );

    private final RecipeRepository recipeRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final FavoriteRepository favoriteRepository;
    private final RatingRepository ratingRepository;
    private final FileStorageService fileStorageService;

    @Transactional(readOnly = true)
    public Page<RecipeDto> getPublishedRecipes(int page, int size, String sort) {
        Pageable pageable = createPageable(page, size, sort);

        return recipeRepository.findByIsPublishedTrue(pageable)
                .map(this::mapToDto);
    }

    @Transactional(readOnly = true)
    public RecipeDto getRecipeBySlug(String slug, Long currentUserId) {
        Recipe recipe = recipeRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Recette non trouvée."));

        return mapToDto(recipe, currentUserId);
    }

    @Transactional(readOnly = true)
    public Page<RecipeDto> getRecipesByCategory(String slug, int page, int size) {
        if (slug == null || slug.isBlank()) {
            throw new IllegalArgumentException("Le slug de la catégorie est obligatoire.");
        }

        Pageable pageable = createPageable(page, size, "createdAt");

        return recipeRepository.findByCategorySlugAndIsPublishedTrue(slug, pageable)
                .map(this::mapToDto);
    }

    @Transactional(readOnly = true)
    public Page<RecipeDto> searchRecipes(String query, Long categoryId, int page, int size) {
        Pageable pageable = createPageable(page, size, "createdAt");

        String cleanQuery = query == null ? "" : query.trim();

        return recipeRepository.searchByTitleAndCategory(cleanQuery, categoryId, pageable)
                .map(this::mapToDto);
    }

    @Transactional(readOnly = true)
    public Page<RecipeDto> getMyRecipes(Long userId, int page, int size) {
        if (userId == null) {
            throw new IllegalArgumentException("L'identifiant de l'utilisateur est obligatoire.");
        }

        Pageable pageable = createPageable(page, size, "createdAt");

        return recipeRepository.findByAuthorId(userId, pageable)
                .map(recipe -> mapToDto(recipe, userId));
    }

    @Transactional(readOnly = true)
    public Page<RecipeDto> getMyRecipesByUsername(String username, int page, int size) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé."));

        return getMyRecipes(user.getId(), page, size);
    }

    @Transactional(readOnly = true)
    public List<RecipeDto> getLatestRecipes() {
        return recipeRepository.findTop5ByIsPublishedTrueOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RecipeDto> getTopRatedRecipes() {
        Pageable pageable = PageRequest.of(0, 5);

        return recipeRepository.findTopRatedPublishedRecipes(pageable)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RecipeDto> getSimilarRecipes(Long categoryId, Long excludeId) {
        if (categoryId == null || excludeId == null) {
            return List.of();
        }

        Pageable pageable = PageRequest.of(0, 5);

        return recipeRepository.findSimilarRecipes(categoryId, excludeId, pageable)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public RecipeDto createRecipe(RecipeRequest request, MultipartFile image, String username) {
        validateRecipeRequest(request);
        validateImage(image);

        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé."));

        Recipe recipe = new Recipe();
        recipe.setTitle(request.getTitle().trim());
        recipe.setSlug(generateSlug(request.getTitle(), null));
        recipe.setAuthor(author);
        recipe.setDescription(request.getDescription().trim());
        recipe.setIngredients(request.getIngredients().trim());
        recipe.setInstructions(request.getInstructions().trim());
        recipe.setPreparationTime(safeInteger(request.getPreparationTime(), 0));
        recipe.setCookingTime(safeInteger(request.getCookingTime(), 0));
        recipe.setServings(safeInteger(request.getServings(), 1));
        recipe.setPublished(request.isPublished());

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Catégorie non trouvée."));
            recipe.setCategory(category);
        }

        if (image != null && !image.isEmpty()) {
            recipe.setImage(fileStorageService.storeRecipeImage(image));
        }

        return mapToDto(recipeRepository.save(recipe), author.getId());
    }

    @Transactional
    public RecipeDto updateRecipe(String slug, RecipeRequest request, MultipartFile image, String username) {
        validateRecipeRequest(request);
        validateImage(image);

        Recipe recipe = recipeRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Recette non trouvée."));

        if (!recipe.getAuthor().getUsername().equals(username)) {
            throw new UnauthorizedActionException("Vous ne pouvez pas modifier cette recette.");
        }

        String newTitle = request.getTitle().trim();

        if (!recipe.getTitle().equalsIgnoreCase(newTitle)) {
            recipe.setSlug(generateSlug(newTitle, recipe.getId()));
        }

        recipe.setTitle(newTitle);
        recipe.setDescription(request.getDescription().trim());
        recipe.setIngredients(request.getIngredients().trim());
        recipe.setInstructions(request.getInstructions().trim());
        recipe.setPreparationTime(safeInteger(request.getPreparationTime(), 0));
        recipe.setCookingTime(safeInteger(request.getCookingTime(), 0));
        recipe.setServings(safeInteger(request.getServings(), 1));
        recipe.setPublished(request.isPublished());

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Catégorie non trouvée."));
            recipe.setCategory(category);
        } else {
            recipe.setCategory(null);
        }

        if (image != null && !image.isEmpty()) {
            recipe.setImage(fileStorageService.storeRecipeImage(image));
        }

        return mapToDto(recipeRepository.save(recipe), recipe.getAuthor().getId());
    }

    @Transactional
    public void deleteRecipe(String slug, String username) {
        Recipe recipe = recipeRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Recette non trouvée."));

        if (!recipe.getAuthor().getUsername().equals(username)) {
            throw new UnauthorizedActionException("Vous ne pouvez pas supprimer cette recette.");
        }

        recipeRepository.delete(recipe);
    }

    private void validateRecipeRequest(RecipeRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Les données de la recette sont obligatoires.");
        }

        if (isBlank(request.getTitle())) {
            throw new IllegalArgumentException("Le titre est obligatoire.");
        }

        if (isBlank(request.getDescription())) {
            throw new IllegalArgumentException("La description est obligatoire.");
        }

        if (isBlank(request.getIngredients())) {
            throw new IllegalArgumentException("Les ingrédients sont obligatoires.");
        }

        if (isBlank(request.getInstructions())) {
            throw new IllegalArgumentException("Les instructions sont obligatoires.");
        }

        if (request.getPreparationTime() != null && request.getPreparationTime() < 0) {
            throw new IllegalArgumentException("Le temps de préparation ne peut pas être négatif.");
        }

        if (request.getCookingTime() != null && request.getCookingTime() < 0) {
            throw new IllegalArgumentException("Le temps de cuisson ne peut pas être négatif.");
        }

        if (request.getServings() != null && request.getServings() < 1) {
            throw new IllegalArgumentException("Le nombre de portions doit être au moins 1.");
        }
    }

    private void validateImage(MultipartFile image) {
        if (image == null || image.isEmpty()) {
            return;
        }

        if (image.getSize() > MAX_IMAGE_SIZE) {
            throw new IllegalArgumentException("L'image ne doit pas dépasser 5MB.");
        }

        String contentType = image.getContentType();

        if (contentType == null || !ALLOWED_IMAGE_TYPES.contains(contentType.toLowerCase(Locale.ROOT))) {
            throw new IllegalArgumentException("Le fichier doit être une image valide: JPG, PNG, WEBP ou GIF.");
        }
    }

    private String generateSlug(String title, Long currentRecipeId) {
        String baseSlug = title.toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "")
                .trim();

        if (baseSlug.isBlank()) {
            baseSlug = "recipe";
        }

        String slug = baseSlug;
        int counter = 1;

        while (slugExistsForAnotherRecipe(slug, currentRecipeId)) {
            slug = baseSlug + "-" + counter++;
        }

        return slug;
    }

    private boolean slugExistsForAnotherRecipe(String slug, Long currentRecipeId) {
        return recipeRepository.findBySlug(slug)
                .map(existingRecipe -> currentRecipeId == null || !existingRecipe.getId().equals(currentRecipeId))
                .orElse(false);
    }

    private Pageable createPageable(int page, int size, String sort) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), MAX_PAGE_SIZE);

        Sort sorting = Sort.by("createdAt").descending();

        if ("title".equalsIgnoreCase(sort)) {
            sorting = Sort.by("title").ascending();
        } else if ("updatedAt".equalsIgnoreCase(sort)) {
            sorting = Sort.by("updatedAt").descending();
        }

        return PageRequest.of(safePage, safeSize, sorting);
    }

    private double calculateAverageRating(Recipe recipe) {
        if (recipe.getId() == null) {
            return 0.0;
        }

        return ratingRepository.findAverageRatingByRecipeId(recipe.getId());
    }

    private long calculateTotalRatings(Recipe recipe) {
        if (recipe.getId() == null) {
            return 0L;
        }

        return ratingRepository.countByRecipeId(recipe.getId());
    }

    private RecipeDto mapToDto(Recipe recipe) {
        return mapToDto(recipe, null);
    }

    private RecipeDto mapToDto(Recipe recipe, Long currentUserId) {
        double avgRating = calculateAverageRating(recipe);

        long totalRatings = calculateTotalRatings(recipe);
        long totalComments = recipe.getComments() == null ? 0L : recipe.getComments().size();

        boolean isFavorite = currentUserId != null &&
                favoriteRepository.existsByUserIdAndRecipeId(currentUserId, recipe.getId());

        return RecipeDto.builder()
                .id(recipe.getId())
                .title(recipe.getTitle())
                .slug(recipe.getSlug())
                .description(recipe.getDescription())
                .ingredients(recipe.getIngredients())
                .instructions(recipe.getInstructions())
                .preparationTime(recipe.getPreparationTime())
                .cookingTime(recipe.getCookingTime())
                .totalTime(recipe.getTotalTime())
                .servings(recipe.getServings())
                .imageUrl(recipe.getImage())
                .isPublished(recipe.isPublished())
                .createdAt(recipe.getCreatedAt())
                .updatedAt(recipe.getUpdatedAt())
                .authorId(recipe.getAuthor().getId())
                .authorUsername(recipe.getAuthor().getUsername())
                .categoryId(recipe.getCategory() != null ? recipe.getCategory().getId() : null)
                .categoryName(recipe.getCategory() != null ? recipe.getCategory().getName() : null)
                .categorySlug(recipe.getCategory() != null ? recipe.getCategory().getSlug() : null)
                .averageRating(Math.round(avgRating * 10.0) / 10.0)
                .totalRatings(totalRatings)
                .totalComments(totalComments)
                .isFavorite(isFavorite)
                .build();
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private Integer safeInteger(Integer value, Integer defaultValue) {
        return value == null ? defaultValue : value;
    }
}
