import express from 'express'
import { getDaysOffLeft } from '../controllers/chatbotController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/days-off-left/:id', authMiddleware, getDaysOffLeft)

export default router