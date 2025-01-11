import express from 'express';
import { addMessage, getMessages } from '../controllers/messages.controller.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // User memoryStorage 

router.post('/addmsg', upload.single('file'), addMessage); // 'file' 
router.get('/getmsg/:chatId', getMessages);

export default router;