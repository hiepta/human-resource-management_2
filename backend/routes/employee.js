import express from 'express'
import { addEmployee, upload, getEmployees, getEmployee, updateEmployee, fetchEmployeesByDepId } from '../controllers/employeeController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', authMiddleware, getEmployees)
router.post('/add', authMiddleware, upload.single('image'), addEmployee)
// Specific routes should be defined before the generic ':id' route
router.get('/department/:id', authMiddleware, fetchEmployeesByDepId)
router.get('/:id', authMiddleware, getEmployee)
router.put('/:id', authMiddleware, updateEmployee)


export default router