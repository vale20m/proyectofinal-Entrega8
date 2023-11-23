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


// Funcion que retorna el item del carrito que coinciden con el usuario 

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

// Funcion que retorna el usuario agregado a la base de datos.

const postItem = async (item) => {

    let conn;
    try {
        
        conn = await pool.getConnection();

        const check = await getItemByUserAndProduct(item.user, item.id);

        if (check[0].message != undefined){
            return [{message: "Este item ya se encuentra en el carrito."}];
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

// Funcion que elimina a un usuario que coincide con el email indicado.

const deleteItem = async (user, id) => {

    let conn;
    try {
  
        conn = await pool.getConnection();

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

// Exportamos las funciones

module.exports = {
    getItemsByUser,
    getItemByUserAndProduct,
    postItem,
    deleteItem
}