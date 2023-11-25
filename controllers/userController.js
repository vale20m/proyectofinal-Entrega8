// Establecemos como se manejan las peticiones sobre usuarios

const userModel = require("../models/userModel");

const jwt = require("jsonwebtoken");
const CLAVE_SECRETA = "CLAVE SUPER SECRETA";

// Manejamos las peticiones GET

const getUserByEmail = async (req, res) => {

    const user = await userModel.getUserByEmail(req.params.email, req.params.password);
    res.json(user[0]);

}

// Manejamos las peticiones POST

const postUser = async (req, res) => {

    const user = await userModel.postUser(req.body);
    res.json(user[0]);

}

// Manejamos la verificación del usuario (retornamos un token si el usuario esta verificado)

const verifyUser = async (req, res) => {

    try {
        const {email, password} = req.body;
        const token = jwt.sign({email}, CLAVE_SECRETA);
        res.status(200).json({token});
    } catch (error) {
        res.status(401).json({message: "Ha ocurrido un error."});
    }

};

// Manejamos las peticiones PUT

const putUserPassword = async (req, res) => {

    const user = await userModel.putUserPassword(req.body);
    res.json(user[0]);

}

// Manejamos las peticiones DELETE

const deleteUser = async (req, res) => {

    const user = await userModel.deleteUser(req.body);
    res.json(user[0]);

}

module.exports = {
    getUserByEmail,
    postUser,
    verifyUser,
    putUserPassword,
    deleteUser
}