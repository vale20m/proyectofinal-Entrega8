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

// Función que retorna los comentarios de la base de datos relacionados con ese producto

const getCommentsByProductID = async (productID) => {

    let conn;
    try {
        
        conn = await pool.getConnection();

        const rows = await conn.query(
            `SELECT * FROM comments WHERE product = ?`, [productID]
        );

        if (rows.length == 0){
            return [{message: "No se encontraron comentarios."}];
        }

        return rows;
    } catch (error) {
        
    }finally {
        if (conn) conn.release();
    }
    return [{message: "Se produjo un error."}];

}


// Función que retorna el comentario de la base de datos relacionado con ese producto y usuario

const getCommentByUserAndProductID = async (user, product) => {

    let conn;
    try {
        
        conn = await pool.getConnection();

        const row = await conn.query(
            `SELECT * FROM comments WHERE user = ? AND product = ?`, [user, product]
        );

        if (row.length == 0){
            return [{message: "No se encontraron comentarios."}]
        }

        return row;
    } catch (error) {
        
    }finally {
        if (conn) conn.release();
    }
    return [{message: "Se produjo un error."}];

}

// Función que retorna un comentario luego de agregarlo a la base de datos

const postComment = async (comment) => {

    let conn;
    try {
        
        conn = await pool.getConnection();

        const check = await getCommentByUserAndProductID(comment.user, comment.product);

        if (check[0].message == undefined){
            return [{message: "Ya realizaste un comentario en este producto."}];
        }

        const insert = await conn.query(
            `INSERT INTO comments (product, user, description, dateTime, score) VALUES (?, ?, ?, ?, ?)`, [comment.product, comment.user, comment.description, comment.dateTime, comment.score]
        );
        
        const row = await getCommentByUserAndProductID(comment.user, comment.product);

        return row;
    } catch (error) {

    }finally {
        if (conn) conn.release();
    }
    return [{message: "Se produjo un error."}];

}

// Funcion que elimina a un usuario que coincide con el email indicado.

const deleteUser = async (user) => {

    let conn;
    try {
  
        conn = await pool.getConnection();

        // Chequeamos que el usuario exista, y lo mostramos en caso de que exista

        const row = await conn.query(`SELECT * FROM usuarios WHERE email = ?`, [user.email]);

        if (row.length == 0){
            return [{message: "No existe un usuario con ese email en el sistema."}];
        }

        // Chequeamos que la contraseña sea correcta

        const check = await conn.query(`SELECT * FROM usuarios WHERE email = ? AND password = ?`, [user.email, user.password]);

        if (check.length == 0){
            return [{message: "La contraseña es incorrecta."}];
        }

        // Quitamos el elemento de la tabla

        const deleteUser = await conn.query(`DELETE FROM usuarios WHERE email = ?`, [user.email, user.password]);
    
        return row;

    } catch(error) {
    } finally {
        if (conn) conn.release();
    }

    return [{message: "Se produjo un error."}];

}

// Exportamos las funciones

module.exports = {
    getCommentsByProductID,
    getCommentByUserAndProductID,
    postComment,
    deleteUser
}