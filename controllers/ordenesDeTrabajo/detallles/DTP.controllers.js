
import { pool } from "../../../src/db.js";

export const postDTP = async (req, res) => {
   
  const {
    id_OTP,fecha_real, id_grupoproduccion, id_turno,id_cernidodetalle,id_cernidodetalle2, id_Aserradero, id_Aserradero2, librasAserrin2, id_ufmodelo, producido, codigoInicio, codigoFinal, librasBarro, librasAserrin, observacion} = req.body;


console.log(id_grupoproduccion)
  try {
    if(id_OTP===''|| id_turno===''|| id_grupoproduccion===''|| id_Aserradero===''|| id_ufmodelo===''|| producido===''|| codigoInicio===''|| codigoFinal===''|| librasBarro===''|| librasAserrin==='')
    { console.log('Uno o varios datos están vacíos');
    return res.status(400).json({ error: 'Uno o varios datos están vacíos' });
  }else{
      const consulta ="INSERT INTO dtp( id_OTP, fecha_real,id_grupoproduccion, id_turno, id_cernidodetalle,id_cernidodetalle2, id_Aserradero, id_Aserradero2, id_ufmodelo, producido, codigoInicio, codigoFinal, librasBarro, librasAserrin, librasAserrin2, observacion) VALUES (?, ?, ?, ?,?, ?, ?, ?,?, ?,?,?,?,?,?,?)";
      const [rows] = await pool.query(consulta, [
        id_OTP,
        fecha_real,
        id_grupoproduccion,
    id_turno,
    id_cernidodetalle,
    id_cernidodetalle2,
    id_Aserradero,
    id_Aserradero2,
    id_ufmodelo,
    producido,
    codigoInicio,
    codigoFinal,
    librasBarro,
    librasAserrin,
    librasAserrin2,
    observacion
      
      ]);
      res.send({ rows });
    }
    }
      
   catch (err) {
    console.log("Error al guardar los datos", err);
    res.status(500).json({ error: "Error al guardar los datos" }); // Enviar un mensaje de error al frontend
  }
};



export const getDTP = async (req, res) => {
  const id= req.params.id;
  try {
    // Consulta SQL para obtener todos los registros de la tabla dtp
    const consulta = `
    SELECT 
    d.id,
    d.producido,
    d.codigoInicio,
    d.codigoFinal,
    d.librasBarro,
    d.librasAserrin,
    d.librasAserrin2,
    COALESCE(d.librasAserrin, 0) + COALESCE(d.librasAserrin2, 0) as pesototal,
    ROUND(d.producido/6) AS formulas,
  d.fecha_creacion,
    d.fecha_real,
    d.hora_creacion,
    otp.id AS id_OTP,
    turno.turno AS nombre_turno,
    grupodetrabajo.grupos AS grupoProd,
    ufmodelo.nombre_modelo AS nombre_ufmodelo,
    aserradero.nombre_aserradero AS aserradero1,
    aserradero2.nombre_aserradero AS aserradero2,
    d.observacion,
    cernidodetalle.detalle AS cernidodetalle,
    cernidodetalle2.detalle AS cernidodetalle2
  FROM 
    dtp d
  LEFT JOIN 
    otp ON d.id_OTP = otp.id
  LEFT JOIN 
    turno ON d.id_turno = turno.id
  LEFT JOIN 
    aserradero ON d.id_Aserradero = aserradero.id
  LEFT JOIN 
    aserradero AS aserradero2 ON d.id_Aserradero2 = aserradero2.id
  LEFT JOIN
    grupodetrabajo on d.id_grupoproduccion=grupodetrabajo.id
  LEFT JOIN 
    ufmodelo ON d.id_ufmodelo = ufmodelo.id_mod
  LEFT JOIN
    cernidodetalle  ON d.id_cernidodetalle=cernidodetalle.id
  LEFT JOIN
    cernidodetalle as cernidodetalle2 ON d.id_cernidodetalle2 = cernidodetalle2.id
   
    where otp.id=?


`;
    const [rows] = await pool.query(consulta,[id]);

    // Enviar los datos obtenidos al cliente
    res.status(200).json({ data: rows });
  } catch (error) {
    // Manejar errores de manera adecuada
    console.error("Error al obtener los datos de la tabla dtp:", error);
    res.status(500).json({ error: "Error al obtener los datos de la tabla dtp" });
  }
};



