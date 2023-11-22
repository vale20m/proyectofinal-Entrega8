// Traemos la libreria express

const express = require("express");

const app = express();

// Guardamos el puerto

const port = 3000;

// Traemos la libreria JWT y creamos una clave

const jwt = require("jsonwebtoken");
const CLAVE_SECRETA = "CLAVE SUPER SECRETA";


// Establecemos que las respuestas sean en formato JSON

app.use(express.json());

app.use(express.static("public"));

// Permitimos que el servidor reciba peticiones

app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});

app.get("/", (req, res) => {
    res.send("<h1>Bienvenid@ al sistema!</h1>");
});

// Verificamos al usuario



// Realizamos todas las operaciones

app.get("/cats", (req, res) => {
    res.json(require("./emercado-api/cats/cat.json"));
});

app.get("/cats_products/:catID", (req, res) => {
    res.json(require(`./emercado-api/cats_products/${req.params.catID}.json`));
});

app.get("/products/:productID", (req, res) => {
    res.json(require(`./emercado-api/products/${req.params.productID}.json`));
});

app.get("/products_comments/:productID", (req, res) => {
    res.json(require(`./emercado-api/products_comments/${req.params.productID}.json`));
});

app.get("/user_cart", (req, res) => {
    res.json(require(`./emercado-api/user_cart/25801.json`));
});

app.get("/cart", (req, res) => {
    res.json(require("./emercado-api/cart/buy.json"));
});

app.get("/sell", (req, res) => {
    res.json(require("./emercado-api/sell/publish.json"));
});

// Realizamos las peticiones de usuarios

const userRouter = require("./routes/userRouter");

app.use("/login", userRouter);