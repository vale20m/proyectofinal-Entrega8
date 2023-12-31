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


// Función que retorna el elemento de la tabla de usuarios que coincide con ese email (si la contraseña es correcta)

const getUserByEmail = async (email) => {

    let conn;
    try {
        
        conn = await pool.getConnection();

        const row = await conn.query(
            `SELECT * FROM users WHERE email=?`, [email]
        );

        if (row.length == 0){
            return [{message: "No existe un usuario con ese email en el sistema."}];
        }

        return row;
    } catch (error) {
        
    }finally {
        if (conn) conn.release();
    }
    return [{message: "Se produjo un error."}];

}

// Función que retorna el usuario agregado a la tabla de usuarios.

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

// Función que modifica la contraseña de un usuario según su email

const putUserPassword = async (user) => {

    let conn;
    try {
  
        conn = await pool.getConnection();

        // Chequeamos que el usuario exista

        const row = await conn.query(`SELECT * FROM users WHERE email = ?`, [user.email]);

        if (row.length == 0){
            return [{message: "No existe un usuario con ese email en el sistema."}];
        }

        // Modificamos la contraseña

        const modifyPassword = await conn.query(`UPDATE users SET password = ? WHERE email = ?`, [user.password, user.email]);
    
        return row;

    } catch(error) {
    } finally {
        if (conn) conn.release();
    }

    return [{message: "Se produjo un error."}];

}

// Función que establece el resto de datos del usuario

const putUserData = async (user) => {

    let conn;
    try {
  
        conn = await pool.getConnection();

        const modifyUser = await conn.query(`UPDATE users SET name = ?, secondName = ?, lastName = ?,
        secondLastName = ?, phone = ? WHERE email = ?`,
        [user.name, user.secondName, user.lastName, user.secondLastName, user.phone, user.email]);

        return [{message: "Usuario actualizado exitosamente."}];

    } catch(error) {
    } finally {
        if (conn) conn.release();
    }

    return [{message: "Se produjo un error."}];

}

// Exportamos las funciones

module.exports = {
    getUserByEmail,
    postUser,
    putUserPassword,
    putUserData
}