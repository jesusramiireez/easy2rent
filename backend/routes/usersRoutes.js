import * as usersController from '../controllers/usersController.js';
import express from "express";

const router = express.Router();

// Register user
router.post("/register", usersController.registerUser);

// User login function
router.post("/login", usersController.loginUser);


export default router;
