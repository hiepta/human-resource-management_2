import React, { useEffect, useState } from 'react'
import SummaryCard from './SummaryCard'
import axios from 'axios'
import { FaBuilding, FaTimesCircle,FaMoneyBillWave,FaFileAlt,FaCheckCircle,FaHourglassHalf, FaUsers } from 'react-icons/fa'
const AdminSummary = () => {
  const [summary, setSummary] = useState(null)
  useEffect(() => {
    const fetchSummary = async () => {
      try{
        const summary = await axios.get('http://localhost:5000/api/dashboard/summary', {
          headers : {
            "Authorization" : `Bearer ${localStorage.getItem('token')}`
          }
        })
        console.log(summary.data)
        setSummary(summary.data)
      }catch(error){
        if(error.response){
          alert(error.response.data.error)
        }
        console.log(error.message)
      }
    }
    fetchSummary()
  }, [])

  if(!summary){
    return <div>Loading ...</div>
  }

  return (
    <div className='p-6'>
        <h3 className='text-2xl font-bold text-black'>Dashboard Overview</h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 text-black'>
            <SummaryCard icon={<FaUsers/>} text="Nhân viên" number={summary.totalEmployees} color="bg-teal-600"/>
            <SummaryCard icon={<FaBuilding/>} text="Phòng ban" number={summary.totalDepartments} color="bg-yellow-600"/>
            <SummaryCard icon={<FaMoneyBillWave/>} text="Lương" number={summary.totalSalary} color="bg-red-600"/>
        </div>

        <div className='mt-12'>
            <h4 className='text-center text-2xl font-bold text-black'>Lịch nghỉ chi tiết</h4>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mt-6 text-black'>
                <SummaryCard icon={<FaFileAlt/>} text="Xin nghỉ" className="text-black" number={summary.leaveSummary.appliedFor} color="bg-teal-600"/>
                <SummaryCard icon={<FaCheckCircle/>} text="Đã chấp nhận" number={summary.leaveSummary.approved} color="bg-green-600"/>
                <SummaryCard icon={<FaHourglassHalf/>} text="Chờ duyệt" number={summary.leaveSummary.pending} color="bg-yellow-600"/>
                <SummaryCard icon={<FaTimesCircle/>} text="Đã từ chối" number={summary.leaveSummary.rejected} color="bg-red-600"/>
            </div>
        </div>
    </div>

    
  )
}

export default AdminSummary
