import express from 'express'
import { calculateSalary } from '../controllers/salaryController.js'
import authMiddleware from '../middleware/authMiddleware.js'
const router = express.Router()

// router.post('/add', authMiddleware, addSalary)
// router.get('/:id/:role', authMiddleware, getSalary)
router.get('/calculate/:employeeId', authMiddleware, calculateSalary)


export default router