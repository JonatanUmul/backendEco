import { pool } from "../../../src/db.js";

export const postDCFMP = async (req, res) => {
  const {
      id_cfmp,
      id_turno,
      id_aserradero,
      id_formulador,
      barroLB,
      aserrinLB,
      humedadBarro,
      humedadAserrin
  } = req.body;

  try {
      if (
          id_cfmp !== '' &&
          id_turno !== '' &&
          id_aserradero !== '' &&
          id_formulador !== '' &&
          barroLB !== '' &&
          aserrinLB !== '' &&
          humedadBarro !== '' &&
          humedadAserrin !== ''
      ) {
          const consulta = 'INSERT INTO dcfmp(id_cfmp, id_turno, id_aserradero, id_formulador, barroLB, aserrinLB, humedadBarro, humedadAserrin) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
          const [rows] = await pool.query(consulta, [id_cfmp, id_turno, id_aserradero, id_formulador, barroLB, aserrinLB, humedadBarro, humedadAserrin]);
          res.send({ rows });
      } else {
          res.status(400).send({ error: 'Faltan datos en la solicitud' });
      }
  } catch (err) {
      console.log('Error al guardar los datos', err);
      res.status(500).send({ error: 'Hubo un error al guardar los datos' });
  }
};





export const getDCFMP= async(req, res)=>{
const id= req.params.id;

try {
  const consulta= `
  SELECT 
  d.fecha_produccion,
  d.hora_creacion,
  d.barroLB,
  d.aserrinLB,
  d.humedadBarro,
  d.humedadAserrin,
  d.id_aserradero,
  aserradero.nombre_aserradero AS aserradero,
  turno.turno AS turnoProduccion,
  operarios.Nombre AS formulador
  
  FROM dcfmp d
  
  LEFT JOIN aserradero ON d.id_aserradero= aserradero.id
  LEFT JOIN turno ON d.id_turno= turno.id
  LEFT JOIN operarios ON d.id_formulador = operarios.id
  where d.id_cfmp=?
  `
  const [rows]= await pool.query(consulta, [id])
  res.status(200).json({ data: rows });
  
} catch (error) {
  console.error("Error al obtener los datos de la tabla dtp:", error);
  res.status(500).json({ error: "Error al obtener los datos de la tabla dtp" });
}

} 






export const getDCFMPP= async(req, res)=>{
  const {  modeloUF, pulidor, fecha_creacion_inicio, fecha_creacion_fin } = req.params; 
  console.log(fecha_creacion_inicio,fecha_creacion_fin)
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
  
        if (modeloUF !== 'null') {
            consulta += ' AND (d.id_modelo IS NULL OR d.id_modelo = ?)';
            params.push(modeloUF);
        }
        if (pulidor !== 'null') {
          consulta += ' AND (d.id_pulidor IS NULL OR d.id_pulidor = ?)';
          params.push(pulidor);
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
  