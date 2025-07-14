import axios from 'axios';
import React, { useEffect, useState } from 'react';

const List = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/attendance/reward-discipline', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.data.success) {
          setRecords(res.data.data);
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error);
        }
      }
    };
    fetchData();
  }, []);

  return (
    <div className='overflow-x-auto p-5'>
      <h2 className='text-2xl font-bold text-black text-center mb-4'>Khen thưởng / Kỷ luật</h2>
      <table className='w-full text-sm text-left text-gray-500'>
        <thead className='text-xs uppercase bg-gray-50 border border-gray-200 text-gray-700'>
          <tr>
            <th className='px-6 py-3'>Mã NV</th>
            <th className='px-6 py-3'>Tên</th>
            <th className='px-6 py-3'>Phòng ban</th>
            <th className='px-6 py-3'>Ngày có mặt</th>
            <th className='px-6 py-3'>Đi muộn</th>
            <th className='px-6 py-3'>Thưởng (VND)</th>
            <th className='px-6 py-3'>Phạt (VND)</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.employeeId} className='bg-white border-b'>
              <td className='px-6 py-3'>{r.employeeId}</td>
              <td className='px-6 py-3'>{r.name}</td>
              <td className='px-6 py-3'>{r.department}</td>
              <td className='px-6 py-3'>{r.presentDays}</td>
              <td className='px-6 py-3'>{r.lateDays}</td>
              <td className='px-6 py-3'>{r.reward}</td>
              <td className='px-6 py-3'>{r.fine}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default List;