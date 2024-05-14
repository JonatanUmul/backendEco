import { Router } from "express";
import {  postDTCC, getDTCC, getsDTCCC } from "../../../../controllers/ordenesDeTrabajo/detallles/DTCC.controllers.js";



const router = Router();


router.post('/DTCC', postDTCC);
router.get('/DTCC/:id', getDTCC);
router.get('/DTCC/:fecha_creacion_inicio/:fecha_creacion_fin/:turnoHorno/:horno/:modelo', getsDTCCC);
export default router;
