import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../context/authContext'

const View = () => {
    const [contracts, setContracts] = useState(null)
    const { id } = useParams()
    const { user } = useAuth()

    const fetchContracts = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/contract/employee/${id}/${user.role}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            if(response.data.success){
                setContracts(response.data.contracts)
            }
        } catch (error) {
            if(error.response && !error.response.data.success){
                alert(error.response.data.error)
            }
        }
    }

    useEffect(() => { fetchContracts() }, [])

    if(!contracts){
        return <div>Loading...</div>
    }

    return (
        <div className='overflow-x-auto p-5'>
            <h2 className='text-2xl font-bold text-black text-center mb-4'>Hợp đồng</h2>
            <table className='w-full text-sm text-left text-gray-500'>
                <thead className='text-xs uppercase bg-gray-50 border border-gray-200 text-gray-700'>
                    <tr>
                        <th className='px-6 py-3'>Nhân viên</th>
                        <th className='px-6 py-3'>Ngày ký</th>
                        <th className='px-6 py-3'>Ngày bắt đầu</th>
                        <th className='px-6 py-3'>Ngày kết thúc</th>
                        <th className='px-6 py-3'>Lần ký</th>
                        <th className='px-6 py-3'>Hệ số lương</th>
                        <th className='px-6 py-3'>Thời hạn</th>
                    </tr>
                </thead>
                <tbody>
                    {contracts.map(contract => (
                        <tr key={contract._id} className='bg-white border-b'>
                            <td className='px-6 py-3'>{contract.employeeId?.userId?.name}</td>
                            <td className='px-6 py-3'>{new Date(contract.signDate).toLocaleDateString()}</td>
                            <td className='px-6 py-3'>{new Date(contract.startDate).toLocaleDateString()}</td>
                            <td className='px-6 py-3'>{new Date(contract.endDate).toLocaleDateString()}</td>
                            <td className='px-6 py-3'>{contract.signTimes}</td>
                            <td className='px-6 py-3'>{contract.salaryCoefficient}</td>
                            <td className='px-6 py-3'>{contract.term}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default View