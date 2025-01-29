import express from 'express'
import { getUser } from '../controllers/userController'
import { authMiddleware } from '../middlewares/authMiddleware';

const router: express.Router = express();

router.get('/me', authMiddleware, getUser)



export default router;