// Colocamos las rutas (o endpoints) en los que manejamos los comentarios

const express = require("express");
const commentController = require("../controllers/commentController");
const commentRouter = express.Router();

commentRouter.get("/:product", commentController.getCommentsByProductID);

commentRouter.post("/", commentController.postComment);

module.exports = commentRouter;