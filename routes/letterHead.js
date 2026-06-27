import express from 'express';
import { getLetterHeads, getLetterHeadById, createLetterHead, updateLetterHead, deleteLetterHead } from '../controllers/letterHeadController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, getLetterHeads)
  .post(protect, createLetterHead);

router.route('/:id')
  .get(protect, getLetterHeadById)
  .put(protect, updateLetterHead)
  .delete(protect, deleteLetterHead);

export default router;
