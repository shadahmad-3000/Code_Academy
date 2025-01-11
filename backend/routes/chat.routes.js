import express from 'express';
import { createChat, findChat} from '../controllers/chat.controller.js';
const router = express.Router();

router.post('/', createChat);
router.get('/:userId', findChat);

export default router;
