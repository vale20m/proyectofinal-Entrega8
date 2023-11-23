// Colocamos las rutas (o endpoints) sobre los que trabajamos en relacion a la wishlist de cada usuario

const express = require("express");
const wishlistController = require("../controllers/wishlistController");
const wishlistRouter = express.Router();

wishlistRouter.get("/:user", wishlistController.getItemsByUser);

wishlistRouter.get("/:user/:product", wishlistController.getItemByUserAndProduct);

wishlistRouter.post("/", wishlistController.postItem);

wishlistRouter.delete("/:user/:product", wishlistController.deleteItem);

module.exports = wishlistRouter;