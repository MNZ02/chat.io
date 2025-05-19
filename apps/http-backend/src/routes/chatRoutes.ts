import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import {
    listChats,
    getChats,
    getOrCreateDirectChat,
    createChat
} from '../controllers/chatController';

const router: express.Router = express.Router();


router.get('/chats', authMiddleware, listChats);


router.get('/chats/:chatId', authMiddleware, getChats);

router.get(
    '/chats/direct/:otherUserId',
    authMiddleware,
    getOrCreateDirectChat
);

router.post('/chats', authMiddleware, createChat);

export default router;
