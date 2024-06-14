import { pool } from "../src/db.js";
import jwt from 'jsonwebtoken';

// import bcrypt from 'bcrypt';

export const postUsuarios = async (req, res) => {
    const { username, password } = req.body;

console.log(username, password)
    try {
        // Realizar la consulta a la base de datos para obtener la contraseña almacenada
        const [rows] = await pool.query("SELECT password, id_rol, username, nombre FROM user WHERE username = ? ", [username]);
        console.log(rows)
        if (rows.length === 0) {
            console.log("Usuario no encontrado");
            return res.status(401).send({ message: "Usuario no encontrado" });
        } 
   
        const id_rol=rows[0].id_rol;
        const usuario= rows[0].username;
        const nombre= rows[0].nombre
        const storedPassword = rows[0].password;
        console.log('pas de la BD',storedPassword)
    console.log('Nombre capturado',nombre)
        const compararContraseña=(password===storedPassword)
        
        // Comparar la contraseña ingresada con la contraseña almacenada
        // const passwordMatch = await bcrypt.compare(password, storedPassword);

        if (!compararContraseña) {
            console.log("Contraseña incorrecta");
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }
        

        console.log("Inicio de sesión exitoso");

        const token = jwt.sign({username, id_rol, nombre, usuario}, "Stack", {

            expiresIn: '24h' // expires in 24 hours

             });        res.status(200).json({ message: "Inicio de sesión exitoso", token, username, id_rol, usuario, nombre });
        console.log('Token',token)
    } catch (error) {
        console.error("Error al ejecutar la consulta:", error);
        res.status(500).json({ error: "Error del servidor" });
    }
};
