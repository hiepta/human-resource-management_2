import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchAllEmployees } from '../../utils/EmployeeHelper'

const Edit = () => {
    const [contract, setContract] = useState(null)
    const [employees, setEmployees] = useState(null)
    const navigate = useNavigate()
    const {id} = useParams()

    useEffect(() => {
        const fetchData = async () => {
            const emps = await fetchAllEmployees()
            setEmployees(emps)
            try{
                const response = await axios.get(`http://localhost:5000/api/contract/${id}`,{
                    headers:{"Authorization" : `Bearer ${localStorage.getItem('token')}`}
                })
                if(response.data.success){
                    const c = response.data.contract
                    setContract({
                        employeeId: c.employeeId._id,
                        startDate: c.startDate ? c.startDate.substr(0,10) : '',
                        endDate: c.endDate ? c.endDate.substr(0,10) : '',
                        signDate: c.signDate ? c.signDate.substr(0,10) : '',
                        signTimes: c.signTimes,
                        salaryCoefficient: c.salaryCoefficient,
                        term: c.term
                    })
                }
            }catch(error){
                if(error.response && !error.response.data.success){
                    alert(error.response.data.error)
                }
            }
        }
        fetchData()
    }, [id])

    const handleChange = (e) => {
        const {name, value} = e.target
        setContract(prev => ({...prev, [name]: value}))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
            const response = await axios.put(`http://localhost:5000/api/contract/${id}`, contract, {
                headers:{"Authorization" : `Bearer ${localStorage.getItem('token')}`}
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
        <>{contract && employees ? (
        <div className='max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md'>
            <h2 className='text-2xl font-bold mb-6 text-black'>Sửa hợp đồng</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label className='block text-sm font-medium text-gray-700'>Nhân viên</label>
                    <select name='employeeId' value={contract.employeeId} onChange={handleChange} className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required>
                        <option value=''>Lựa chọn nhân viên</option>
                        {employees.map(emp => (
                            <option key={emp._id} value={emp._id}>{emp.employeeId}</option>
                        ))}
                    </select>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Ngày bắt đầu</label>
                        <input type='date' name='startDate' value={contract.startDate} onChange={handleChange} className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required/>
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Ngày kết thúc</label>
                        <input type='date' name='endDate' value={contract.endDate} onChange={handleChange} className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required/>
                    </div>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Ngày ký</label>
                        <input type='date' name='signDate' value={contract.signDate} onChange={handleChange} className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required/>
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Lần ký</label>
                        <input type='number' name='signTimes' value={contract.signTimes} onChange={handleChange} className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required/>
                    </div>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Hệ số lương</label>
                        <input type='number' name='salaryCoefficient' value={contract.salaryCoefficient} onChange={handleChange} className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required/>
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Thời hạn</label>
                        <input type='text' name='term' value={contract.term} onChange={handleChange} className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required/>
                    </div>
                </div>
                <button type='submit' className='w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded'>
                    Cập nhật hợp đồng
                </button>
            </form>
        </div>
        ) : <div>Loading...</div>}
        </>
    )
}

export default Edit