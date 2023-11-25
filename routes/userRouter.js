// Colocamos las rutas (o endpoints) sobre los que trabajamos en relacion a los usuarios, y que funciones se ejecutaran en cada uno de ellos

const express = require("express");
const userController = require("../controllers/userController");
const userRouter = express.Router();

userRouter.get("/:email", userController.getUserByEmail);

userRouter.post("/", userController.postUser);

userRouter.post("/verify", userController.verifyUser);

userRouter.put("/", userController.putUserPassword);

userRouter.put("/user_data", userController.putUserData);

module.exports = userRouter;