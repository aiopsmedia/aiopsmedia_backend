import express from 'express';
import { loginAdmin, getAdminProfile, seedAdmin } from '../controllers/authController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.get('/profile', protect, getAdminProfile);
router.get('/seed', seedAdmin);

export default router;
