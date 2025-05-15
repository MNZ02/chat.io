import express from 'express'
import { getUser, getAllUsers } from '../controllers/userController'
import { authMiddleware } from '../middlewares/authMiddleware';

const router: express.Router = express.Router();

router.get('/me', authMiddleware, getUser)
router.get('/all/users', getAllUsers)


export default router;