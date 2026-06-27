import express from 'express';
import { getMessages, createMessage, markAsRead, deleteMessage } from '../controllers/contactController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, getMessages)
  .post(createMessage);

router.put('/:id/read', protect, markAsRead);
router.delete('/:id', protect, deleteMessage);

export default router;
