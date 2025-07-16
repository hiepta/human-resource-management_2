import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { fetchAllEmployees } from '../../utils/EmployeeHelper';
import React, { useState, useEffect } from "react";
const Add = () => {
  const [schedule, setSchedule] = useState({
    employeeId: '',
    subject: '',
    classRoom: '',
    date: '',
    startTime: '',
    endTime: ''
  });
  const [employees, setEmployees] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmp = async () => {
      const emps = await fetchAllEmployees();
      setEmployees(emps);
    };
    fetchEmp();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSchedule(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/schedule/add', schedule, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if(res.data.success){
        navigate('/admin-dashboard/schedules');
      }
    } catch (error) {
      if(error.response){
        alert(error.response.data.error);
      }
    }
  };

  return (
    <>{employees ? (
      <div className='max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md'>
        <h2 className='text-2xl font-bold mb-6 text-black'>Thêm lịch giảng dạy</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label className='block text-sm font-medium text-gray-700'>Nhân viên</label>
            <select name='employeeId' onChange={handleChange} className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required>
              <option value=''>Chọn nhân viên</option>
              {employees && employees.map(emp => (
                <option key={emp._id} value={emp._id}>{emp.employeeId}</option>
              ))}
            </select>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Môn học</label>
              <input type='text' name='subject' onChange={handleChange} className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Phòng học</label>
              <input type='text' name='classRoom' onChange={handleChange} className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required />
            </div>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Ngày</label>
              <input type='date' name='date' onChange={handleChange} className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Bắt đầu</label>
              <input type='time' name='startTime' onChange={handleChange} className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Kết thúc</label>
              <input type='time' name='endTime' onChange={handleChange} className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required />
            </div>
          </div>
          <button type='submit' className='w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded'>
            Thêm lịch
          </button>
        </form>
      </div>
    ) : <div>Loading...</div>}</>
  );
};

export default Add;