// Colocamos las rutas (o endpoints) sobre los que trabajamos en relacion al carrito de cada usuario (según su email)

const express = require("express");
const cartController = require("../controllers/cartController");
const cartRouter = express.Router();

cartRouter.get("/:user", cartController.getItemsByUser);

cartRouter.get("/:user/:id", cartController.getItemByUserAndProduct);

cartRouter.post("/", cartController.postItem);

cartRouter.put("/:user/:id", cartController.putItem)

cartRouter.delete("/:user/:id", cartController.deleteItem);

module.exports = cartRouter;