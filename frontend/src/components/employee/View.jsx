import axios from 'axios'
import React, { useEffect, useState } from 'react'

import { useParams, Link } from 'react-router-dom'
import Chatbot from '../chatbot/Chatbot'
const View = () => {
    const {id} = useParams()
    const [employee, setEmployee] = useState(null)

    useEffect(() => {
        const fetchEmployee = async () => {
          try {
            const response = await axios.get(`http://localhost:5000/api/employee/${id}`,{
              headers: {
                "Authorization" : `Bearer ${localStorage.getItem('token')}`
              }
            })
            if(response.data.success){
                setEmployee(response.data.employee)
            }
          }catch(error){
            if(error.response && !error.response.data.success){
              alert(error.response.data.error)
            }
          }
        }
        fetchEmployee();
      }, [])
  return (
    <>{employee ? (
        <>
    <div className='max-w-3xl mx-auto mt-10 bg-white p-8 rounded shadow-md'>
        <h2 className='text-2xl font-bold mb-8 text-center text-black'>
            Hồ sơ nhân viên
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
                <img src={`http://localhost:5000/${employee.userId.profileImage}`} alt="" className='rounded-full border w-72 text-black'/>
            </div>
            <div>
                <div className='flex space-x-3 mb-5'>
                    <p className='text-lg font-bold text-black'>Tên nhân viên: </p>
                    <p className='font-medium text-black'>{employee.userId.name} </p>
                </div>

                <div className='flex space-x-3 mb-5'>
                    <p className='text-lg font-bold text-black'>Mã nhân viên: </p>
                    <p className='font-medium text-black'>{employee.employeeId} </p>
                </div>

                <div className='flex space-x-3 mb-5'>
                    <p className='text-lg font-bold text-black'>Địa chỉ: </p>
                    <p className='font-medium text-black'>{employee.address} </p>
                </div>

                <div className='flex space-x-3 mb-5'>
                    <p className='text-lg font-bold text-black'>Số CMND/CCCD: </p>
                    <p className='font-medium text-black'>{employee.identification} </p>
                </div>

                <div className='flex space-x-3 mb-5'>
                    <p className='text-lg font-bold text-black'>Số điện thoại: </p>
                    <p className='font-medium text-black'>{employee.phoneNumber} </p>
                </div>

                <div className='flex space-x-3 mb-5'>
                    <p className='text-lg font-bold text-black'>Ngày sinh: </p>
                    <p className='font-medium text-black'>{new Date(employee.dob).toLocaleDateString()} </p>
                </div>

                <div className='flex space-x-3 mb-5'>
                    <p className='text-lg font-bold text-black'>Giới tính: </p>
                    <p className='font-medium text-black'>{employee.gender} </p>
                </div>

                <div className='flex space-x-3 mb-5'>
                    <p className='text-lg font-bold text-black'>Phòng ban: </p>
                    <p className='font-medium text-black'>
                        {employee.oldDepartment && employee.department && employee.oldDepartment._id !== employee.department._id
                            ? `${employee.oldDepartment.dep_name} / ${employee.department.dep_name}`
                            : employee.department.dep_name}
                    </p>
                </div>

                <div className='flex space-x-3 mb-5'>
                    <p className='text-lg font-bold text-black'>Tình trạng hôn nhân: </p>
                    <p className='font-medium text-black'>{employee.maritalStatus} </p>
                </div>

                <div className='flex space-x-3 mb-5'>
                    <p className='text-lg font-bold text-black'>Bằng cấp: </p>
                    <p className='font-medium text-black'>{employee.dilopma} </p>
                </div>

                <div className='flex space-x-3 mb-5'>
                    <p className='text-lg font-bold text-black'>Trình độ học vấn: </p>
                    <p className='font-medium text-black'>{employee.education} </p>
                </div>

                <div className='flex space-x-3 mb-5'>
                    <p className='text-lg font-bold text-black'>Chứng chỉ liên quan: </p>
                    <p className='font-medium text-black'>{employee.certificate} </p>
                </div>

                <div className='flex space-x-3 mb-5'>
                    <p className='text-lg font-bold text-black'>Kĩ năng: </p>
                    <p className='font-medium text-black'>{employee.skill} </p>
                </div>
                
            </div>
        </div>
        <div>
        </div>
    </div>
    {/* ): <div>Loading ...</div>}</> */}
    <Chatbot userId={employee.userId._id} />
    </>
    ) : <div>Loading ...</div>}</>
  )
}

export default View
