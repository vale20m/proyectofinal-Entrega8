// Colocamos las rutas (o endpoints) sobre los que trabajamos, y que funciones se ejecutaran en cada uno de ellos

const express = require("express");
const commentController = require("../controllers/commentController");
const commentRouter = express.Router();

commentRouter.get("/:product", commentController.getCommentsByProductID);

commentRouter.post("/", commentController.postComment);

commentRouter.delete("/", commentController.deleteUser);

module.exports = commentRouter;