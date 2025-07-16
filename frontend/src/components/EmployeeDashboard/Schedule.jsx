import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/authContext';

const Schedule = () => {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState(null);

  const fetchSchedules = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/schedule/employee/${user._id}/${user.role}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if(res.data.success){
        setSchedules(res.data.schedules);
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  useEffect(() => { fetchSchedules(); }, []);

  if(!schedules){
    return <div>Loading...</div>;
  }

  return (
    <div className='overflow-x-auto p-5'>
      <h2 className='text-2xl font-bold text-black text-center mb-4'>Lịch giảng dạy</h2>
      <table className='w-full text-sm text-left text-gray-500'>
        <thead className='text-xs uppercase bg-gray-50 border border-gray-200 text-gray-700'>
          <tr>
            <th className='px-6 py-3'>Môn học</th>
            <th className='px-6 py-3'>Phòng</th>
            <th className='px-6 py-3'>Ngày</th>
            <th className='px-6 py-3'>Thời gian</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map(sc => (
            <tr key={sc._id} className='bg-white border-b'>
              <td className='px-6 py-3'>{sc.subject}</td>
              <td className='px-6 py-3'>{sc.classRoom}</td>
              <td className='px-6 py-3'>{new Date(sc.date).toLocaleDateString()}</td>
              <td className='px-6 py-3'>{sc.startTime} - {sc.endTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Schedule;