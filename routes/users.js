import { signIn, signUp } from '../controllers/users.js'
import express from "express";
const router = express.Router();
router.post('/signin', signIn)
router.post('/signup', signUp)

export default router;