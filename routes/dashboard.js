import express from 'express';
import { getDashboardStats } from '../controllers/pageController.js';
import protect from '../middleware/auth.js';

const router = express.Router();
router.get('/stats', protect, getDashboardStats);

export default router;
