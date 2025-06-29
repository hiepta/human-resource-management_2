import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchAllEmployees } from '../../utils/EmployeeHelper';

const Edit = () => {
    const { id } = useParams();
    const [record, setRecord] = useState(null);
    const [employees, setEmployees] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const emps = await fetchAllEmployees();
            setEmployees(emps);
            try {
                const response = await axios.get(`http://localhost:5000/api/social-insurance/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                if (response.data.success) {
                    setRecord(response.data.record);
                }
            } catch (error) {
                if (error.response && !error.response.data.success) {
                    alert(error.response.data.error);
                }
            }
        };
        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRecord(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/social-insurance/${id}`, {
                socialInsuranceNumber: record.socialInsuranceNumber,
                startDate: record.startDate,
                status: record.status,
                note: record.note,
                monthlyAmount: record.monthlyAmount
            }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            navigate('/admin-dashboard/social-insurance');
        } catch (error) {
            if (error.response && !error.response.data.success) {
                alert(error.response.data.error);
            }
        }
    };

    return (
        <>{employees && record ? (
            <div className='max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md'>
                <h2 className='text-2xl font-bold mb-6 text-black'>Sửa BHXH</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Nhân viên</label>
                        <select name='employeeId' value={record.employeeId} onChange={handleChange} className='mt-1 p-2 block w-full border border-gray-300 rounded-md' disabled>
                            {employees.map(emp => (
                                <option key={emp._id} value={emp._id}>{emp.employeeId}</option>
                            ))}
                        </select>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700'>Mã số BHXH</label>
                            <input type='text' name='socialInsuranceNumber' value={record.socialInsuranceNumber} onChange={handleChange} className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required />
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700'>Ngày bắt đầu</label>
                            <input type='date' name='startDate' value={record.startDate?.slice(0,10)} onChange={handleChange} className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required />
                        </div>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700'>Trạng thái</label>
                            <select name='status' value={record.status} onChange={handleChange} className='mt-1 p-2 block w-full border border-gray-300 rounded-md'>
                                <option value='active'>Đang tham gia</option>
                                <option value='paused'>Tạm ngưng</option>
                                <option value='stopped'>Đã ngưng</option>
                            </select>
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700'>Tổng tiền đóng hàng tháng</label>
                            <input type='number' name='monthlyAmount' value={record.monthlyAmount} onChange={handleChange} className='mt-1 p-2 block w-full border border-gray-300 rounded-md' readOnly required />
                        </div>
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Ghi chú</label>
                        <textarea name='note' value={record.note} onChange={handleChange} className='mt-1 p-2 block w-full border border-gray-300 rounded-md'></textarea>
                    </div>
                    <button type='submit' className='w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded'>
                        Cập nhật BHXH
                    </button>
                </form>
            </div>
        ) : <div>Loading...</div>}</>
    );
};

export default Edit;