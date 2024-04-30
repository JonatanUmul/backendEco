import { pool } from "../../../src/db.js";



export const postCPCD = async(req, res)=>{
    const id_est= 2;
    // const id_creador= req.body.id_creador;
   
    try{
    
       const consulta='INSERT INTO cpcd(id_est)Values(?)';
        const [rows]= await pool.query(consulta,[id_est])
        res.send({rows});
        
        
    }catch(err){
        console.log('Error al guardar los datos', err)
    }
}


export const putCPCD = async (req, res) => {
    const estado = req.body.id_est;
    const id = req.body.id;
    const fecha_creacion = new Date().toISOString().split('T')[0]; // Fecha actual del sistema en formato: YYYY-MM-DD
    const hora_creacion = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}); // Hora actual del sistema en formato: HH:MM

    try {
        if (estado === '' || id === '') {
            console.log('Uno o varios datos están vacíos');
        } else {
            const consulta = 'UPDATE cpcd SET id_est = ?, fecha_creacion = ?, hora_creacion = ? WHERE id = ?';
            const [rows] = await pool.query(consulta, [estado, fecha_creacion, hora_creacion, id]);
            res.send({ rows });
        }
    } catch (err) {
        console.log('Error al guardar los datos', err);
    }
};