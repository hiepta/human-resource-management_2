import express from 'express'
import cors from 'cors'
import authRouter from './routes/auth.js'
import connectToDatabase from './db/db.js'
import departmentRouter from './routes/department.js'
import employeeRouter from './routes/employee.js'
// import salaryRouter from './routes/salary.js'
import leaveRouter from './routes/leave.js'
import contractRouter from './routes/contract.js'
import socialInsuranceRouter from './routes/socialInsurance.js'
import settingRouter from './routes/setting.js'
import dashboardRouter from './routes/dashboard.js'
import attendanceRouter from './routes/attendance.js'
import chatbotRouter from './routes/chatbot.js'
import dotenv from 'dotenv'

dotenv.config();
connectToDatabase()
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('public/uploads'))
app.use('/api/auth', authRouter)
app.use('/api/department', departmentRouter)
app.use('/api/employee', employeeRouter)
app.use('/api/salary', salaryRouter)
app.use('/api/leave', leaveRouter)
app.use('/api/contract', contractRouter)
app.use('/api/social-insurance', socialInsuranceRouter)
app.use('/api/setting', settingRouter)
app.use('/api/dashboard', dashboardRouter)
app.use('/api/attendance', attendanceRouter)
app.use('/api/chatbot', chatbotRouter)
app.listen(process.env.PORT, () => {
    console.log(`Server is Running on port ${process.env.PORT}`)
})