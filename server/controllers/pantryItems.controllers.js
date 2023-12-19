const PantryItem = require("./../models/pantryItems.model");

exports.getPantryItems = async (req, res) => {
  try {
    const identity = req.user.email || req.user.username;
    const pantryItems = await PantryItem.find({ identity: identity });
    // Handle the route '/api/pantry' (all products)
    if (req.baseUrl === "/api/pantry") {
      res.status(200).send({
        message: "List of Items",
        data: pantryItems,
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

exports.addPantryItem = async (req, res) => {
  const { ingredientName, ingredientCode, image, quantity, unitOfMeasurement } =
    req.body;

  try {
    // Check if a product with the same itemcode already exists
    // const existingItem = await PantryItem.findOne({
    //   ingredientCode,
    // });

    // if (existingItem) {
    //   return res.status(409).send({
    //     message: `${ingredientName} already exists.`,
    //   });
    // }

    const identity = req.user.email || req.user.username;
    // If no existing product, create and save the new product
    const newPantryItem = new PantryItem({
      ingredientName,
      ingredientCode,
      image,
      quantity,
      unitOfMeasurement,
      identity,
    });

    await newPantryItem.save();

    res.status(201).send({
      message: "New item has been added",
      data: newPantryItem,
    });
  } catch (error) {
    console.error("Error adding item:", error);
    res.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.updatePantryItem = async (req, res) => {
  try {
    const pantry = await PantryItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

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

exports.deletePantryItem = async (req, res) => {
  const { id } = req.params;

  try {
    await PantryItem.findByIdAndDelete(id);
    res.status(200).send("Item deleted successfully.");
  } catch (error) {
    res.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
};
