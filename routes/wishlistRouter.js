// Colocamos las rutas (o endpoints) donde manejamos la wishlist de cada usuario

const express = require("express");
const wishlistController = require("../controllers/wishlistController");
const wishlistRouter = express.Router();

wishlistRouter.get("/:user", wishlistController.getItemsByUser);

wishlistRouter.get("/:user/:product", wishlistController.getItemByUserAndProduct);

wishlistRouter.post("/", wishlistController.postItem);

wishlistRouter.delete("/:user/:product", wishlistController.deleteItem);

module.exports = wishlistRouter;