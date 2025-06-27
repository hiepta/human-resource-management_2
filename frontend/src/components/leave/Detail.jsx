import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const Detail = () => {
    const {id} = useParams()
    const [leave, setLeave] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchLeave = async () => {
          try {
            const response = await axios.get(`http://localhost:5000/api/leave/detail/${id}`,{
              headers: {
                "Authorization" : `Bearer ${localStorage.getItem('token')}`
              }
            })
            if(response.data.success){
                setLeave(response.data.leave)
            }
          }catch(error){
            if(error.response && !error.response.data.success){
              alert(error.response.data.error)
            }
          }
        }
        fetchLeave();
      }, [])

      const changeStatus =  async (id, status) => {
        try {
            const response = await axios.put(`http://localhost:5000/api/leave/${id}`, {status},
            {
              headers: {
                "Authorization" : `Bearer ${localStorage.getItem('token')}`
              }
            })
            if(response.data.success){
                navigate('/admin-dashboard/leaves')
            }
          }catch(error){
            if(error.response && !error.response.data.success){
              alert(error.response.data.error)
            }
          }
      }

  return (
    <>{leave ? (
    <div className='max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md'>
        <h2 className='text-2xl font-bold mb-8 text-center text-black'>
            Leave Details
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
                <img src={`http://localhost:5000/${leave.employeeId.userId.profileImage}`} alt="" className='rounded-full border w-72 text-black'/>
            </div>
            <div>
                <div className='flex space-x-3 mb-2'>
                    <p className='text-lg font-bold text-black'>Tên nhân viên: </p>
                    <p className='font-medium text-black'>{leave.employeeId.userId.name} </p>
                </div>

                <div className='flex space-x-3 mb-2'>
                    <p className='text-lg font-bold text-black'>Mã nhân viên: </p>
                    <p className='font-medium text-black'>{leave.employeeId.employeeId} </p>
                </div>

                <div className='flex space-x-3 mb-2'>
                    <p className='text-lg font-bold text-black'>Loại nghỉ phép: </p>
                    <p className='font-medium text-black'>{leave.leaveType} </p>
                </div>

                <div className='flex space-x-3 mb-2'>
                    <p className='text-lg font-bold text-black'>Lí do: </p>
                    <p className='font-medium text-black'>{leave.reason} </p>
                </div>

                <div className='flex space-x-3 mb-2'>
                    <p className='text-lg font-bold text-black'>Phòng ban: </p>
                    <p className='font-medium text-black'>{leave.employeeId.department.dep_name} </p>
                </div>

                <div className='flex space-x-3 mb-2'>
                    <p className='text-lg font-bold text-black'>Từ ngày:</p>
                    <p className='font-medium text-black'>{new Date(leave.startDate).toLocaleDateString()} </p>
                </div>

                <div className='flex space-x-3 mb-2'>
                    <p className='text-lg font-bold text-black'>Đến ngày:</p>
                    <p className='font-medium text-black'>{new Date(leave.endDate).toLocaleDateString()} </p>
                </div>

                <div className='flex space-x-3 mb-2'>
                    <p className='text-lg font-bold text-black'>
                        {leave.status === "Pending" ? "Action:" : "Status:"}
                    </p>
                    {leave.status === "Pending" ? (
                        <div className="flex space-x-2">
                            <button className='px-2 py-0.5 bg-teal-300 hover:bg-teal-400'
                            onClick={() => changeStatus(leave._id, "Approved")}>Xác nhận</button>
                            <button className='px-2 py-0.5 bg-red-300 hover:bg-red-400'
                            onClick={() => changeStatus(leave._id, "Rejected")}>Từ chối</button>
                        </div>
                    ) :
                    <p className='font-medium text-black'>{leave.status} </p>
                    }   
                </div>
            </div>
        </div>
        <div>
        </div>
    </div>
    ): <div>Loading ...</div>}</>
  )
}

export default Detail
