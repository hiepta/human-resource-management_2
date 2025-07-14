import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/authContext';

const EmployeeReward = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [record, setRecord] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/attendance/reward-discipline/${id}/${user.role}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.data.success) {
          setRecord(res.data.record);
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error);
        }
      }
    };
    fetchData();
  }, [id, user.role]);

  if (!record) {
    return <div>Loading...</div>;
  }

  return (
    <div className='p-6'>
      <h3 className='text-2xl font-bold text-black mb-4'>Khen thưởng / Kỷ luật tháng này</h3>
      <div className='bg-white p-4 rounded shadow'>
        <p className='text-black'>Ngày có mặt: {record.presentDays}</p>
        <p className='text-black'>Đi muộn: {record.lateDays}</p>
        <p className='text-black'>Thưởng: {record.reward} VND</p>
        <p className='text-black'>Phạt: {record.fine} VND</p>
      </div>
    </div>
  );
};

export default EmployeeReward;