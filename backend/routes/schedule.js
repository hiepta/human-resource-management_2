import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { addSchedule, getSchedules, getSchedule, updateSchedule, deleteSchedule, getSchedulesByRole } from '../controllers/scheduleController.js';

const router = express.Router();

router.post('/add', authMiddleware, addSchedule);
router.get('/', authMiddleware, getSchedules);
router.get('/employee/:id/:role', authMiddleware, getSchedulesByRole);
router.get('/:id', authMiddleware, getSchedule);
router.put('/:id', authMiddleware, updateSchedule);
router.delete('/:id', authMiddleware, deleteSchedule);

export default router;