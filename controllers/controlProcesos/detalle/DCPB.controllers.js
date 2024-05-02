import { pool } from "../../../src/db.js";



export const postDCPB = async(req, res)=>{
  const {
    id_CPB, id_modelo, id_pulidor, id_prensa,id_modulo, pulido,id_calificacion, fechaProduccion
    }= req.body
   
   
    try{
    
       const consulta='INSERT INTO dcpb(id_CPB, id_modelo, id_pulidor, id_prensa, id_modulo, pulido,id_calificacion, fechaProduccion)Values(?, ?,?,?,?,?,?,?)';
        const [rows]= await pool.query(consulta,[id_CPB, id_modelo, id_pulidor, id_prensa,id_modulo, pulido,id_calificacion, fechaProduccion])
        res.send({rows});
        
        
    }catch(err){
        console.log('Error al guardar los datos', err)
    }
}




export const getDCPB= async(req, res)=>{
const id= req.params.id;

try {
  const consulta= `
  select 
  d.id,
  d.pulido,
  d.fecha_creacion,
  d.hora_creacion,
  d.fechaProduccion,
  cpb.id as id_cpb,
  ufmodelo.nombre_modelo as modelo,
  operarios.Nombre as pulidor,
  enc_maq.nombre_maq as prensa,
  modulostarimas.modulo as modulo,
  calificaciones.calificacion as calificacion
  
  from 
    dcpb d
      
  left JOIN cpb on d.id_cpb= cpb.id
  left JOIN ufmodelo on d.id_modelo= ufmodelo.id_mod
  left join operarios on d.id_pulidor= operarios.id
  left join enc_maq on d.id_prensa= enc_maq.id_maq
  left join modulostarimas on d.id_modulo= modulostarimas.id
  left join calificaciones on d.id_calificacion= calificaciones.id
  
  where d.id_cpb=?
  `
  const [rows]= await pool.query(consulta, [id])
  res.status(200).json({ data: rows });
  
} catch (error) {
  console.error("Error al obtener los datos de la tabla dtp:", error);
  res.status(500).json({ error: "Error al obtener los datos de la tabla dtp" });
}

} 






export const getDCPBB= async(req, res)=>{
  const {  ufmodelo, id_pulidor, fecha_creacion_inicio, fecha_creacion_fin } = req.params; 
  console.log(fecha_creacion_inicio,fecha_creacion_fin,  ufmodelo, id_pulidor)
  try {
    let consulta= `
    select 
    d.id,
    d.pulido,
    d.fecha_creacion,
    d.hora_creacion,
    d.fechaProduccion,
    cpb.id as id_cpb,
    ufmodelo.nombre_modelo as modelo,
    operarios.Nombre as pulidor,
    enc_maq.nombre_maq as prensa,
    modulostarimas.modulo as modulo,
    calificaciones.calificacion as calificacion
    
    from 
      dcpb d
        
    left JOIN cpb on d.id_cpb= cpb.id
    left JOIN ufmodelo on d.id_modelo= ufmodelo.id_mod
    left join operarios on d.id_pulidor= operarios.id
    left join enc_maq on d.id_prensa= enc_maq.id_maq
    left join modulostarimas on d.id_modulo= modulostarimas.id
    left join calificaciones on d.id_calificacion= calificaciones.id
  
    WHERE 1=1`;
  
        const params = [];
  
        if (ufmodelo !== 'null' ) {
            consulta += ' AND (d.id_modelo IS NULL OR d.id_modelo = ?)';
            params.push(ufmodelo);
        }
        if (id_pulidor !== 'null' ) {
          consulta += ' AND (d.id_pulidor IS NULL OR d.id_pulidor = ?)';
          params.push(id_pulidor);
      }
     
  
  
      if (fecha_creacion_inicio !== 'null' && fecha_creacion_fin !== 'null') {
        if (fecha_creacion_inicio !== 'null' && fecha_creacion_fin !== 'null') {
            consulta += ' AND (d.fecha_creacion BETWEEN ? AND ?)';
            params.push(fecha_creacion_inicio, fecha_creacion_fin);
        } else if (fecha_creacion_inicio !== 'null') {
            consulta += ' AND d.fecha_creacion >= ?';
            params.push(fecha_creacion_inicio);
        } else {
            consulta += ' AND d.fecha_creacion <= ?';
            params.push(fecha_creacion_fin);
        }
    }
  

      
  
        const [rows] = await pool.query(consulta, params);
  
        res.status(200).json(rows);
    } catch (error) {
        console.error("Error al obtener los datos de la tabla dthp:", error);
        res.status(500).json({ error: "Error al obtener los datos de la tabla dthp" });
    }
  };
  