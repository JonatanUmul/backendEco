import { Router } from "express";
import {  getDTP,postDTP, getDTPPS } from "../../../../controllers/ordenesDeTrabajo//detallles/DTP.controllers.js"



const router = Router();


router.post('/DTP', postDTP);

router.get('/DTP/:id', getDTP);
router.get('/DTP/:id_ufmodelo/:id_grupoproduccion ', getDTPPS);


export default router;
