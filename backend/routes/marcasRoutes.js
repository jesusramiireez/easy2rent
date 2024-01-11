import express from "express";
import * as marcasController from '../controllers/marcasController.js';

const router = express.Router();

router.get('/marcas', marcasController.showAllMarcas);
router.get('/marcas/:idMarca', marcasController.showMarcaById);
router.get('/marcas/search/:query', marcasController.searchMarcasByName);
router.post('/marcas', marcasController.newMarca);    
router.put('/marcas', marcasController.updateMarca);
router.delete('/marcas/:idMarca', marcasController.deleteMarca);

export default router;