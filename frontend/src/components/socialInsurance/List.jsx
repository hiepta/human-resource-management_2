import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const List = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/social-insurance', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                if (response.data.success) {
                    setRecords(response.data.records);
                }
            } catch (error) {
                if (error.response && !error.response.data.success) {
                    alert(error.response.data.error || 'Đã xảy ra lỗi khi lấy dữ liệu BHXH');
                }
            }
        };
        fetchData();
    }, []);


    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa?')) {
            try {
                await axios.delete(`http://localhost:5000/api/social-insurance/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setRecords(prev => prev.filter(r => r._id !== id));
            } catch (error) {
                alert('Xóa thất bại.');
            }
        }
    };

    return (
        <>
            {records ? (
                <div className='overflow-x-auto p-5'>
                    <h2 className='text-2xl font-bold text-black text-center mb-4'>Danh sách BHXH</h2>
                    <Link to='/admin-dashboard/social-insurance/add' className='bg-green-500 text-white px-3 py-1 rounded hover:bg-green-300'>+ Thêm BHXH</Link>
                    <table className='w-full text-sm text-left text-gray-500'>
                        <thead className='text-xs uppercase bg-gray-50 border border-gray-200 text-gray-700'>
                            <tr>
                                <th className='px-6 py-3'>Mã NV</th>
                                <th className='px-6 py-3'>Mã số BHXH</th>
                                <th className='px-6 py-3'>Ngày bắt đầu</th>
                                <th className='px-6 py-3'>Trạng thái</th>
                                <th className='px-6 py-3'>Hàng tháng</th>
                                <th className='px-6 py-3'>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map(record => (
                                <tr key={record._id} className='bg-white border-b'>
                                    <td className='px-6 py-3'>{record.employeeId?.employeeId}</td>
                                    <td className='px-6 py-3'>{record.socialInsuranceNumber}</td>
                                    <td className='px-6 py-3'>{new Date(record.startDate).toLocaleDateString()}</td>
                                    <td className='px-6 py-3'>{record.status}</td>
                                    <td className='px-6 py-3'>{record.monthlyAmount}</td>
                                    <td className='px-6 py-3 space-x-2'>
                                        <Link to={`/admin-dashboard/social-insurance/edit/${record._id}`} className='px-3 py-1 rounded bg-blue-600 text-white hover:text-black'>Sửa</Link>
                                        <Link onClick={() => handleDelete(record._id)} className='text-white bg-red-600 px-3 py-1 rounded'>Xóa</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div>Loading...</div>
            )}
        </>
    );
};

export default List;