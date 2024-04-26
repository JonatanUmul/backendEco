import { Router } from "express";
import {  PostOperarios, getOperarios, getOperarioss } from '../../../../controllers/mantenimientos/operarios/OperariosAreas.controller.js';


const router = Router();

router.get('/Operarios/:id_area/:id_area2', getOperarios );
router.get('/Operarios/:id_area', getOperarioss );
router.post('/Operarios', PostOperarios );


export default router;
