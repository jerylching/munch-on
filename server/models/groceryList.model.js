const mongoose = require("mongoose");

const groceryListSchema = new mongoose.Schema({
  ingredientName: {
    type: String,
    required: true,
  },
  ingredientCode: {
    type: String,
  },
  image: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  unitOfMeasurement: {
    type: String,
    required: true,
  },
  identity: String,
});

const GroceryList = mongoose.model("GroceryList", groceryListSchema);

module.exports = GroceryList;
