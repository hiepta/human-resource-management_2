import React from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidesBar from '../components/dashboard/AdminSidesBar'
import AdminSummary from '../components/dashboard/AdminSummary'
import Navbar from '../components/dashboard/Navbar'
import { useAuth } from '../context/authContext'
const AdminDashboard = () => {
  const {user} = useAuth()
  
  return (
    <div className='flex'>
      <AdminSidesBar/>
      <div className='flex-1 ml-64 bg-gray-100 h-screen'>
        <Navbar/>
        <Outlet/>
      </div>
    </div>
  )
}

export default AdminDashboard
