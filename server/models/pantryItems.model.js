const mongoose = require("mongoose");

const pantryItemSchema = new mongoose.Schema({
  ingredientName: {
    type: String,
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

const PantryItem = mongoose.model("PantryItem", pantryItemSchema);

module.exports = PantryItem;
