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


// Funcion que retorna los items del carrito que coinciden con el usuario y no han sido comprados

const getItemsByUser = async (user) => {

    let conn;
    try {
        
        conn = await pool.getConnection();

        const rows = await conn.query(
            `SELECT * FROM cart WHERE user = ? AND bought = 0`, [user]
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
            `SELECT * FROM cart WHERE user = ? AND id = ? AND bought = 0`, [user, id]
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

const getIDPurchase = async (user) => {

    let conn;
    try {
        
        conn = await pool.getConnection();

        const rows = await conn.query(
            `SELECT * FROM cart WHERE user = ? AND bought = 1 ORDER BY idPurchase DESC`, [user]
        );

        if (rows[0].idPurchase == undefined){
            return {message: "No has realizado ninguna compra"};
        }

        return rows[0].idPurchase;

    } catch (error) {
        
    }finally {
        if (conn) conn.release();
    }
    return {message: "Se produjo un error."};

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
            `INSERT INTO cart (idPurchase, id, user, name, unitCost, currency, count, image, bought) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [item.idPurchase, item.id, item.user, item.name, item.unitCost, item.currency, item.count, item.image, 0]
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
            `INSERT INTO purchases (idPurchase, user, shipType, street, number,
            corner, creditCardNumber, cvv, expirationDate, accountNumber, totalCost)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [item.idPurchase, item.user, item.shipType, item.street, item.number, item.corner,
            item.creditCardNumber, item.cvv, item.expirationDate, item.accountNumber, item.totalCost]
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
            `UPDATE cart SET count = ? WHERE user = ? AND id = ? AND bought = 0`,
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

// Función que actualiza el atributo "bought" de todos los items de un usuario

const putItemsBought = async (user) => {

    let conn;
    try {
        
        conn = await pool.getConnection();

        const insert = await conn.query(
            `UPDATE cart SET bought = 1 WHERE user = ? AND bought = 0`, [user]
        );
        
        const row = await getItemsByUser(user);

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

        const deleteUser = await conn.query(`DELETE FROM cart WHERE user = ? AND id = ? AND bought = 0`, [user, id]);
    
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
    getIDPurchase,
    postItem,
    postPurchaseItem,
    putItem,
    putItemsBought,
    deleteItem,
}