const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  recipeName: {
    type: [String],
    required: true,
  },
});

const mealPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, // Reference to User model
  },
  date: {
    type: Date,
    required: true,
  },
  meals: {
    type: [mealSchema],
    required: true,
  },
});

const MealPlan = mongoose.model("MealPlan", mealPlanSchema);

module.exports = MealPlan;