export const getDTPPS = async (req, res) => {
  const {fecha_creacion_inicio,fecha_creacion_fin , id_ufmodelo,id_grupoproduccion} = req.params;
  console.log('datos del fonrt',id_ufmodelo,id_grupoproduccion,fecha_creacion_inicio,fecha_creacion_fin)
  try {
    let consulta = `
    SELECT 
    d.id,
    d.producido,
    d.codigoInicio,
    d.codigoFinal,
    d.librasBarro,
    d.librasAserrin,
    d.librasAserrin2,
    COALESCE(d.librasAserrin, 0) + COALESCE(d.librasAserrin2, 0) as pesototal,
    ROUND(d.producido/6) AS formulas,
  d.fecha_creacion,
    d.fecha_real,
    d.hora_creacion,
    d.observacion,
    otp.id AS id_OTP,
    turno.turno AS nombre_turno,
    grupodetrabajo.grupos AS grupoProd,
    ufmodelo.nombre_modelo AS nombre_ufmodelo,
    aserradero.nombre_aserradero AS aserradero1,
    aserradero2.nombre_aserradero AS aserradero2,
    
    cernidodetalle.detalle AS cernidodetalle,
    cernidodetalle2.detalle AS cernidodetalle2
  FROM 
    dtp d
  LEFT JOIN 
    otp ON d.id_OTP = otp.id
  LEFT JOIN 
    turno ON d.id_turno = turno.id
  LEFT JOIN 
    aserradero ON d.id_Aserradero = aserradero.id
  LEFT JOIN 
    aserradero AS aserradero2 ON d.id_Aserradero2 = aserradero2.id
  LEFT JOIN
    grupodetrabajo on d.id_grupoproduccion=grupodetrabajo.id
  LEFT JOIN 
    ufmodelo ON d.id_ufmodelo = ufmodelo.id_mod
  LEFT JOIN
    cernidodetalle  ON d.id_cernidodetalle=cernidodetalle.id
  LEFT JOIN
    cernidodetalle as cernidodetalle2 ON d.id_cernidodetalle2 = cernidodetalle2.id
   
        WHERE 1=1`;

    const params = [];
  
    if (fecha_creacion_inicio !== 'null' && fecha_creacion_fin !== 'null') {
      if (fecha_creacion_inicio !== 'null' && fecha_creacion_fin !== 'null') {
          consulta += ' AND (d.fecha_real BETWEEN ? AND ?)';
          params.push(fecha_creacion_inicio, fecha_creacion_fin);
      } else if (fecha_creacion_inicio !== 'null') {
          consulta += ' AND d.fecha_real >= ?';
          params.push(fecha_creacion_inicio);
      } else {
          consulta += ' AND d.fecha_real <= ?';
          params.push(fecha_creacion_fin);
      }
  }

    if ( id_ufmodelo !== 'null') {
      consulta += ' AND (d.id_ufmodelo IS NULL OR d.id_ufmodelo = ?)';
      params.push(id_ufmodelo);
    }

    if ( id_grupoproduccion !== 'null') {
      consulta += ' AND (d.id_grupoproduccion IS NULL OR d.id_grupoproduccion = ?)';
      params.push(id_grupoproduccion);
    }

  
    const [rows] = await pool.query(consulta, params);

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error al obtener los datos de la tabla dthp:", error);
    res.status(500).json({ error: "Error al obtener los datos de la tabla dthp" });
  }
};
