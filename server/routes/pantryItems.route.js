const express = require('express');
const router = express.Router();
const authenticator = require('./../module/authenticator');

const PantryItemController = require('./../controllers/pantryItems.controllers');

router
  .route('/')
  .get(authenticator.verifyAccessToken, PantryItemController.getPantryItems);
router
  .route('/')
  .post(authenticator.verifyAccessToken, PantryItemController.addPantryItem);

router
  .route('/:id')
  .delete(
    authenticator.verifyAccessToken,
    PantryItemController.deletePantryItem
  )
  .patch(
    authenticator.verifyAccessToken,
    PantryItemController.updatePantryItem
  );

module.exports = router;
