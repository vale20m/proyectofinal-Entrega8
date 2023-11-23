// Manejamos la base de datos de los usuarios

const mariadb = require("mariadb");
const pool = 
mariadb.createPool({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "ecommerce",
    connectionLimit: 5
});


// Funcion que retorna el elemento de la base de datos que coincide con ese email

const getItemsByUser = async (user) => {

    let conn;
    try {
        
        conn = await pool.getConnection();

        const row = await conn.query(
            `SELECT * FROM wishlist WHERE user = ?`, [user]
        );

        if (row.length == 0){
            return [{message: "No tienes productos en la lista de deseados."}];
        }

        return row;
    } catch (error) {
        
    }finally {
        if (conn) conn.release();
    }
    return [{message: "Se produjo un error."}];

}

// Función que retorna un item de la base de datos que coincida con el user y el id de producto indicado

const getItemByUserAndProduct = async (user, product) => {

    let conn;
    try {
        
        conn = await pool.getConnection();

        const row = await conn.query(
            `SELECT * FROM wishlist WHERE user = ? AND product = ?`, [user, product]
        );

        if (row.length == 0){
            return [{message: "Este producto no ha sido agregado a la lista de deseados."}];
        }

        return row;
    } catch (error) {
        
    }finally {
        if (conn) conn.release();
    }
    return [{message: "Se produjo un error."}];

}

// Funcion que retorna el item agregado a la wishlist de la base de datos.

const postItem = async (item) => {

    let conn;
    try {
        
        conn = await pool.getConnection();

        const insert = await conn.query(
            `INSERT INTO wishlist (user, product, name, cost, currency, image) VALUES (?, ?, ?, ?, ?, ?)`,
            [item.user, item.product, item.name, item.cost, item.currency, item.image]
        );
        
        const row = await conn.query(`SELECT * FROM wishlist WHERE user = ? AND product = ?`, [item.user, item.product]);

        return row;
    } catch (error) {
        
    }finally {
        if (conn) conn.release();
    }
    return [{message: "Se produjo un error."}];

}

// Funcion que elimina a un item que coincide con el usuario y el id del producto indicado.

const deleteItem = async (user, product) => {

    let conn;
    try {
  
        conn = await pool.getConnection();

        const row = await conn.query(`SELECT * FROM wishlist WHERE user = ? AND product = ?`, [user, product]);

        // Quitamos el elemento de la tabla

        const deleteUser = await conn.query(`DELETE FROM wishlist WHERE user = ? AND product = ?`, [user, product]);
    
        return row;

    } catch(error) {
    } finally {
        if (conn) conn.release();
    }

    return [{message: "Se produjo un error."}];

}

// Exportamos las funciones

module.exports = {
    getItemsByUser,
    getItemByUserAndProduct,
    postItem,
    deleteItem
}