// Establecemos como se manejan las peticiones

const userModel = require("../models/userModel");

// Manejamos las peticiones GET

const getUsers = async (req, res) => {

    const users = await userModel.getUsers();
    res.json(users);

}

const getUserByEmail = async (req, res) => {

    const user = await userModel.getUserByEmail(req.params.email);
    res.json(user[0]);

}

// Manejamos las peticiones POST

const postUser = async (req, res) => {

    const user = await userModel.postUser(req.body);
    res.json(user);

}

// Manejamos las peticiones DELETE

const deleteUser = async (req, res) => {

    const user = await userModel.deleteUser(req.body);
    res.json(user[0]);

}

module.exports = {
    getUsers,
    getUserByEmail,
    postUser,
    deleteUser
}