import express from 'express'
import { login, register } from '../controllers/authController';
import { refreshAccessToken } from '../controllers/refreshTokenController';
import { authMiddleware } from '../middlewares/authMiddleware';


const router: express.Router = express.Router();


router.post('/register', register)
router.post('/login', login)
router.post('/refresh', authMiddleware, refreshAccessToken)

export default router