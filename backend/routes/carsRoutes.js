import express from "express";
import * as carsController from '../controllers/carsController.js';

const router = express.Router();

router.get('/cars', carsController.showAllCars);
router.get('/cars/search/:query', carsController.searchCarsByName);
router.get('/cars/search/price/:minPrice/:maxPrice', carsController.searchCarsByPrice);
router.get('/cars/:idCar',  carsController.showCarById);
router.post('/cars', carsController.newCar);    
router.put('/cars', carsController.updateCar);
router.delete('/cars/:idCar', carsController.deleteCar);

export default router;



