import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import Login from "./pages/Login";
import AdminDashboard from './pages/AdminDashboard'
import EmployeeDashboard from './pages/EmployeeDashboard'
import PrivateRoutes from './utils/PrivateRoutes'
import RoleBaseRoutes from './utils/RoleBaseRoutes'
import AdminSummary from './components/dashboard/AdminSummary'
import DepartmentList from './components/department/DepartmentList'
import AddDepartment from './components/department/AddDepartment'
import EditDepartment from './components/department/EditDepartment'
import List from './components/employee/List'
import Add from './components/employee/Add'
import View from './components/employee/View'
import Edit from './components/employee/Edit'
// import CalculateSalary from "./components/salary/Calculate"
import CalculateSalary from './components/salary/Calculate'
import Summary from "./components/EmployeeDashboard/Summary"
import LeaveList from './components/leave/List'
import AddLeave from './components/leave/Add'
import Setting from './components/EmployeeDashboard/Setting'
import Table from './components/leave/Table'
import Detail from './components/leave/Detail'
import ContractList from './components/contract/List'
import AddContract from './components/contract/Add'
import EditContract from './components/contract/Edit'
import ContractView from './components/contract/View'
import SocialInsuranceList from './components/socialInsurance/List'
import SocialInsuranceAdd from './components/socialInsurance/Add'
import SocialInsuranceEdit from './components/socialInsurance/Edit'
import AttendanceList from './components/attendance/List'
import AttendancePage from './components/EmployeeDashboard/Attendance'
import EmployeeInsuranceList from './components/socialInsurance/EmployeeList'
import RewardList from './components/reward/List'
import EmployeeReward from './components/reward/Employee'
import Seniority from './components/seniority/Seniority'
import SalaryList from './components/salary/List'
import ScheduleList from './components/schedule/List'
import AddSchedule from './components/schedule/Add'
import EmployeeSchedule from './components/EmployeeDashboard/Schedule'
function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to="/admin-dashboard"/>}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/admin-dashboard' element={
        <PrivateRoutes>
          <RoleBaseRoutes requiredRole={["admin"]}>
            <AdminDashboard />
          </RoleBaseRoutes>
        </PrivateRoutes>
        }>

          <Route index element={<AdminSummary />}></Route>

          <Route path="/admin-dashboard/departments" element={<DepartmentList/>}></Route>
          <Route path="/admin-dashboard/add-department" element={<AddDepartment/>}></Route>
          <Route path="/admin-dashboard/department/:id" element={<EditDepartment/>}></Route>

          <Route path="/admin-dashboard/employees" element={<List/>}></Route>
          <Route path="/admin-dashboard/add-employee" element={<Add/>}></Route>
          <Route path="/admin-dashboard/employees/:id" element={<View/>}></Route>
          <Route path="/admin-dashboard/employees/edit/:id" element={<Edit/>}></Route>
          {/* <Route path="/admin-dashboard/salary/calculate/:id" element={<CalculateSalary/>}></Route> */}
          <Route path="/admin-dashboard/salary/:id" element={<CalculateSalary/>}></Route>
          <Route path="/admin-dashboard/salaries" element={<SalaryList/>}></Route>
          <Route path="/admin-dashboard/contracts" element={<ContractList/>}></Route>
          <Route path="/admin-dashboard/contracts/add" element={<AddContract/>}></Route>
          <Route path="/admin-dashboard/contracts/edit/:id" element={<EditContract/>}></Route>
          <Route path="/admin-dashboard/social-insurance" element={<SocialInsuranceList/>}></Route>
          <Route path="/admin-dashboard/social-insurance/add" element={<SocialInsuranceAdd/>}></Route>
          <Route path="/admin-dashboard/social-insurance/edit/:id" element={<SocialInsuranceEdit/>}></Route>
          <Route path='/admin-dashboard/leaves' element={<Table/>}></Route>
          <Route path='/admin-dashboard/leaves/:id' element={<Detail/>}></Route>
          <Route path='/admin-dashboard/employees/leaves/:id' element={<LeaveList/>}></Route>
          <Route path='/admin-dashboard/attendance' element={<AttendanceList/>}></Route>
          <Route path='/admin-dashboard/reward-discipline' element={<RewardList/>}></Route>
          <Route path='/admin-dashboard/setting' element={<Setting/>}></Route>
          <Route path="/admin-dashboard/seniority/:id" element={<Seniority/>}></Route>
          <Route path="/admin-dashboard/schedules" element={<ScheduleList/>}></Route>
          <Route path="/admin-dashboard/schedules/add" element={<AddSchedule/>}></Route>
        </Route>
        <Route path='/employee-dashboard' element={
          <PrivateRoutes>
            <RoleBaseRoutes requiredRole={["admin","employee"]}>
            <EmployeeDashboard />
            </RoleBaseRoutes>
          </PrivateRoutes>
          }>
          <Route index element={<Summary />}></Route>
          <Route path='/employee-dashboard/profile/:id' element={<View/>}></Route>
          <Route path='/employee-dashboard/leaves/:id' element={<LeaveList/>}></Route>
          <Route path='/employee-dashboard/add-leave' element={<AddLeave/>}></Route>
          {/* <Route path='/employee-dashboard/salary/calculate/:id' element={<CalculateSalary/>}></Route> */}
          <Route path='/employee-dashboard/salary/:id' element={<CalculateSalary/>}></Route>
          <Route path='/employee-dashboard/social-insurance/:id' element={<EmployeeInsuranceList/>}></Route>
          <Route path='/employee-dashboard/attendance' element={<AttendancePage/>}></Route>
          <Route path='/employee-dashboard/contracts/:id' element={<ContractView/>}></Route>
          <Route path='/employee-dashboard/reward-discipline/:id' element={<EmployeeReward/>}></Route>
          <Route path='/employee-dashboard/setting' element={<Setting/>}></Route>
          <Route path='/employee-dashboard/seniority/:id' element={<Seniority/>}></Route>
          <Route path='/employee-dashboard/schedule' element={<EmployeeSchedule/>}></Route>
          </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
