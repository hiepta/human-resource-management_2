import express from 'express'
import { getDaysOffLeft, getSocialInsuranceAmount, getContractDate, requestLeaveToday, getRetirement } from '../controllers/chatbotController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/days-off-left/:id', authMiddleware, getDaysOffLeft)
router.get('/social-insurance/:id', authMiddleware, getSocialInsuranceAmount)
router.get('/contract-date/:id', authMiddleware, getContractDate)
router.post('/request-leave-today', authMiddleware, requestLeaveToday)
router.get('/retirement/:id', authMiddleware, getRetirement)

export default router