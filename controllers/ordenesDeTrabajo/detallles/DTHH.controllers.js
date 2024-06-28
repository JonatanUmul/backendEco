import { pool } from "../../../src/db.js";



export const postDTHH = async(req, res)=>{
    
    const {
        id_OTHH, id_turno, id_aserradero, id_cernidodetalle, id_cernidodetalle2, id_modelo, id_horno, id_hornero, horneado, mermasCrudas, codigoInicio, codigoFin, librasBarro, librasAserrin, librasAserrin2, id_aserradero2,id_creador, id_est
     } = req.body;
    

    try{
       
            const consulta='INSERT INTO dthh(id_OTHH, id_turno, id_aserradero, id_cernidodetalle, id_cernidodetalle2, id_modelo, id_horno, id_hornero, horneado, mermasCrudas, codigoInicio, codigoFin, librasBarro, librasAserrin, librasAserrin2, id_aserradero2, id_creador, id_est)Values(?, ?,?,?, ?,?, ?,?, ?,?, ?,?, ?,?,?,?,?,?)';
        const [rows]= await pool.query(consulta,[  id_OTHH, id_turno, id_aserradero, id_cernidodetalle, id_cernidodetalle2, id_modelo, id_horno, id_hornero, horneado, mermasCrudas, codigoInicio, codigoFin, librasBarro, librasAserrin, librasAserrin2, id_aserradero2, id_creador, id_est])
        res.send({rows});
        
        
    }catch(err){
        console.log('Error al guardar los datos', err)
    }
}

export const getDTHH = async(req, res)=>{

    const id= req.params.id
    try {
    const consulta = 
    `SELECT 
    d.id,
    'dthh' as tabla,
    d.codigoInicio,
    d.CodigoFin,
    d.horneado,
    d.mermasCrudas,
    d.librasBarro,
    d.librasAserrin,
    d.fecha_creacion,
    othh.id AS id_othh,
    turno.turno AS turno,
    aserradero.nombre_aserradero AS aserradero,
    tipocernido.tipoCernido AS tipocernido,
    ufmodelo.nombre_modelo as ufmodelo,
    enc_maq.nombre_maq as enc_maq,
    operarios.Nombre as operarios
    
FROM 
    dthh d
LEFT JOIN 
    othh ON d.id_OTHH = othh.id
LEFT JOIN 
    turno ON d.id_turno = turno.id
LEFT JOIN 
    aserradero ON d.id_aserradero = aserradero.id
LEFT JOIN 
    tipocernido ON d.id_cernidodetalle= tipocernido.id
LEFT JOIN
	ufmodelo on d.id_modelo= ufmodelo.id_mod
LEFT JOIN
	enc_maq on d.id_horno= enc_maq.id_maq
LEFT JOIN
	operarios on id_hornero = operarios.id
    
    where d.id_OTHH = ?`
    const [rows]= await pool.query(consulta, [id])
    // Enviar los datos obtenidos al cliente
    res.status(200).json({ data: rows });

    } catch (error) {
        console.error("Error al obtener los datos de la tabla dtp:", error);
      res.status(500).json({ error: "Error al obtener los datos de la tabla dtp" });
    }
    
}

export const getSSDTH = async(req, res)=>{

    const {fecha_creacion_inicio,fecha_creacion_fin,modeloUF,turn,horno,id_est}= req.params
    try {
    let consulta = 
    `  SELECT 
    'DTHH' as tabla,
    d.id,
    d.id_modelo,
    d.id_turno,
    d.id_horno as 'numeroHorno',
    d.codigoInicio,
    d.CodigoFin,
    d.horneado,
    d.mermasCrudas,
    d.librasBarro,
    d.librasAserrin,
    d.fecha_creacion,
    d.id_est,
    othh.id AS id_othh,
    turno.turno AS turno,
    aserradero.nombre_aserradero AS aserradero,
    tipocernido.tipoCernido AS tipocernido,
    ufmodelo.nombre_modelo as ufmodelo,
    enc_maq.nombre_maq as enc_maq,
    operarios.Nombre as operarios,
    dtcc.aprobados,
    dtcc.modelo,
    dtcc.id_horno,
    dtcc.turnoHorneado,
    dtcc.fechaHorneado,
    dtcc.altos,
    dtcc.bajos,
    dtcc.rajadosCC,
    dtcc.crudoCC,
    
    ROUND(( (dtcc.aprobados/d.horneado)*100)) AS porcentaje
FROM 
    dthh d
LEFT JOIN 
    othh ON d.id_OTHH = othh.id
LEFT JOIN 
    turno ON d.id_turno = turno.id
LEFT JOIN 
    aserradero ON d.id_aserradero = aserradero.id
LEFT JOIN 
    tipocernido ON d.id_cernidodetalle= tipocernido.id
LEFT JOIN
    ufmodelo on d.id_modelo= ufmodelo.id_mod
LEFT JOIN
    enc_maq on d.id_horno= enc_maq.id_maq
LEFT JOIN
    operarios on id_hornero = operarios.id
LEFT JOIN dtcc ON  dtcc.fechaHorneado = d.fecha_creacion AND dtcc.modelo = d.id_modelo AND dtcc.id_horno = d.id_horno AND dtcc.turnoHorneado = d.id_turno
    WHERE 1= 1`;
    
    const params=[]

 
    if (modeloUF !== 'null') {
        consulta += ' AND (d.id_modelo IS NULL OR d.id_modelo = ?)';
        params.push(modeloUF)}
    
    if (horno !== 'null') {
      consulta += ' AND (d.id_horno IS NULL OR d.id_horno = ?)';
      params.push(horno)}
    
    if (turn !== 'null') {
      consulta += ' AND (d.id_turno IS NULL OR d.id_turno = ?)';
      params.push(turn);
    }

    if (id_est !== 'null') {
        consulta += ' AND ( d.id_est = ?)';
        params.push(id_est);
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
    

    const [rows]= await pool.query(consulta, params)
    // Enviar los datos obtenidos al cliente
    res.status(200).json({ data: rows });

    } catch (error) {
        console.error("Error al obtener los datos de la tabla dtp:", error);
      res.status(500).json({ error: "Error al obtener los datos de la tabla dtp" });
    }
    
}



export const putDTHH = async(req, res)=>{
    const id =req.body.id;
    const id_est=req.body.id_est;
    
    try {
        const consulta =`UPDATE dthh SET id_est = ? WHERE id = ?`

        const [rows]= await pool.query(consulta,[id_est, id])
        res.status(200).json({data:rows})
    } catch (error) {
        console.log(error)
        res.status(500).json({error:'Error al obtene los datoe de la tabla DTHH'})
    }

}
