import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { fetchAllEmployees } from '../../utils/EmployeeHelper'

const calculateTerm = (days) => {
    const months = Math.ceil(days / 30)
    if (months >= 12) {
        const years = Math.floor(months / 12)
        const remainMonths = months % 12
        let result = `${years} năm`
        if (remainMonths) {
            result += ` ${remainMonths} tháng`
        }
        return result
    }
    return `${months} tháng`
}

const Add = () => {
    const [contract, setContract] = useState({
        employeeId: '',
        startDate: '',
        endDate: '',
        signDate: '',
        signTimes: 1,
        salaryCoefficient: '',
        duration: '',
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

    const handleChange = async (e) => {
        const { name, value } = e.target
        if(name === 'employeeId' && value){
            try{
                const resp = await axios.get(`http://localhost:5000/api/contract/next-sign/${value}`, {
                    headers:{
                        "Authorization" : `Bearer ${localStorage.getItem('token')}`
                    }
                })
                if(resp.data.success){
                    setContract(prev => ({...prev, employeeId: value, signTimes: resp.data.signTimes}))
                    return
                }
            }catch(err){
                console.error(err)
            }
        } else if(name === 'employeeId') {
            setContract(prev => ({...prev, employeeId: '', signTimes: 1}))
            return
        }
        setContract(prev => {
            const updatedValue = name === 'salaryCoefficient' ? parseFloat(value) : value
            const updated = { ...prev, [name]: updatedValue }
            if (name === 'startDate' || name === 'endDate') {
                const { startDate, endDate } = { ...updated }
                if (startDate && endDate) {
                    const start = new Date(startDate)
                    const end = new Date(endDate)
                    const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
                    updated.duration = diffDays
                    updated.term = calculateTerm(diffDays)
                }
            }
            return updated
        })
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
                if(Number(contract.signTimes) >= 2){
                    alert('Nhân viên đã trở thành nhân viên chính thức')
                }
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
                        <input type='number' name='signTimes' value={contract.signTimes} readOnly className='mt-1 p-2 block w-full border border-gray-300 rounded-md bg-gray-100 text-black'/>
                    </div>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Hệ số lương</label>
                        <input type='number' step='0.1' name='salaryCoefficient' onChange={handleChange} className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required/>
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Thời gian (ngày)</label>
                        <input type='number' name='duration' value={contract.duration} readOnly className='mt-1 p-2 block w-full border border-gray-300 rounded-md bg-gray-100 text-black'/>
                    </div>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Loại hợp đồng</label>
                        <input type='text' name='term' value={contract.term} readOnly className='mt-1 p-2 block w-full border border-gray-300 rounded-md bg-gray-100 text-black'/>
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