import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/authContext'
const View = () => {
    const [salaries, setSalaries] = useState(null);
    const [filteredSalaries, setFilteredSalaries] = useState(null)
    const { id } = useParams()
    let sno = 1;
    const {user} = useAuth()
    const fetchSalaries = async () => {
        try{
            const response = await axios.get(`http://localhost:5000/api/salary/${id}/${user.role}`,{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            console.log(response.data)
            if(response.data.success){
                setSalaries(response.data.salary)
                setFilteredSalaries(response.data.salary);
            }
        }catch(error){
            if(error.response && !error.response.data.success){
                alert(error.message)
            }
        }
    }

    useEffect(() => {
        fetchSalaries();
    },[])

    const filterSalaries = (q) => {
        const filteredRecords = salaries.filter((leave) => 
        leave.employeeId.toLocaleLowerCase().includes(q.toLocaleLowerCase())
        );
        setFilteredSalaries(filteredRecords)
    }

  return (
    <>{filteredSalaries === null ? (<div>Loading...</div>):(
        <div className='overflow-x-auto p-5'>
            <div className='text-center'>
                <h2 className='text-2xl font-bold text-black' >Lịch sử nhận lương</h2>
            </div>
            <div className='flex justify-end my-3'>
                <input type="text" placeholder='Search By Emp ID' className='border px-2 rounded-md py-0.5 border-gray-300'
                onChange={filterSalaries}/>
            </div>
            {filteredSalaries.length > 0 ?(
                <table className='w-full text-sm text-left text-gray-500'>
                    <thead className='text-us text-gray-700 uppercase bg-gray-50 border border-gray-200'>
                        <tr>
                            <th className='px-6 py-3'>STT</th>
                            <th className='px-6 py-3'>Mã nhân viên</th>
                            <th className='px-6 py-3'>Lương</th>
                            <th className='px-6 py-3'>Trợ cấp</th>
                            <th className='px-6 py-3'>Khấu trừ</th>
                            <th className='px-6 py-3'>Tổng</th>
                            <th className='px-6 py-3'>Ngày trả</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            filteredSalaries.map((salary) => (
                                <tr key={salary.id} classname='bg-white border-b dark:bg-gray-800 dark: border-gray-700'>
                                    <td className='px-6 py-3'>{sno++}</td>
                                    <td className='px-6 py-3'>{salary.employeeId.employeeId}</td>
                                    <td className='px-6 py-3'>{salary.basicSalary}</td>
                                    <td className='px-6 py-3'>{salary.allowances}</td>
                                    <td className='px-6 py-3'>{salary.deductions}</td>
                                    <td className='px-6 py-3'>{salary.netSalary}</td>
                                    <td className='px-6 py-3'>{new Date(salary.payDate).toLocaleDateString()}</td>

                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            ): <div className='text-black'>No Records</div>}
        </div>
        )}
    </> 
  )
}

export default View
