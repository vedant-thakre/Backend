import express from 'express';
import { registerUser } from '../controllers/userController.js';

const router = express.Router();

// router.route("/register").post(registerUser);

router.get("/register", registerUser);


export default router;