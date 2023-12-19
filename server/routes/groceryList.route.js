const express = require("express");
const router = express.Router();
const authenticator = require("../module/authenticator");

const GroceryListController = require("../controllers/groceryList.controllers");

router
  .route("/")
  .get(authenticator.verifyAccessToken, GroceryListController.getGroceryList);
router
  .route("/")
  .post(authenticator.verifyAccessToken, GroceryListController.addGroceryItem);
router
  .route("/:id")
  .patch(
    authenticator.verifyAccessToken,
    GroceryListController.updateGroceryItem
  )
  .delete(
    authenticator.verifyAccessToken,
    GroceryListController.deleteGroceryItem
  );

module.exports = router;
