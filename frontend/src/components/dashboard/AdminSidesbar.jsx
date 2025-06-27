import React from 'react'
import {NavLink} from 'react-router-dom'
import { FaTachometerAlt, FaUsers, FaBuilding, FaCogs,FaMoneyBillWave,FaCalendarAlt } from 'react-icons/fa'
const AdminSidesBar = () => {
  return (
    <div className='bg-gray-800 text-white h-screen fixed left-0 top-0 bottom-0 space-y-2 w-64'>
      <div className='bg-teal-600 h-12 flex items-center justify-center'>
        <h3 className='text-2xl text-center font-pacific'>HR TLU</h3>
      </div>
      <div className='px-4'>
        <NavLink to="/admin-dashboard" className={({isActive}) => `${isActive ? "bg-teal-500 " : " "}flex items-center space-x-4 block py-2.5 px-4 rounded`}end>
            <FaTachometerAlt/>
            <span>Dashboard</span>
        </NavLink>

        <NavLink to="/admin-dashboard/employees" className={({isActive}) => `${isActive ? "bg-teal-500 " : " "}flex items-center space-x-4 block py-2.5 px-4 rounded`}>
            <FaUsers/>
            <span>Nhân viên</span>
        </NavLink>

        <NavLink to="/admin-dashboard/departments" className={({isActive}) => `${isActive ? "bg-teal-500 " : " "}flex items-center space-x-4 block py-2.5 px-4 rounded`}>
            <FaBuilding/>
            <span>Phòng ban</span>
        </NavLink>

        <NavLink to="/admin-dashboard/leaves" className={({isActive}) => `${isActive ? "bg-teal-500 " : " "}flex items-center space-x-4 block py-2.5 px-4 rounded`}>
            <FaCalendarAlt/>
            <span>Nghỉ phép</span>
        </NavLink>

        <NavLink to="/admin-dashboard/salary/add" className={({isActive}) => `${isActive ? "bg-teal-500 " : " "}flex items-center space-x-4 block py-2.5 px-4 rounded`}>
            <FaMoneyBillWave/>
            <span>Lương</span>
        </NavLink>

        <NavLink to="/admin-dashboard" className="flex items-center space-x-4 block py-2.5 px-4 rounded">
            <FaMoneyBillWave/>
            <span>Bảo hiểm và thuế</span>
        </NavLink>

        <NavLink to="/admin-dashboard" className="flex items-center space-x-4 block py-2.5 px-4 rounded">
            <FaMoneyBillWave/>
            <span>Khen thưởng</span>
        </NavLink>

        <NavLink to="/admin-dashboard/setting" className="flex items-center space-x-4 block py-2.5 px-4 rounded">
            <FaCogs/>
            <span>Cài đặt</span>
        </NavLink>
      </div>
    </div>
  )
}

export default AdminSidesBar
