const MealPlan = require("../models/mealPlans.model");
const Recipe = require("../models/recipes.model");

exports.getMealPlanForTheDay = async (req, res) => {
  try {
    const userId = req.user.id; // Ensure you have user authentication set up
    const dateParam = req.params.date;
    const selectedDate = new Date(dateParam);

    if (isNaN(selectedDate)) {
      return res.status(400).json({
        message: "Invalid date parameter.",
      });
    }

    const mealPlanForDate = await MealPlan.findOne({
      user: userId,
      date: selectedDate.toISOString().split("T")[0],
    }).populate("meals.recipe"); // Assuming a reference to recipes in meal plans

    if (!mealPlanForDate) {
      return res.status(404).json({
        message: "No meal plans found.",
      });
    }

    res.status(200).json(mealPlanForDate);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

//Create new meal plan for a day
exports.createMealPlan = async (req, res) => {
  try {
    const dateParam = req.params.date;
    const formattedDateParam = new Date(dateParam);
    const { mealType, recipeName } = req.body; // Refactored to use mealType and recipeName

    // Check if a meal plan already exists for the specified date
    let existingMealPlan = await MealPlan.findOne({
      date: formattedDateParam,
    });

    if (existingMealPlan) {
      // If the meal plan exists, just add the recipe to the correct meal type
      const meal = existingMealPlan.meals.find(
        (meal) => meal.name === mealType
      );
      if (meal) {
        // Avoid duplicates
        if (!meal.recipeName.includes(recipeName)) {
          meal.recipeName.push(recipeName);
        } else {
          return res.status(409).send({
            message: `Recipe already exists in ${mealType} for the date ${dateParam}.`,
          });
        }
      } else {
        // If the meal type doesn't exist, create it
        existingMealPlan.meals.push({
          name: mealType,
          recipeName: [recipeName],
        });
      }
    } else {
      // If the meal plan doesn't exist, create a new meal plan with the meal type and recipe
      existingMealPlan = new MealPlan({
        date: formattedDateParam,
        meals: [{ name: mealType, recipeName: [recipeName] }],
      });
    }

    // Save the updated or new meal plan to the database
    await existingMealPlan.save();

    res.status(201).send({
      message: "Meal plan has been updated with new recipe",
      data: existingMealPlan,
    });
  } catch (error) {
    console.error("Error adding meal plan:", error);
    res.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
};

//Update meal Plans by Adding New Recipes to a Meal
exports.addMealsInMealPlan = async (req, res) => {
  try {
    const dateParam = req.params.date;
    const formattedDateParam = new Date(dateParam);
    const { breakfastRecipeNames, lunchRecipeNames, dinnerRecipeNames } =
      req.body;

    // Fetch the existing meal plan for the specified date
    let existingMealPlanToUpdate = await MealPlan.findOne({
      date: formattedDateParam,
    });

    if (!existingMealPlanToUpdate) {
      return res.status(404).send({
        message: `No meal plan found for the date ${dateParam}.`,
      });
    }

    // Function to check for duplicate recipes in a meal
    const hasDuplicateRecipes = (meal, newRecipes) => {
      const existingRecipeNames = meal.recipeName; // Assuming recipeName is an array
      return newRecipes.some((recipeName) =>
        existingRecipeNames.includes(recipeName)
      );
    };

    // Function to check if recipes exist in the recipe database
    const recipesExistInDatabase = async (recipeNames) => {
      const existingRecipes = await Recipe.find({
        recipeName: { $in: recipeNames },
      });
      return existingRecipes.length === recipeNames.length;
    };

    // Function to add non-duplicate recipes to a meal
    const addNonDuplicateRecipes = (meal, newRecipes) => {
      const uniqueNewRecipes = newRecipes.filter(
        (recipeName) => !hasDuplicateRecipes(meal, [recipeName])
      );
      meal.recipeName = meal.recipeName.concat(uniqueNewRecipes);
    };

    // Check and update breakfast
    if (breakfastRecipeNames && Array.isArray(breakfastRecipeNames)) {
      if (
        hasDuplicateRecipes(
          existingMealPlanToUpdate.meals.find(
            (meal) => meal.name === "breakfast"
          ),
          breakfastRecipeNames
        )
      ) {
        return res.status(400).send({
          message: "Duplicate recipes found in breakfast.",
        });
      }

      if (!(await recipesExistInDatabase(breakfastRecipeNames))) {
        return res.status(400).send({
          message:
            "Some recipes in breakfast do not exist in the recipe database.",
        });
      }

      addNonDuplicateRecipes(
        existingMealPlanToUpdate.meals.find(
          (meal) => meal.name === "breakfast"
        ),
        breakfastRecipeNames
      );
    }

    // Check and update lunch
    if (lunchRecipeNames && Array.isArray(lunchRecipeNames)) {
      if (
        hasDuplicateRecipes(
          existingMealPlanToUpdate.meals.find((meal) => meal.name === "lunch"),
          lunchRecipeNames
        )
      ) {
        return res.status(400).send({
          message: "Duplicate recipes found in lunch.",
        });
      }

      if (!(await recipesExistInDatabase(lunchRecipeNames))) {
        return res.status(400).send({
          message: "Some recipes in lunch do not exist in the recipe database.",
        });
      }

      addNonDuplicateRecipes(
        existingMealPlanToUpdate.meals.find((meal) => meal.name === "lunch"),
        lunchRecipeNames
      );
    }

    // Check and update dinner
    if (dinnerRecipeNames && Array.isArray(dinnerRecipeNames)) {
      if (
        hasDuplicateRecipes(
          existingMealPlanToUpdate.meals.find((meal) => meal.name === "dinner"),
          dinnerRecipeNames
        )
      ) {
        return res.status(400).send({
          message: "Duplicate recipes found in dinner.",
        });
      }

      if (!(await recipesExistInDatabase(dinnerRecipeNames))) {
        return res.status(400).send({
          message:
            "Some recipes in dinner do not exist in the recipe database.",
        });
      }

      addNonDuplicateRecipes(
        existingMealPlanToUpdate.meals.find((meal) => meal.name === "dinner"),
        dinnerRecipeNames
      );
    }

    // Save the updated meal plan
    await existingMealPlanToUpdate.save();

    res.status(200).send({
      message: `Meal has been added`,
      data: existingMealPlanToUpdate,
    });
  } catch (error) {
    console.error("Error updating meal plan:", error);
    res.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.deleteRecipeFromMeal = async (req, res) => {
  try {
    const { date, mealName, recipeNameToDelete } = req.params;

    const formattedDateParam = new Date(date);
    let existingMealPlanToUpdate = await MealPlan.findOne({
      date: formattedDateParam,
    });

    if (!existingMealPlanToUpdate) {
      return res.status(404).send({
        message: `No meal plan found for the date ${date}.`,
      });
    }

    // Find the meal to update
    const mealToUpdate = existingMealPlanToUpdate.meals.find(
      (meal) => meal.name === mealName
    );

    if (!mealToUpdate) {
      return res.status(404).send({
        message: `Meal ${mealName} not found in the meal plan.`,
      });
    }

    // Remove the recipe from the meal
    const recipeIndex = mealToUpdate.recipeName.indexOf(recipeNameToDelete);
    if (recipeIndex === -1) {
      return res.status(404).send({
        message: `Recipe ${recipeNameToDelete} not found in ${mealName}.`,
      });
    }

    mealToUpdate.recipeName.splice(recipeIndex, 1);

    // Save the updated meal plan
    await existingMealPlanToUpdate.save();

    res.status(200).send({
      message: `Recipe ${recipeNameToDelete} has been deleted from ${mealName}`,
      data: existingMealPlanToUpdate,
    });
  } catch (error) {
    console.error("Error deleting recipe from the meal plan:", error);
    res.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
};
