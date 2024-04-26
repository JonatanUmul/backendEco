import { pool } from "../../../src/db.js";

export const postDTFM = async (req, res) => {

    const { id_OTFM, id_Aserradero, id_cernidodetalle, id_cernidodetalle2, id_Aserradero2, cantidad, peso, peso2, humedad , humedad2, id_creador, id_matPrim} = req.body;
    console.log(id_OTFM)
    try {
        if (id_OTFM === '' || id_Aserradero === '' || cantidad === '' || peso === '' || humedad === '') {
            console.log('Uno o varios datos están vacíos');
        } else {
            const consulta = 'INSERT INTO dtfm(id_OTFM, id_Aserradero, id_cernidodetalle, id_cernidodetalle2, id_Aserradero2, cantidad, peso, peso2, humedad , humedad2, id_creador, id_matPrim) VALUES (?, ?, ?, ?, ?, ?, ?,?, ?, ?,?,?)';
            const [rows] = await pool.query(consulta, [id_OTFM, id_Aserradero, id_cernidodetalle, id_cernidodetalle2, id_Aserradero2, cantidad, peso, peso2, humedad , humedad2, id_creador, id_matPrim]);
            res.send({ rows });
        }
    } catch (err) {
        console.log('Error al guardar los datos', err);
    }
};



export const getDTFM = async (req, res) => {
    const id= req.params.id;
   
    try {
      // Consulta SQL para obtener todos los registros de la tabla dtp
      const consulta = `
      SELECT 
      d.id,
      d.cantidad,
      d.peso, 
       d.peso2,  
      d.humedad,
      d.humedad2,
      d.fecha_creacion,
      d.hora_creacion,
      otfm.id AS id_otfm,
      enc_matprima.nom_matPrima AS descripcion_matprima,
      aserradero.nombre_aserradero AS aserradero,
      cernidodetalle.detalle AS detallecernido1,
      aserradero2.nombre_aserradero AS aserradero2,
      cernidodetalle2.detalle AS detallecernido2
  FROM 
      dtfm d
  LEFT JOIN
      otfm ON d.id_OTFM = otfm.id
  LEFT JOIN
      enc_matprima ON d.id_matPrim = enc_matprima.id_enc
  LEFT JOIN
      aserradero ON d.id_Aserradero = aserradero.id
  LEFT JOIN
      cernidodetalle AS cernidodetalle ON d.id_cernidodetalle = cernidodetalle.id
  LEFT JOIN
      aserradero AS aserradero2 ON d.id_Aserradero2 = aserradero2.id  -- Corrige este JOIN
  LEFT JOIN
      cernidodetalle AS cernidodetalle2 ON d.id_cernidodetalle2 = cernidodetalle2.id
  
where otfm.id=?
  `;
      const [rows] = await pool.query(consulta, [id]);
  
      // Enviar los datos obtenidos al cliente
      res.status(200).json({ data: rows });
    } catch (error) {
      // Manejar errores de manera adecuada
      console.error("Error al obtener los datos de la tabla dtp:", error);
      res.status(500).json({ error: "Error al obtener los datos de la tabla dtp" });
    }
  };


  
export const getDTFMM = async (req, res) => {
    const { id_asrdSMP, fecha_creacion_inicio,fecha_creacion_fin } = req.params; // Obtener los parámetros de la URL
  
    try {
        let consulta = `
        SELECT 
        d.id,
        d.cantidad,
        d.peso, 
         d.peso2,  
         COALESCE(d.peso, 0) + COALESCE(d.peso2, 0) as pesototal,
        d.humedad,
        d.humedad2,
        d.fecha_creacion,
        d.hora_creacion,
        otfm.id AS id_otfm,
        enc_matprima.nom_matPrima AS descripcion_matprima,
        aserradero.nombre_aserradero AS aserradero,
        cernidodetalle.detalle AS detallecernido1,
        aserradero2.nombre_aserradero AS aserradero2,
        cernidodetalle2.detalle AS detallecernido2
    FROM 
        dtfm d
    LEFT JOIN
        otfm ON d.id_OTFM = otfm.id
    LEFT JOIN
        enc_matprima ON d.id_matPrim = enc_matprima.id_enc
    LEFT JOIN
        aserradero ON d.id_Aserradero = aserradero.id
    LEFT JOIN
        cernidodetalle AS cernidodetalle ON d.id_cernidodetalle = cernidodetalle.id
    LEFT JOIN
        aserradero AS aserradero2 ON d.id_Aserradero2 = aserradero2.id  -- Corrige este JOIN
    LEFT JOIN
        cernidodetalle AS cernidodetalle2 ON d.id_cernidodetalle2 = cernidodetalle2.id
    
    WHERE 1=1`;
  
        const params = [];
  
    
        if (id_asrdSMP !== 'null') {
            consulta += ' AND (d.id_Aserradero = ? OR d.id_Aserradero2 = ?)';
            params.push(id_asrdSMP, id_asrdSMP);
        }
        
        // Elimina el bloque 'else' para que no haya condiciones de filtro adicionales cuando no se selecciona nada
        
        
  
       
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
  

  
  
  
  