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



// Realizamos todas las operaciones GET sobre los nuevos endpoints

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

app.get("/sell", (req, res) => {
    res.json(require("./emercado-api/sell/publish.json"));
});



// Realizamos las peticiones de usuarios

const userRouter = require("./routes/userRouter");

app.use("/login", userRouter);

// Realizamos las peticiones de comentarios

const commentRouter = require("./routes/commentRouter");

app.use("/comments", commentRouter);

// Realizamos las peticiones de wishlist

const wishlistRouter = require("./routes/wishlistRouter");

app.use("/wishlist", wishlistRouter);



// Verificamos que el usuario este autorizado antes de realizar una solicitud a la base de datos de los carritos y las compras

app.use("/cart", (req, res, next) => {
    
    try {
        const decoded = jwt.verify(req.headers["access-token"], CLAVE_SECRETA);
        next();
    } catch (error) {
        res.status(401).json({message: "Inicia sesión con un usuario válido para realizar esa acción."});
    }

});

app.get("/cart", (req, res) => {
    res.json(require(`./emercado-api/cart/buy.json`));
});

const cartRouter = require("./routes/cartRouter");

app.use("/cart", cartRouter);

const cartController = require("./controllers/cartController");

app.get("/id_purchase/:user", cartController.getIDPurchase);