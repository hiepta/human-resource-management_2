import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/authContext';

const CalculateSalary = () => {
  const { id } = useParams();
  const { user, loading } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (loading || !user?.role) return;
    const fetchData = async () => {
      try {
        const now = new Date();
        const query = `?month=${now.getMonth() + 1}&year=${now.getFullYear()}`;
        const res = await axios.get(
          `http://localhost:5000/api/salary/${id}/${user.role}${query}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }
        );
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
  }, [id, user, loading]);

  if (!data) {
    return <div>Loading...</div>;
  }

  if (data.message) {
    return <div className='p-6 text-black'>{data.message}</div>;
  }

  return (
    <div className='p-6'>
      <h3 className='text-2xl font-bold text-black mb-4'>Lương Tháng</h3>
      <p className='text-black'>Lương cơ bản: {data.baseSalary}</p>
      <p className='text-black'>Hệ số lương: {data.salaryCoefficient}</p>
      <p className='text-black'>Phụ cấp giảng dạy: {data.teachingAllowance}</p>
      <p className='text-black'>Phụ cấp thâm niên: {data.seniorityAllowance}</p>
      <p className='text-black'>Bảo hiểm xã hội: {data.socialInsurance}</p>
      <p className='text-black font-semibold mt-2'>Lương nhận: {data.salary}</p>
    </div>
  );
};

export default CalculateSalary;