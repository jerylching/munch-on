const express = require("express");
const router = express.Router();
const authenticator = require("../module/authenticator");

const MealPlanController = require("../controllers/mealPlans.controllers");

router
  .route("/:date")
  .get(
    authenticator.verifyAccessToken,
    MealPlanController.getMealPlanForTheDay
  );
router
  .route("/add/:date")
  .post(authenticator.verifyAccessToken, MealPlanController.addMealsInMealPlan);
router
  .route("/create/:date")
  .post(authenticator.verifyAccessToken, MealPlanController.createMealPlan);
router
  .route("/delete/:date/:mealName/:recipeNameToDelete")
  .delete(
    authenticator.verifyAccessToken,
    MealPlanController.deleteRecipeFromMeal
  );

module.exports = router;
