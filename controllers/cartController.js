// Establecemos como se manejan las peticiones sobre el carrito de los usuarios

const cartModel = require("../models/cartModel");

// Manejamos las peticiones GET

const getItemsByUser = async (req, res) => {

    const items = await cartModel.getItemsByUser(req.params.user);
    res.json(items);

}

const getItemByUserAndProduct = async (req, res) => {

    const item = await cartModel.getItemByUserAndProduct(req.params.user, req.params.id);
    res.json(item[0]);

}

const getIDPurchase = async (req, res) => {

    const id = await cartModel.getIDPurchase(req.params.user);
    res.json(id);

}

// Manejamos las peticiones POST

const postItem = async (req, res) => {

    const item = await cartModel.postItem(req.body);
    res.json(item[0]);

}

const postPurchaseItem = async (req, res) => {

    const item = await cartModel.postPurchaseItem(req.body);
    res.json(item[0]);

}

// Manejamos las peticiones PUT

const putItem = async (req, res) => {

    const item = await cartModel.putItem(req.body, req.params.user, req.params.id);
    res.json(item[0]);

}

const putItemsBought = async (req, res) => {

    const items = await cartModel.putItemsBought(req.params.user);
    res.json(items);

}

// Manejamos las peticiones DELETE

const deleteItem = async (req, res) => {

    const item = await cartModel.deleteItem(req.params.user, req.params.id);
    res.json(item[0]);

}

module.exports = {
    getItemsByUser,
    getItemByUserAndProduct,
    getIDPurchase,
    postItem,
    putItem,
    putItemsBought,
    deleteItem,
    postPurchaseItem
}