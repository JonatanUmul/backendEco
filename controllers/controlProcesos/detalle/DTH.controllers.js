import { pool } from "../../../src/db.js";



export const postDTH = async (req, res) => {
  const { id_cth, fecha_real,id_turno ,id_modelo,id_modelo2, id_horno,id_creador, tempCabezaIZ, tempCentroIZ,tempPieIZ, tempCabezaDR,tempCentroDR,tempPieDR  } = req.body;
  
  try {
    const consulta = 'INSERT INTO dth (id_cth,fecha_real, id_turno ,id_modelo,id_modelo2, id_horno,id_creador, tempCabezaIZ, tempCentroIZ,tempPieIZ, tempCabezaDR,tempCentroDR,tempPieDR) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?,?, ?,?)';
    const [rows] = await pool.query(consulta, [id_cth,fecha_real, id_turno ,id_modelo,id_modelo2, id_horno,id_creador, tempCabezaIZ, tempCentroIZ,tempPieIZ, tempCabezaDR,tempCentroDR,tempPieDR  ]);
    res.send({ rows });
  } catch (err) {
    console.log('Error al guardar los datos', err);
    res.status(500).send('Error al guardar los datos');
  }
}



export const getDTH= async (req, res)=>{
const id= req.params.id;

try {
  const consulta= `
  SELECT 
    d.id,
    d.fecha_creacion,
    d.fecha_real,
    d.hora_creacion,
    d.tempCabezaIZ,
    d.tempCentroIZ,
    d.tempPieIZ,
    d.tempCabezaDR,
    d.tempCentroDR,
    d.tempPieDR,
    ROUND(((d.tempCabezaIZ +d.tempCentroIZ+d.tempCentroDR+ d.tempPieIZ + d.tempCabezaDR + d.tempPieDR) / 4)) AS promedio,
    cth.id AS id_cth,
    ufmodelo.nombre_modelo AS modelo,
    enc_maq.nombre_maq AS horno,
    IF(
      TIME(d.hora_creacion) >= '04:00:00' AND TIME(d.hora_creacion) <= '17:00:00',
      'Día',
      'Noche'
  ) AS turnos1,
  turno.turno AS turnos
FROM 
    dth d
LEFT JOIN 
    cth ON d.id_cth = cth.id
LEFT JOIN 
    ufmodelo ON d.id_modelo = ufmodelo.id_mod
LEFT JOIN 
    enc_maq ON d.id_horno = enc_maq.id_maq
LEFT JOIN 
    turno ON d.id_turno = turno.id


where d.id_cth=?
`

  const [rows]= await pool.query(consulta, [id])
  res.status(200).json({ data: rows });

    } catch (error) {
        console.error("Error al obtener los datos de la tabla dtp:", error);
      res.status(500).json({ error: "Error al obtener los datos de la tabla dtp" });
    }
    
}

export const getSDTH= async (req, res)=>{
  const {modeloUF, turn, horno, fecha_creacion_inicio, fecha_creacion_fin}= req.params;

  try {
    const consulta= `
   
 select 
 'dth' as tabla,
 d.id,
 d.fecha_real,
 d.fecha_creacion,
 d.hora_creacion,
 IF(
   TIME(d.hora_creacion) >= '04:00:00' AND TIME(d.hora_creacion) <= '17:00:00',
   'Día',
   'Noche'
) AS turnos1,
turno.turno AS turnos,
 d.tempCabezaIZ,
 d.tempCentroIZ,
 d.tempPieIZ,
 d.tempCabezaDR,
 d.tempCentroDR,
 d.tempPieDR,
 ROUND(((d.tempCabezaIZ + d.tempCabezaIZ + d.tempCentroIZ + d.tempPieIZ + d.tempCabezaDR + tempCentroDR + d.tempPieDR) / 6), 0) AS promedio,
 cth.id as id_cth,
 ufmodelo.nombre_modelo as modelo,
 enc_maq.nombre_maq as horno 

 
 from dth d
 
 left join cth on d.id_cth= cth.id
 left join ufmodelo on d.id_modelo= ufmodelo.id_mod
 left join enc_maq on d.id_horno= enc_maq.id_maq
 left join turno on d.id_turno= turno.id

    WHERE 1 = 1`;

    const params = [];

    
  if (modeloUF !== 'null') {
    consulta += ' AND (d.id_modelo IS NULL OR d.id_modelo = ?)';
    params.push(modeloUF);
}
if (turn !== 'null') {
  consulta += ' AND (d.id_turno IS NULL OR d.id_turno = ?)';
  params.push(turn);
}
if (horno !== 'null') {
  consulta += ' AND (d.id_horno IS NULL OR d.id_horno = ?)';
  params.push(horno);
}
 if (fecha_creacion_inicio !== 'null' && fecha_creacion_fin !== 'null') {
      consulta += ' AND (d.fecha_creacion BETWEEN ? AND ?)';
      params.push(fecha_creacion_inicio, fecha_creacion_fin);
    } else if (fecha_creacion_inicio !== 'null') {
      consulta += ' AND d.fecha_creacion >= ?';
      params.push(fecha_creacion_inicio);
    } else if (fecha_creacion_fin !== 'null') {
      consulta += ' AND d.fecha_creacion <= ?';
      params.push(fecha_creacion_fin);
    }


    const [rows]= await pool.query(consulta, [id])
    res.status(200).json({ data: rows });
  
      } catch (error) {
          console.error("Error al obtener los datos de la tabla dtp:", error);
        res.status(500).json({ error: "Error al obtener los datos de la tabla dtp" });
      }
      
  }