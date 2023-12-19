const express = require("express");
const router = express.Router();
const authenticator = require("../module/authenticator");

const RecipesController = require("../controllers/recipes.controllers");

router.route("/").get(RecipesController.getRecipes);
router.route("/").post(RecipesController.addRecipe);
router.route("/search").get(RecipesController.getRecipesBySearchResults);
router.route("/:recipeName").delete(RecipesController.deleteRecipe);

module.exports = router;
