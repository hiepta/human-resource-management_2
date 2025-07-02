import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/authContext';

const Attendance = () => {
  const { user } = useAuth();
  const [today, setToday] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchToday = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/attendance/today/${user._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (res.data.success) {
        setToday(res.data.attendance);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchToday();
  }, []);

  const handleCheckIn = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/attendance/checkin', { userId: user._id }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (res.data.success) {
        setToday(res.data.attendance);
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.error);
      }
    }
  };

  const handleCheckOut = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/api/attendance/checkout/${today._id}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (res.data.success) {
        fetchToday();
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='p-6'>
      <h3 className='text-2xl font-bold text-black mb-4'>Chấm công hôm nay</h3>
      {today ? (
        <div>
          <p className='text-black'>Status: {today.status}</p>
          <p className='text-black'>Checked In: {today.checkIn ? new Date(today.checkIn).toLocaleTimeString() : '---'}</p>
          <p className='text-black'>Checked Out: {today.checkOut ? new Date(today.checkOut).toLocaleTimeString() : '---'}</p>
          {!today.isCompleted && today.status === 'Present' && (
            <button onClick={handleCheckOut} className='mt-4 px-4 py-2 bg-teal-600 text-white rounded'>Check Out</button>
          )}
        </div>
      ) : (
        <button onClick={handleCheckIn} className='px-4 py-2 bg-teal-600 text-white rounded'>Check In</button>
      )}
    </div>
  );
};

export default Attendance;