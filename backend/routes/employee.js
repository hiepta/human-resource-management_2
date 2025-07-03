import express from 'express'
import { addEmployee, upload, getEmployees, getEmployee, updateEmployee, fetchEmployeesByDepId, deleteEmployee } from '../controllers/employeeController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', authMiddleware, getEmployees)
router.post('/add', authMiddleware, upload.single('image'), addEmployee)
router.get('/department/:id', authMiddleware, fetchEmployeesByDepId)
router.get('/:id', authMiddleware, getEmployee)
router.put('/:id', authMiddleware, updateEmployee)
router.delete('/:id', authMiddleware, deleteEmployee)


export default router