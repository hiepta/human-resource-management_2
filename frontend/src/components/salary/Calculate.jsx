import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Calculate = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/salary/calculate/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.data.success) {
          setData(res.data);
        }
      } catch (error) {
        if (error.response) {
          alert(error.response.data.error);
        }
      }
    };
    fetchData();
  }, [id]);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className='p-6'>
      <h3 className='text-2xl font-bold text-black mb-4'>Tính lương tháng</h3>
      <p className='text-black'>Số ngày công: {data.actualWorkingDays}</p>
      <p className='text-black'>Lương thực nhận: {data.netSalary}</p>
    </div>
  );
};

export default Calculate;