// Colocamos las rutas (o endpoints) sobre los que trabajamos, y que funciones se ejecutaran en cada uno de ellos

const express = require("express");
const userController = require("../controllers/userController");
const userRouter = express.Router();

userRouter.get("/:email/:password", userController.getUserByEmail);

userRouter.post("/", userController.postUser);

userRouter.post("/verify", userController.verifyUser);

userRouter.delete("/", userController.deleteUser);

module.exports = userRouter;