import { Router } from "express";
import {  postDTHH, getDTHH, getSSDTH } from "../../../../controllers/ordenesDeTrabajo/detallles/DTHH.controllers.js";



const router = Router();

router.post('/DTHH', postDTHH);
router.get('/DTHH/:id', getDTHH);
router.get('/DTHH/:fecha_creacion_inicio/:fecha_creacion_fin/:modeloUF/:turn/:horno', getSSDTH);

export default router;
