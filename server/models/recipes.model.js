const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  recipeName: {
    type: String,
    required: true,
  },
  recipeCode: {
    type: String,
  },
  image: {
    type: String,
    required: true,
  },
  imageType: {
    type: String,
  },
  ingredients: {
    type: [String],
    required: true,
  },
  totalCost: {
    type: Number,
    required: true,
  },
  costPerServing: {
    type: Number,
    required: true,
  },
  servingSize: {
    type: Number,
    required: true,
  },
  totalTime: {
    type: String,
    required: true,
  },
  dishTypes: {
    type: [String],
    required: true,
  },
  cuisine: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
});

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
