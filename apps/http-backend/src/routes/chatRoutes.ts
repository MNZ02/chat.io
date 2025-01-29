import express from 'express'
import { authMiddleware } from '../middlewares/authMiddleware'
import { getChatByUserId, createChat } from '../controllers/chatController'


const router: express.Router = express.Router()


router.get('/chats', authMiddleware, getChatByUserId)
router.post(
    '/chat', authMiddleware, createChat
)


export default router