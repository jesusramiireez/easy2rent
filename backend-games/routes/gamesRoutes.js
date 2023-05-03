import express from "express";
import * as gamesController from '../controllers/gamesController.js';

const router = express.Router();

router.get('/games', gamesController.showAllGames);
router.get('/games/search/:query', gamesController.searchGamesByName);
router.get('/games/search/price/:minPrice/:maxPrice', gamesController.searchGamesByPrice);
router.get('/games/:idGame',  gamesController.showGameById);
router.post('/games', gamesController.newGame);    
router.put('/games', gamesController.updateGame);
router.delete('/games/:idGame', gamesController.deleteGame);

export default router;



