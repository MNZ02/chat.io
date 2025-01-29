import express from 'express'
import { authMiddleware } from '../middlewares/authMiddleware'
import { getChatByUserId } from '../controllers/chatController'


const router: express.Router = express.Router()


router.get('/chats', authMiddleware, getChatByUserId)


export default router