// Establecemos como se manejan las peticiones sobre comentarios

const commentModel = require("../models/commentModel");

// Manejamos las peticiones GET

const getCommentsByProductID = async (req, res) => {

    const comments = await commentModel.getCommentsByProductID(req.params.product);
    res.json(comments);

}

// Manejamos las peticiones POST

const postComment = async (req, res) => {

    const comment = await commentModel.postComment(req.body);
    res.json(comment[0]);

}

// Manejamos las peticiones DELETE

const deleteUser = async (req, res) => {

    const user = await commentModel.deleteUser(req.body);
    res.json(user[0]);

}

module.exports = {
    getCommentsByProductID,
    postComment,
    deleteUser
}