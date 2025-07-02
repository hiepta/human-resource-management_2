import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/authContext'
const EmployeeList = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [records, setRecords] = useState(null);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/social-insurance/record/${id}/${user.role}`, {
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
    }, [id, user.role]);
  
    return (
      <>
        {records ? (
          <div className='overflow-x-auto p-5'>
            <h2 className='text-2xl font-bold text-black text-center mb-4'>Bảo hiểm xã hội</h2>
            <table className='w-full text-sm text-left text-gray-500'>
              <thead className='text-xs uppercase bg-gray-50 border border-gray-200 text-gray-700'>
                <tr>
                  <th className='px-6 py-3'>Mã NV</th>
                  <th className='px-6 py-3'>Mã số BHXH</th>
                  <th className='px-6 py-3'>Ngày bắt đầu</th>
                  <th className='px-6 py-3'>Trạng thái</th>
                  <th className='px-6 py-3'>Hàng tháng</th>
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
  
  export default EmployeeList;