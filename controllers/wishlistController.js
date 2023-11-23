// Establecemos como se manejan las peticiones sobre la wishlist de los usuarios

const wishlistModel = require("../models/wishlistModel");

// Manejamos las peticiones GET

const getItemsByUser = async (req, res) => {

    const items = await wishlistModel.getItemsByUser(req.params.user);
    res.json(items);

}

const getItemByUserAndProduct = async (req, res) => {

    const item = await wishlistModel.getItemByUserAndProduct(req.params.user, req.params.product);
    res.json(item[0]);

}

// Manejamos las peticiones POST

const postItem = async (req, res) => {

    const item = await wishlistModel.postItem(req.body);
    res.json(item[0]);

}

// Manejamos las peticiones DELETE

const deleteItem = async (req, res) => {

    const item = await wishlistModel.deleteItem(req.params.user, req.params.product);
    res.json(item[0]);

}

module.exports = {
    getItemsByUser,
    getItemByUserAndProduct,
    postItem,
    deleteItem
}