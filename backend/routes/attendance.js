import express from 'express';
import { checkIn, checkOut, getAttendances, getTodayAttendance, getRewardDiscipline, getEmployeeRewardDiscipline } from '../controllers/attendanceController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/checkin', authMiddleware, checkIn);
router.put('/checkout/:id', authMiddleware, checkOut);
router.get('/', authMiddleware, getAttendances);
router.get('/today/:userId', authMiddleware, getTodayAttendance);
router.get('/reward-discipline', authMiddleware, getRewardDiscipline);
router.get('/reward-discipline/:id/:role', authMiddleware, getEmployeeRewardDiscipline);

export default router;