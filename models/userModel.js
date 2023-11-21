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

// Función que retorna todos los elementos de la base de datos

const getUsers = async () => {

    let conn;
    try {
        
        conn = await pool.getConnection();

        const rows = await conn.query(
            "SELECT * FROM users"
        );

        if (rows.length == 0){
            return [{message: "No hay usuarios registrados en el sistema"}];
        }

        return rows;

    } catch (error) {
        
    }finally {
        if (conn) conn.release();
    }
    return [{message: "Se produjo un error"}];

}


// Funcion que retorna el elemento de la base de datos que coincide con ese email

const getUserByEmail = async (email, password) => {

    let conn;
    try {
        
        conn = await pool.getConnection();

        const row = await conn.query(
            `SELECT * FROM users WHERE email=?`, [email]
        );

        if (row.length == 0){
            return [{message: "No existe un usuario con ese email en el sistema"}];
        }

        if (row[0].password != password){
            return [{message: "La contraseña ingresada no es correcta"}];
        }

        return row;
    } catch (error) {
        
    }finally {
        if (conn) conn.release();
    }
    return [{message: "Se produjo un error"}];

}

// Funcion que retorna el usuario agregado a la base de datos.

const postUser = async (user) => {

    let conn;
    try {
        
        conn = await pool.getConnection();

        const check = await conn.query(
            `SELECT * FROM users WHERE email=?`, [user.email]
        );

        if (check.length != 0){
            return [{message: "Ya existe un usuario con ese email en el sistema."}];
        }

        const insert = await conn.query(
            `INSERT INTO users (email, password) VALUES (?, ?)`, [user.email, user.password]
        );
        
        const row = await conn.query(`SELECT * FROM users WHERE email=?`, [user.email]);

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
            return [{message: "No existe un usuario con ese email en el sistema"}];
        }

        // Chequeamos que la contraseña sea correcta

        const check = await conn.query(`SELECT * FROM usuarios WHERE email = ? AND password = ?`, [user.email, user.password]);

        if (check.length == 0){
            return [{message: "La contraseña es incorrecta"}];
        }

        // Quitamos el elemento de la tabla

        const deleteUser = await conn.query(`DELETE FROM usuarios WHERE email = ?`, [user.email, user.password]);
    
        return row;

    } catch(error) {
    } finally {
        if (conn) conn.release();
    }

    return [{message: "Se produjo un error"}];

}

// Exportamos las funciones

module.exports = {
    getUsers,
    getUserByEmail,
    postUser,
    deleteUser
}