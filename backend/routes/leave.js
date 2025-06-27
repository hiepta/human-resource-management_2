import express from 'express'
import { addLeave, getLeave, getLeaves, getLeaveDetail, updateLeave } from '../controllers/leaveController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/add', authMiddleware, addLeave)
router.get('/detail/:id', authMiddleware, getLeaveDetail)
router.get('/:id/:role', authMiddleware, getLeave)
router.get('/', authMiddleware, getLeaves)
router.put('/:id', authMiddleware, updateLeave)

export default router