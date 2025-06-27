import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../../context/authContext'

const List = () => {
  const [leaves, setLeaves] = useState(null)
  let sno = 1;
  const {id} = useParams()
  const {user} = useAuth()
  const fetchLeaves = async () => {
    try{
        const response = await axios.get(`http://localhost:5000/api/leave/${id}/${user.role}`,{
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
        console.log(response.data)
        if(response.data.success){
            setLeaves(response.data.leaves)
        }
    }catch(error){
        if(error.response && !error.response.data.success){
            alert(error.message)
        }
    }
}

useEffect(() => {
    fetchLeaves();
},[])

    if(!leaves){
        return <div>Loadding</div>
    }
  return (
    <div className='p-6'>
      <div className='text-center'>
        <h3 className='text-2xl font-bold text-black'>Quản lí ngày nghỉ</h3>
      </div>
      <div className='flex justify-between items-center'>
        <input type="text" placeholder = 'Seach By Dep Name' className='px-4 py-0.5 border'/>
        {user.role === "employee" && ( 
            <Link to="/employee-dashboard/add-leave" className='px-4 py-1 bg-teal-600 rounded text-white'>Thêm mới ngày nghỉ</Link>
        )}
        </div>

      <table className='w-full text-sm text-left text-gray-500 mt-6'>
                    <thead className='text-xs text-gray-700 uppercase bg-gray-50 border border-gray-200'>
                        <tr>
                            <th className='px-6 py-3'>SNO</th>
                            <th className='px-6 py-3'>Loại nghỉ phép</th>
                            <th className='px-6 py-3'>Từ</th>
                            <th className='px-6 py-3'>Đến</th>
                            <th className='px-6 py-3'>Mô tả</th>
                            <th className='px-6 py-3'>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            leaves.map((leave) => (
                                <tr key={leave._id} className='bg-white border-b dark:bg-gray-700 dark: border-gray-50'>
                                    <td className='px-6 py-3'>{sno++}</td>
                                    <td className='px-6 py-3'>{leave.leaveType}</td>
                                    <td className='px-6 py-3'>{new Date(leave.startDate).toLocaleDateString()}</td>
                                    <td className='px-6 py-3'>{new Date(leave.endDate).toLocaleDateString()}</td>
                                    <td className='px-6 py-3'>{leave.reason}</td>
                                    <td className='px-6 py-3'>{leave.status}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
    </div>
  )
}

export default List
