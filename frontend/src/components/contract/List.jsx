import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'

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

const List = () => {
    const [contracts, setContracts] = useState(null);

    useEffect(() => {
        const fetchContracts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/contract', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (response.data.success) {
                    setContracts(response.data.contracts);
                }
            } catch (error) {
                if (error.response && !error.response.data.success) {
                    alert(error.response.data.error);
                }
            }
        };

        fetchContracts();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa hợp đồng này không?")) {
            try {
                await axios.delete(`http://localhost:5000/api/contract/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                // Cập nhật lại danh sách sau khi xóa
                setContracts(prev => prev.filter(contract => contract._id !== id));
            } catch (error) {
                alert("Xóa hợp đồng thất bại.");
            }
        }
    };
    return (
        <>
            {contracts ? (
                <div className='overflow-x-auto p-5'>
                    <h2 className='text-2xl font-bold text-black text-center mb-4'>Danh sách hợp đồng</h2>
                    <Link
                            to="/admin-dashboard/contracts/add"
                            className='bg-green-500 text-white px-3 py-1 rounded hover:bg-green-300'
                        >
                            + Thêm hợp đồng
                        </Link>
                    <table className='w-full text-sm text-left text-gray-500'>
                        <thead className='text-xs uppercase bg-gray-50 border border-gray-200 text-gray-700'>
                            <tr>
                                <th className='px-6 py-3'>Nhân viên</th>
                                <th className='px-6 py-3'>Ngày ký</th>
                                <th className='px-6 py-3'>Ngày bắt đầu</th>
                                <th className='px-6 py-3'>Ngày kết thúc</th>
                                <th className='px-6 py-3'>Lần ký</th>
                                <th className='px-6 py-3'>Hệ số lương</th>
                                <th className='px-6 py-3'>Thời gian</th>
                                <th className='px-6 py-3'>Loại hợp đồng</th>
                                <th className='px-6 py-3'>Hành động</th>

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
                                    <td className='px-6 py-3'>{calculateTerm(contract.duration)}</td>
                                    <td className='px-6 py-3'>{contract.term}</td>
                                    <td className='px-6 py-3 space-x-2'>
                                        <Link
                                            to={`/admin-dashboard/contracts/edit/${contract._id}`}
                                            className="px-3 py-1 rounded bg-blue-600 text-white hover:text-black">
                                            Sửa
                                        </Link>
            
                                        <Link
                                            onClick={() => handleDelete(contract._id)}
                                            className='text-white bg-red-600 px-3 py-1 rounded'>
                                            Xóa
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div>Loading contract...</div>
            )}
        </>
    );
};

export default List;
