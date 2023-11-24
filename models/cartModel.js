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


// Funcion que retorna los items del carrito que coinciden con el usuario 

const getItemsByUser = async (user) => {

    let conn;
    try {
        
        conn = await pool.getConnection();

        const rows = await conn.query(
            `SELECT * FROM cart WHERE user = ?`, [user]
        );

        if (rows.length == 0){
            return [{message: "No tienes productos en el carrito."}];
        }

        return rows;
    } catch (error) {
        
    }finally {
        if (conn) conn.release();
    }
    return [{message: "Se produjo un error."}];

}

// Funcion que retorna el item del carrito que coincide con el usuario y el producto

const getItemByUserAndProduct = async (user, id) => {

    let conn;
    try {
        
        conn = await pool.getConnection();

        const row = await conn.query(
            `SELECT * FROM cart WHERE user = ? AND id = ?`, [user, id]
        );

        if (row.length == 0){
            return [{message: "Ese producto no se encuentra en el carrito"}];
        }

        return row;
    } catch (error) {
        
    }finally {
        if (conn) conn.release();
    }
    return [{message: "Se produjo un error."}];

}

// Función que retorna el usuario agregado a la base de datos.

const postItem = async (item) => {

    let conn;
    try {
        
        conn = await pool.getConnection();

        const check = await getItemByUserAndProduct(item.user, item.id);

        if (check[0].message == undefined){
            return [{message: "El item ya se encuentra en el carrito."}];
        }

        const insert = await conn.query(
            `INSERT INTO cart (id, user, name, unitCost, currency, count, image) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [item.id, item.user, item.name, item.unitCost, item.currency, item.count, item.image]
        );
        
        const row = await getItemByUserAndProduct(item.user, item.id);

        return row;
    } catch (error) {
        
    }finally {
        if (conn) conn.release();
    }
    return [{message: "Se produjo un error."}];

}

// Función que permite realizar la compra del producto (lo envia a otra tabla de la base de datos)

const postPurchaseItem = async (item) => {

    let conn;
    try {
        
        conn = await pool.getConnection();

        const insert = await conn.query(
            `INSERT INTO purchases (user, product, name, unitCost, currency, count, shipType,
            street, number, corner, creditCardNumber, cvv, expirationDate, accountNumber)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [item.user, item.id, item.name, item.unitCost, item.currency, item.count, item.shipType, item.street,
            item.number, item.corner, item.creditCardNumber, item.cvv, item.expirationDate, item.accountNumber]
        );

        return [{message: "Compra realizada de manera exitosa."}];
    } catch (error) {
        
    }finally {
        if (conn) conn.release();
    }
    return [{message: "Se produjo un error."}];

}

// Función que modifica la cantidad de un item especificado

const putItem = async (item, user, id) => {

    let conn;
    try {
        
        conn = await pool.getConnection();

        const insert = await conn.query(
            `UPDATE cart SET count = ? WHERE user = ? AND id = ?`,
            [item.count, user, id]
        );
        
        const row = await getItemByUserAndProduct(user, id);

        return row;
    } catch (error) {
        
    }finally {
        if (conn) conn.release();
    }
    return [{message: "Se produjo un error."}];

}

// Funcion que elimina a un item del carrito que coincide con el user y el id indicado.

const deleteItem = async (user, id) => {

    let conn;
    try {
  
        conn = await pool.getConnection();

        // Guardamos el item a eliminar

        const row = await getItemByUserAndProduct(user, id);

        // Quitamos el item de la base de datos

        const deleteUser = await conn.query(`DELETE FROM cart WHERE user = ? AND id = ?`, [user, id]);
    
        return row;

    } catch(error) {
    } finally {
        if (conn) conn.release();
    }

    return [{message: "Se produjo un error."}];

}

// Funcion que elimina a un item del carrito que coincide con el user y el id indicado.

const deleteItemsByUser = async (user) => {

    let conn;
    try {

        conn = await pool.getConnection();

        // Guardamos los items a eliminar

        const row = await getItemsByUser(user);

        // Quitamos los items de la base de datos

        const deleteUser = await conn.query(`DELETE FROM cart WHERE user = ?`, [user]);

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
    postPurchaseItem,
    putItem,
    deleteItem,
    deleteItemsByUser
}