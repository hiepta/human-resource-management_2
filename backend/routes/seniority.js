import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { getSeniorityInfo } from '../controllers/seniorityController.js'

const router = express.Router()

router.get('/:id/:role', authMiddleware, getSeniorityInfo)


export default router