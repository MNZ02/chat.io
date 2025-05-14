import express from 'express'
import { getMessagesByChatId, sendMessage } from '../controllers/messageController'
import { authMiddleware } from '../middlewares/authMiddleware'


const router: express.Router = express.Router()

router.get("/:chatId", authMiddleware, getMessagesByChatId);

// POST /api/messages
router.post("/", authMiddleware, sendMessage);

export default router;