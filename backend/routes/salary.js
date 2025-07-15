import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { calculateSalary } from '../controllers/salaryController.js';

const router = express.Router();

router.get('/:id/:role', authMiddleware, calculateSalary);

export default router;