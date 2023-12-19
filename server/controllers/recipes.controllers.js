const Recipe = require("../models/recipes.model");

exports.getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    // Handle the route '/api/recipes' (all products)
    if (req.baseUrl === "/api/recipes") {
      res.status(200).send({
        message: "List of Recipes",
        data: recipes,
      });
    }
    // Handle other cases or invalid routes
    else {
      res.status(404).send({
        message: "Route not found",
      });
    }
  } catch (error) {
    console.error("Error getting the recipes:", error);
    res.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getRecipesBySearchResults = async (req, res) => {
  try {
    const searchedDishType = req.query.dishtype;
    const searchedCuisine = req.query.cuisine;
    const searchedIngredient = req.query.ingredient;
    const searchedPantryItem = req.query.pantry;
    const recipes = await Recipe.find();

    let searchedResults = recipes;

    if (searchedDishType) {
      // Filter by dish type
      searchedResults = searchedResults.filter((recipe) =>
        recipe.dishTypes.includes(searchedDishType)
      );
    }
    if (searchedCuisine) {
      // Filter by cuisine
      searchedResults = searchedResults.filter((recipe) =>
        recipe.cuisine.includes(searchedCuisine)
      );
    }
    if (searchedIngredient) {
      // Filter by ingredients
      searchedResults = searchedResults.filter((recipe) =>
        recipe.ingredients.includes(searchedIngredient)
      );
    }
    if (searchedPantryItem) {
      const searchedPantryItemName = searchedPantryItem;

      searchedResults = searchedResults.filter((recipe) => {
        return recipe.ingredients.includes(searchedPantryItemName);
      });
    }
    if (recipes.length === 0) {
      res.status(404).send({
        message: "No recipes available.",
      });
    } else {
      res.status(200).send({
        message: "Displaying searched recipes",
        data: searchedResults,
      });
    }
  } catch (error) {
    console.error("Error searching for recipes:", error);
    res.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.addRecipe = async (req, res) => {
  try {
    // Extract the data from the request body
    const {
      recipeName,
      recipeCode,
      image,
      imageType,
      ingredients,
      totalCost,
      costPerServing,
      servingSize,
      totalTime,
      dishTypes,
      cuisine,
      source,
    } = req.body;

    // Create a new recipe instance using the Recipe model
    const newRecipe = new Recipe({
      recipeName,
      recipeCode,
      image,
      imageType,
      ingredients,
      totalCost,
      costPerServing,
      servingSize,
      totalTime,
      dishTypes,
      cuisine,
      source,
    });

    // Save the new recipe to the database
    await newRecipe.save();

    // Send a success response
    res
      .status(201)
      .json({ message: "Recipe added successfully", recipe: newRecipe });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteRecipe = async (req, res) => {
  try {
    const { recipeName } = req.params;
    const deletedRecipe = await Recipe.findOneAndDelete({ recipeName });

    if (deletedRecipe) {
      res.status(200).send({
        message: `${recipeName} has been has been deleted.`,
        success: true,
      });
    } else {
      res.status(404).send({
        message: "Recipe not found.",
      });
    }
  } catch (error) {
    console.error("Error deleting recipe:", error);
    res.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
};
