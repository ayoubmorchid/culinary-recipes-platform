package com.culinaryrecipes.config;

import com.culinaryrecipes.enums.Role;
import com.culinaryrecipes.recipes.Category;
import com.culinaryrecipes.recipes.CategoryRepository;
import com.culinaryrecipes.recipes.Recipe;
import com.culinaryrecipes.recipes.RecipeRepository;
import com.culinaryrecipes.users.User;
import com.culinaryrecipes.users.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final RecipeRepository recipeRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        User author = userRepository.findByUsername("chef-demo")
                .orElseGet(() -> userRepository.save(User.builder()
                        .username("chef-demo")
                        .email("chef.demo@culinaryrecipes.com")
                        .firstName("Chef")
                        .lastName("Demo")
                        .password(passwordEncoder.encode("Demo1234!"))
                        .role(Role.USER)
                        .enabled(true)
                        .build()));

        Map<String, Category> categories = seedCategories();
        reassignKnownSeedCategories(categories);
        seedRecipes(author, categories);
        removeKnownEmptySeedCategories();
    }

    private Map<String, Category> seedCategories() {
        Map<String, String> descriptions = new LinkedHashMap<>();
        descriptions.put("plates", "Moroccan main dishes served as generous family plates.");
        descriptions.put("entree", "Moroccan soups, cooked salads, small bites and starters.");
        descriptions.put("boisson", "Traditional Moroccan drinks, juices and milk-based beverages.");
        descriptions.put("dessert", "Moroccan sweets, pancakes, fried dough and festive desserts.");

        Map<String, Category> categories = new LinkedHashMap<>();
        descriptions.forEach((slug, description) -> {
            String name = switch (slug) {
                case "plates" -> "Plates";
                case "entree" -> "Entree";
                case "boisson" -> "Boisson";
                default -> "Dessert";
            };

            Category category = categoryRepository.findBySlug(slug)
                    .orElseGet(() -> Category.builder().slug(slug).build());
            category.setName(name);
            category.setDescription(description);
            categories.put(slug, categoryRepository.save(category));
        });

        return categories;
    }

    private void reassignKnownSeedCategories(Map<String, Category> categories) {
        Map<String, Category> targets = Map.ofEntries(
                Map.entry("tajines", categories.get("plates")),
                Map.entry("couscous-et-seffa", categories.get("plates")),
                Map.entry("plats", categories.get("plates")),
                Map.entry("soupes-et-entrees", categories.get("entree")),
                Map.entry("entrees", categories.get("entree")),
                Map.entry("vegetarien", categories.get("entree")),
                Map.entry("boissons", categories.get("boisson")),
                Map.entry("patisseries-et-the", categories.get("dessert")),
                Map.entry("desserts", categories.get("dessert")),
                Map.entry("pains-et-crepes", categories.get("dessert")),
                Map.entry("rapide", categories.get("dessert"))
        );

        recipeRepository.findAll().forEach(recipe -> {
            if (recipe.getCategory() == null) {
                return;
            }

            Category target = targets.get(recipe.getCategory().getSlug());
            if (target != null) {
                recipe.setCategory(target);
                recipeRepository.save(recipe);
            }
        });
    }

    private void removeKnownEmptySeedCategories() {
        String[] obsoleteSlugs = {
                "tajines",
                "couscous-et-seffa",
                "soupes-et-entrees",
                "pains-et-crepes",
                "patisseries-et-the",
                "plats",
                "entrees",
                "desserts",
                "vegetarien",
                "rapide",
                "boissons"
        };

        for (String slug : obsoleteSlugs) {
            categoryRepository.findBySlug(slug).ifPresent(category -> {
                if (recipeRepository.countByCategoryId(category.getId()) == 0) {
                    categoryRepository.delete(category);
                }
            });
        }
    }

    private void seedRecipes(User author, Map<String, Category> categories) {
        addOrUpdateRecipe(author, categories.get("plates"), "Tajine Djej Mqualli aux Citrons Confits", "tajine-djej-mqualli-aux-citrons-confits",
                "A classic Moroccan chicken tajine with preserved lemon, purple olives, saffron, ginger and a glossy onion sauce.",
                "1 chicken cut into pieces\n2 onions, thinly sliced\n2 garlic cloves, grated\n1 preserved lemon\n150 g purple olives\n1 bunch coriander and parsley\n1 teaspoon ginger\n1/2 teaspoon turmeric\nA few saffron threads\n3 tablespoons olive oil\nSalt and pepper",
                "Marinate the chicken with garlic, spices, herbs, olive oil, salt and pepper.\nCook the onions gently in a tajine or heavy pot.\nAdd the chicken and brown it on all sides.\nAdd a small glass of water, cover and simmer until tender.\nAdd preserved lemon and olives near the end.\nReduce the sauce until thick and serve with Moroccan bread.",
                25, 60, 4, "/images/recipes/real/tajine-djej-mqualli.jpg");

        addOrUpdateRecipe(author, categories.get("plates"), "Couscous Marocain aux Sept Legumes", "couscous-marocain-aux-sept-legumes",
                "Friday-style Moroccan couscous with steamed semolina, tender meat, chickpeas and seven vegetables.",
                "500 g medium couscous\n600 g beef or lamb\n2 carrots\n2 turnips\n2 courgettes\n1 piece pumpkin\n1 tomato\n1 onion\n150 g soaked chickpeas\n1/2 cabbage\nCoriander\n1 teaspoon ginger\n1 teaspoon turmeric\nOlive oil\nSalt and pepper",
                "Brown the meat with onion, tomato, olive oil and spices.\nAdd chickpeas, cover with water and cook until nearly tender.\nSteam the couscous, rubbing it with water and oil between steamings.\nAdd the vegetables to the broth according to their cooking time.\nWork butter or smen into the couscous.\nServe the couscous in a dome topped with meat, vegetables and hot broth.",
                35, 90, 6, "/images/recipes/real/couscous-sept-legumes.jpg");

        addOrUpdateRecipe(author, categories.get("plates"), "Rfissa au Poulet et Msemen", "rfissa-au-poulet-et-msemen",
                "A generous Moroccan family dish of chicken, lentils, fenugreek and shredded msemen soaked in fragrant broth.",
                "1 free-range chicken\n6 msemen or trid, shredded\n2 onions, sliced\n150 g lentils\n2 tablespoons soaked fenugreek\n1 teaspoon ras el hanout\n1 teaspoon ginger\n1 teaspoon turmeric\nA few saffron threads\nSmen or butter\nCoriander\nSalt and pepper",
                "Brown the chicken with onions, smen, herbs and spices.\nAdd lentils, fenugreek and water, then simmer slowly.\nKeep the sauce generous and deeply seasoned.\nSteam or warm the shredded msemen.\nArrange msemen on a large serving plate.\nTop with chicken and ladle over the lentil sauce.",
                35, 90, 6, "/images/recipes/real/rfissa-poulet-msemen.webp");

        addOrUpdateRecipe(author, categories.get("plates"), "Tanjia Marrakchia", "tanjia-marrakchia",
                "A Marrakesh specialty of slow-cooked meat with preserved lemon, garlic, cumin, saffron and smen.",
                "1 kg beef shank or shoulder\n4 garlic cloves, crushed\n1 preserved lemon\n1 teaspoon cumin\n1 teaspoon ginger\nA few saffron threads\n1 tablespoon smen\n3 tablespoons olive oil\n1 small glass water\nSalt and pepper",
                "Rub the meat with garlic, spices, smen, olive oil and preserved lemon.\nPlace everything in a tanjia jar or heavy covered pot with a little water.\nSeal well to trap the steam.\nCook very slowly until the meat is meltingly tender.\nOpen and reduce the sauce if needed.\nServe hot with Moroccan bread.",
                20, 180, 4, "/images/recipes/real/tanjia-marrakchia.jpg");

        addOrUpdateRecipe(author, categories.get("plates"), "Seffa Medfouna au Poulet", "seffa-medfouna-au-poulet",
                "Steamed sweet-savory couscous hiding saffron chicken, onions, raisins and toasted almonds.",
                "500 g fine couscous\n1 chicken, cut up\n3 onions, sliced\n100 g raisins\n150 g toasted almonds\n1 teaspoon cinnamon\n1 teaspoon ginger\nA few saffron threads\nButter\nPowdered sugar\nOil\nSalt and pepper",
                "Cook the chicken with onions, spices, oil and a little water.\nAdd raisins near the end and reduce the sauce.\nSteam the fine couscous in several passes.\nFluff it with butter, powdered sugar and cinnamon.\nLayer seffa on a platter, hide the chicken in the center and cover with couscous.\nDecorate with cinnamon, powdered sugar and almonds.",
                35, 80, 6, "/images/recipes/real/seffa-medfouna-poulet.webp");

        addOrUpdateRecipe(author, categories.get("plates"), "Bastilla au Poulet et Amandes", "bastilla-au-poulet-et-amandes",
                "A festive Moroccan sweet-savory pie with crisp warqa, spiced chicken, eggs and cinnamon almonds.",
                "10 warqa or brick sheets\n1 chicken\n4 onions, sliced\n5 eggs\n200 g blanched toasted almonds\n1 bunch parsley\n1 teaspoon ginger\n1 teaspoon cinnamon\nA few saffron threads\n80 g melted butter\n2 tablespoons powdered sugar\nSalt and pepper",
                "Cook the chicken with onions, herbs, spices and a little water.\nShred the chicken and reduce the sauce.\nStir beaten eggs into the sauce to make a soft filling.\nCrush almonds with powdered sugar and cinnamon.\nLayer buttered pastry sheets with chicken, egg filling and almonds.\nBake until golden and finish with powdered sugar and cinnamon.",
                45, 75, 6, "/images/recipes/real/bastilla-poulet-amandes.webp");

        addOrUpdateRecipe(author, categories.get("entree"), "Harira Marrakchia aux Pois Chiches", "harira-marrakchia-aux-pois-chiches",
                "A comforting Moroccan soup with tomatoes, chickpeas, lentils, celery, herbs and a light flour liaison.",
                "250 g meat in small cubes\n150 g soaked chickpeas\n80 g lentils\n1 grated onion\n4 blended tomatoes\n2 celery stalks\n1 bunch coriander and parsley\n1 teaspoon ginger\n1 teaspoon turmeric\n1 tablespoon tomato paste\n2 tablespoons flour\nVermicelli\nSalt and pepper",
                "Cook meat, onion, herbs, celery and spices in a little oil.\nAdd tomatoes, chickpeas, lentils and water, then simmer until tender.\nWhisk flour with cold water to make a smooth liaison.\nPour it in slowly while stirring.\nAdd tomato paste and vermicelli.\nSimmer until lightly thickened and serve with dates and lemon.",
                25, 75, 6, "/images/recipes/real/harira-marrakchia.jpg");

        addOrUpdateRecipe(author, categories.get("entree"), "Zaalouk d'Aubergines Grillees", "zaalouk-daubergines-grillees",
                "A smoky Moroccan cooked salad of eggplant, tomato, garlic, paprika, cumin and olive oil.",
                "3 eggplants\n4 grated tomatoes\n3 garlic cloves\n1 teaspoon paprika\n1 teaspoon cumin\n3 tablespoons olive oil\nChopped coriander\nLemon juice\nSalt and pepper",
                "Grill or roast the eggplants until the flesh is soft.\nPeel and chop the eggplant flesh.\nCook garlic, tomatoes, spices and olive oil together.\nAdd the eggplant and mash with a fork.\nSimmer until the liquid evaporates.\nFinish with coriander and lemon, then serve warm or cold.",
                20, 35, 4, "/images/recipes/real/zaalouk-aubergines.jpg");

        addOrUpdateRecipe(author, categories.get("entree"), "Briouat au Fromage et Herbes", "briouat-au-fromage-et-herbes",
                "Crisp Moroccan pastry triangles filled with fresh cheese, herbs and gentle spices.",
                "12 brick sheets\n250 g fresh cheese\n100 g grated cheese\n1 egg\nChopped parsley\nChopped coriander\n1 pinch cumin\nPepper\nMelted butter or oil\nHoney, optional",
                "Mix the cheeses with egg, herbs, cumin and pepper.\nCut pastry sheets into long strips.\nPlace a spoonful of filling on each strip and fold into tight triangles.\nBrush with melted butter or oil.\nBake or fry until golden.\nServe hot, plain or lightly drizzled with honey.",
                25, 15, 6, "/images/recipes/real/briouat-fromage-herbes.jpg");

        addOrUpdateRecipe(author, categories.get("entree"), "Maakouda Batata", "maakouda-batata",
                "Moroccan potato patties with coriander, parsley, cumin and paprika, fried until crisp.",
                "700 g potatoes\n2 garlic cloves, grated\n1 egg\nChopped parsley\nChopped coriander\n1 teaspoon cumin\n1/2 teaspoon paprika\nFlour for coating\nFrying oil\nSalt and pepper",
                "Boil the potatoes and mash them while warm.\nAdd garlic, egg, herbs, cumin, paprika, salt and pepper.\nShape the mixture into small patties.\nCoat lightly with flour.\nFry in hot oil until golden on both sides.\nDrain and serve with harissa or a fresh salad.",
                20, 25, 5, "/images/recipes/real/maakouda-batata.jpg");

        addOrUpdateRecipe(author, categories.get("entree"), "Bissara aux Feves et Huile d'Olive", "bissara-aux-feves-et-huile-dolive",
                "A rustic Moroccan fava bean soup served with olive oil, cumin and paprika.",
                "300 g dried split fava beans\n3 garlic cloves\n1 teaspoon cumin\n1 teaspoon paprika\n4 tablespoons olive oil\nWater\nSalt and pepper",
                "Rinse the split fava beans well.\nCook them with garlic and plenty of water until very soft.\nBlend until smooth and return to low heat.\nSeason with cumin, paprika, salt and pepper.\nAdjust the texture with hot water if needed.\nServe with olive oil, extra cumin and bread.",
                10, 60, 4, "/images/recipes/real/bissara-feves.jpg");

        addOrUpdateRecipe(author, categories.get("boisson"), "Atay Maghribi a la Menthe", "atay-maghribi-a-la-menthe",
                "Traditional Moroccan green tea with fresh mint, served sweet and poured high to create foam.",
                "1 tablespoon gunpowder green tea\n1 large bunch fresh mint\n3 to 4 tablespoons sugar\n1 liter boiling water",
                "Rinse the tea with a little boiling water and discard the first water.\nAdd sugar and part of the boiling water to the teapot.\nInfuse gently over low heat for a few minutes.\nAdd rinsed fresh mint without burning it.\nMix by pouring a glass and returning it to the teapot.\nPour from high above the glass to create a light foam.",
                10, 10, 6, "/images/recipes/real/atay-maghribi-menthe.jpg");

        addOrUpdateRecipe(author, categories.get("boisson"), "Jus d'Orange Marocain", "jus-dorange-marocain",
                "Fresh orange juice inspired by Moroccan street stalls, bright, cold and lightly scented with orange blossom.",
                "8 juicy oranges\n1 teaspoon orange blossom water\nIce cubes\nSugar or honey, optional",
                "Chill the oranges before juicing.\nPress the oranges and strain only if desired.\nStir in orange blossom water.\nTaste and sweeten lightly if the oranges are sharp.\nServe immediately over ice.\nGarnish with a thin orange slice.",
                10, 0, 4, "/images/recipes/real/jus-orange-marocain.jpg");

        addOrUpdateRecipe(author, categories.get("boisson"), "Avocat au Lait et Amandes", "avocat-au-lait-et-amandes",
                "A creamy Moroccan avocado milk drink blended with milk, almonds and a touch of honey.",
                "2 ripe avocados\n600 ml cold milk\n2 tablespoons ground almonds\n2 tablespoons honey\n1 pinch cinnamon\nIce cubes",
                "Peel and pit the avocados.\nBlend avocado with cold milk until smooth.\nAdd ground almonds, honey and cinnamon.\nBlend again until creamy.\nAdjust thickness with more milk if needed.\nServe cold over ice.",
                10, 0, 4, "/images/recipes/real/avocat-au-lait-amandes.jpg");

        addOrUpdateRecipe(author, categories.get("boisson"), "Panache Marocain aux Fruits", "panache-marocain-aux-fruits",
                "A layered Moroccan fruit juice with banana, orange, apple and strawberry, served cold and creamy.",
                "2 bananas\n2 oranges, juiced\n1 apple\n150 g strawberries\n250 ml cold milk\n1 tablespoon honey\nIce cubes",
                "Blend banana with milk and a little honey until creamy.\nBlend strawberries separately with orange juice.\nBlend apple with a splash of orange juice.\nLayer the mixtures in tall glasses.\nAdd ice cubes if desired.\nServe immediately with a spoon or straw.",
                15, 0, 4, "/images/recipes/real/panache-marocain-fruits.jpg");

        addOrUpdateRecipe(author, categories.get("dessert"), "Chebakia au Miel et Sesame", "chebakia-au-miel-et-sesame",
                "A Ramadan Moroccan pastry flavored with sesame, anise, cinnamon, orange blossom water and honey.",
                "500 g flour\n100 g toasted ground sesame\n1 teaspoon ground anise\n1 teaspoon cinnamon\n1 pinch ground gum arabic\n80 g melted butter\n80 ml orange blossom water\n1 egg yolk\n1 teaspoon baking powder\nFrying oil\nWarm honey\nSesame seeds",
                "Mix flour, ground sesame, spices, butter, orange blossom water and egg yolk.\nAdd a little water to make a firm smooth dough.\nRoll thinly and cut into slit rectangles.\nShape the chebakia by weaving the strips.\nFry until amber.\nDip in warm honey and sprinkle with sesame.",
                60, 35, 10, "/images/recipes/real/chebakia-miel-sesame.jpg");

        addOrUpdateRecipe(author, categories.get("dessert"), "Sellou aux Amandes et Sesame", "sellou-aux-amandes-et-sesame",
                "A rich Moroccan sweet made with toasted flour, almonds, sesame, honey, butter and warm spices.",
                "500 g toasted flour\n250 g toasted ground almonds\n250 g toasted ground sesame\n150 g honey\n150 g melted butter\n1 tablespoon ground anise\n1 teaspoon cinnamon\n1 pinch gum arabic\nPowdered sugar to taste",
                "Toast the flour gently until nutty, then sift it.\nMix flour, almonds, sesame, anise, cinnamon and gum arabic.\nAdd melted butter and honey gradually.\nRub the mixture until rich and even.\nAdjust sweetness to taste.\nServe shaped into a mound and decorated with almonds.",
                30, 20, 10, "/images/recipes/real/sellou-amandes-sesame.jpg");

        addOrUpdateRecipe(author, categories.get("dessert"), "Baghrir aux Mille Trous", "baghrir-aux-mille-trous",
                "Light Moroccan semolina pancakes full of tiny holes, served with melted butter and honey.",
                "250 g fine semolina\n80 g flour\n1 tablespoon dry yeast\n1 packet baking powder\n1 teaspoon sugar\n1/2 teaspoon salt\n500 ml warm water\nHoney\nMelted butter",
                "Blend semolina, flour, yeast, baking powder, sugar, salt and warm water.\nRest until the batter becomes lightly foamy.\nPour a ladleful onto a cool or warm nonstick pan.\nCook only on one side until holes form and the surface dries.\nRepeat, cooling the pan slightly if needed.\nServe with melted butter and honey.",
                15, 25, 6, "/images/recipes/real/baghrir-mille-trous.jpg");

        addOrUpdateRecipe(author, categories.get("dessert"), "Msemen Marocain Feuillete", "msemen-marocain-feuillete",
                "Square Moroccan layered pancakes, crisp outside and soft inside, served with honey and butter.",
                "350 g flour\n150 g fine semolina\n1 teaspoon salt\n1/2 teaspoon dry yeast\n300 ml warm water\nNeutral oil\nMelted butter\nFine semolina for layering",
                "Mix flour, semolina, salt, yeast and warm water into a soft dough.\nKnead until smooth and elastic.\nForm oiled balls and let them rest.\nStretch each ball very thin with oil and butter.\nSprinkle semolina, fold into a square and flatten gently.\nCook on a hot griddle until golden on both sides.",
                35, 20, 8, "/images/recipes/real/msemen-feuillete.jpg");

        addOrUpdateRecipe(author, categories.get("dessert"), "Sfenj Marocain", "sfenj-marocain",
                "Traditional Moroccan fried dough rings, airy inside and crisp at the edges, served warm with sugar or honey.",
                "500 g flour\n1 tablespoon dry yeast\n1 teaspoon salt\n1 teaspoon sugar\n350 ml warm water\nFrying oil\nSugar or honey for serving",
                "Mix flour, yeast, salt and sugar.\nAdd warm water gradually and beat into a sticky elastic dough.\nCover and let rise until doubled.\nWet your hands, take portions and stretch each into a ring.\nFry in hot oil until golden and puffed.\nDrain and serve warm with sugar or honey.",
                20, 25, 8, "/images/recipes/real/sfenj-marocain.jpg");
    }

    private void addOrUpdateRecipe(
            User author,
            Category category,
            String title,
            String slug,
            String description,
            String ingredients,
            String instructions,
            int preparationTime,
            int cookingTime,
            int servings,
            String image
    ) {
        Recipe recipe = recipeRepository.findBySlug(slug).orElseGet(Recipe::new);
        recipe.setTitle(title);
        recipe.setSlug(slug);
        recipe.setAuthor(recipe.getAuthor() != null ? recipe.getAuthor() : author);
        recipe.setCategory(category);
        recipe.setDescription(description);
        recipe.setIngredients(ingredients);
        recipe.setInstructions(instructions);
        recipe.setPreparationTime(preparationTime);
        recipe.setCookingTime(cookingTime);
        recipe.setServings(servings);
        recipe.setImage(image);
        recipe.setPublished(true);
        recipeRepository.save(recipe);
    }
}
