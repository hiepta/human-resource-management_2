import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
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
                        duration: c.duration,
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
        const { name, value } = e.target
        if(name === 'employeeId' && value){
            const selected = employees.find(emp => emp._id === value)
            let coef = contract.salaryCoefficient
            if(selected){
                if(selected.degree === 'master'){
                    coef = (Math.random() * (6.78 - 4.4) + 4.4).toFixed(2)
                }else if(selected.degree === 'doctor'){
                    coef = (Math.random() * (8.0 - 6.2) + 6.2).toFixed(2)
                }
            }
            setContract(prev => ({...prev, employeeId: value, salaryCoefficient: parseFloat(coef)}))
            return
        }else if(name === 'employeeId'){
            setContract(prev => ({...prev, employeeId: '', salaryCoefficient: ''}))
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
                        <input type='number' name='signTimes' value={contract.signTimes} readOnly className='mt-1 p-2 block w-full border border-gray-300 rounded-md bg-gray-100 text-black'/>    
                    </div>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Hệ số lương</label>
                        <input type='number' step='0.1' name='salaryCoefficient' value={contract.salaryCoefficient} onChange={handleChange} readOnly className='mt-1 p-2 block w-full border border-gray-300 rounded-md bg-gray-100 text-black' required/>                    </div>

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
                    Cập nhật hợp đồng
                </button>
            </form>
        </div>
        ) : <div>Loading...</div>}
        </>
    )
}

export default Edit