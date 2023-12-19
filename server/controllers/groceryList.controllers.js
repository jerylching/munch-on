const GroceryList = require("../models/groceryList.model");

exports.getGroceryList = async (req, res) => {
  try {
    const identity = req.user.email || req.user.username;
    const groceryList = await GroceryList.find({ identity: identity });
    // Handle the route '/api/pantry' (all products)
    if (req.baseUrl === "/api/grocery") {
      res.status(200).send({
        message: "List of Items",
        data: groceryList,
      });
    }
    // Handle other cases or invalid routes
    else {
      res.status(404).send({
        message: "Route not found",
      });
    }
  } catch (error) {
    console.error("Error getting the items:", error);
    res.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.addGroceryItem = async (req, res) => {
  try {
    const {
      ingredientName,
      ingredientCode,
      image,
      quantity,
      unitOfMeasurement,
    } = req.body;

    // Check if a product with the same itemcode already exists
    // const existingItem = await GroceryList.findOne({ ingredientCode });

    // if (existingItem) {
    //     return res.status(409).send({
    //         message: `${ingredientName} already exists.`,
    //     });
    // }

    // If no existing product, create and save the new product
    const identity = req.user.email || req.user.username;
    const newGroceryItem = new GroceryList({
      ingredientName,
      ingredientCode,
      image,
      quantity,
      unitOfMeasurement,
      identity,
    });

    await newGroceryItem.save();

    res.status(201).send({
      message: "New item has been added",
      data: newGroceryItem,
    });
  } catch (error) {
    console.error("Error adding item:", error);
    res.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.updateGroceryItem = async (req, res) => {
  try {
    const pantry = await GroceryList.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        pantry,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.deleteGroceryItem = async (req, res) => {
  const { id } = req.params;

  try {
    await GroceryList.findByIdAndDelete(id);
    res.status(200).send("Item deleted successfully.");
  } catch (error) {
    res.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
};
