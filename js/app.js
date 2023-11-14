// Traemos la libreria express

const express = require("express");

const app = express();

// Guardamos el puerto

const port = 3000;


// Referenciamos a todos los JSON en variables

const categories = require("../emercado-api/cats/cat.json");
const products = require("../emercado-api/cats/cat.json");


// Establecemos que las respuestas sean en formato JSON

app.use(express.json());

// Permitimos que el servidor reciba peticiones

app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});

app.get("/", (req, res) => {
    res.send("<h1>Bienvenid@ al sistema!</h1>");
});

app.get("/cats", (req, res) => {
    req.json
});

