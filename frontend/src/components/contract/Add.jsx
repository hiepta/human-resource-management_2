import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { fetchAllEmployees } from '../../utils/EmployeeHelper'

const Add = () => {
    const [contract, setContract] = useState({
        employeeId: '',
        startDate: '',
        endDate: '',
        signDate: '',
        signTimes: '',
        salaryCoefficient: '',
        term: ''
    })
    const [employees, setEmployees] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchEmployees = async () => {
            const emps = await fetchAllEmployees()
            setEmployees(emps)
        }
        fetchEmployees()
    }, [])

    const handleChange = (e) => {
        const {name, value} = e.target
        setContract(prev => ({...prev, [name]: value}))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
            const response = await axios.post('http://localhost:5000/api/contract/add', contract, {
                headers:{
                    "Authorization" : `Bearer ${localStorage.getItem('token')}`
                }
            })
            if(response.data.success){
                navigate('/admin-dashboard/contracts')
            }
        }catch(error){
            if(error.response && !error.response.data.success){
                alert(error.response.data.error)
            }
        }
    }

    return (
        <>{employees ? (
        <div className='max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md'>
            <h2 className='text-2xl font-bold mb-6 text-black'>Thêm hợp đồng</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label className='block text-sm font-medium text-gray-700'>Nhân viên</label>
                    <select name='employeeId' onChange={handleChange} className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required>
                        <option value=''>Lựa chọn nhân viên</option>
                        {employees && employees.map(emp => (
                            <option key={emp._id} value={emp._id}>{emp.employeeId}</option>
                        ))}
                    </select>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Ngày bắt đầu</label>
                        <input type='date' name='startDate' onChange={handleChange} className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required/>
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Ngày kết thúc</label>
                        <input type='date' name='endDate' onChange={handleChange} className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required/>
                    </div>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Ngày ký</label>
                        <input type='date' name='signDate' onChange={handleChange} className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required/>
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Lần ký</label>
                        <input type='number' name='signTimes' onChange={handleChange} className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required/>
                    </div>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Hệ số lương</label>
                        <input type='number' name='salaryCoefficient' onChange={handleChange} className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required/>
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Thời hạn</label>
                        <input type='text' name='term' onChange={handleChange} className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required/>
                    </div>
                </div>
                <button type='submit' className='w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded'>
                    Thêm hợp đồng
                </button>
            </form>
        </div>
        ) : <div>Loading...</div>}
        </>
    )
}

export default Add