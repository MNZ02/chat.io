import express from 'express'
import { getUser, getAllUsers } from '../controllers/userController'
import { authMiddleware } from '../middlewares/authMiddleware';

const router: express.Router = express();

router.get('/me', authMiddleware, getUser)
router.get('/users', getAllUsers)



export default router;