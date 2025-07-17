import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { addContract, getContracts, getContract, updateContract, deleteContract, getContractsByRole, getNextSignTimes } from '../controllers/contractController.js'

const router = express.Router()

router.get('/', authMiddleware, getContracts)
router.post('/add', authMiddleware, addContract)
router.get('/next-sign/:employeeId', authMiddleware, getNextSignTimes)
router.get('/employee/:id/:role', authMiddleware, getContractsByRole)

router.get('/:id', authMiddleware, getContract)
router.put('/:id', authMiddleware, updateContract)
router.delete('/:id', authMiddleware, deleteContract)

export default router