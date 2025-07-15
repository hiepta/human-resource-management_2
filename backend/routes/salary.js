import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getSalary, getAllSalaries } from '../controllers/salaryController.js';
const router = express.Router();

router.get('/all/list', authMiddleware, getAllSalaries);
router.get('/:id/:role', authMiddleware, getSalary);

export default router;