import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchAllEmployees } from '../../utils/EmployeeHelper';

const Add = () => {
  const [form, setForm] = useState({
    employeeId: '',
    socialInsuranceNumber: '',
    startDate: '',
    status: 'active',
    note: '',
    monthlyAmount: 0,
  });

  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchEmployees = async () => {
      const emps = await fetchAllEmployees();
      try {
        const resp = await axios.get('http://localhost:5000/api/social-insurance', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (resp.data.success) {
          const usedIds = resp.data.records.map(r => typeof r.employeeId === 'object' ? r.employeeId._id : r.employeeId);
          const available = emps.filter(emp => !usedIds.includes(emp._id));
          setEmployees(available);
          const empId = searchParams.get('employee');
          if (empId && available.find(e => e._id === empId)) {
            const selected = available.find(emp => emp._id === empId);
            setForm(prev => ({
              ...prev,
              employeeId: empId,
              monthlyAmount: selected ? (selected.salary * 0.245).toFixed(0) : 0
            }));
          }
        } else {
          setEmployees(emps);
        }
      } catch (error) {
        setEmployees(emps);
      }
    };
    fetchEmployees();
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Nếu người dùng chọn nhân viên => tính lương
    if (name === 'employeeId') {
      const selectedEmp = employees.find(emp => emp._id === value);
      const monthly = selectedEmp ? (selectedEmp.salary * 0.32).toFixed(0) : 0;

      setForm(prev => ({
        ...prev,
        [name]: value,
        monthlyAmount: monthly
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/social-insurance/add', form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.data.success) {
        navigate('/admin-dashboard/social-insurance');
      }
    } catch (error) {
      alert(error.response?.data?.error || 'Lỗi khi thêm BHXH');
    }
  };

  return (
    <>
      {employees.length > 0 ? (
        <div className='max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md'>
          <h2 className='text-2xl font-bold mb-6 text-black'>Thêm BHXH</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Nhân viên</label>
              <select name='employeeId' value={form.employeeId} onChange={handleChange} className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required>
                <option value=''>Lựa chọn nhân viên</option>
                {employees.map(emp => (
                  <option key={emp._id} value={emp._id}>{emp.employeeId} - {emp.userId?.name}</option>
                ))}
              </select>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700'>Mã số BHXH</label>
                <input type='text' name='socialInsuranceNumber' onChange={handleChange} className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>Ngày bắt đầu</label>
                <input type='date' name='startDate' onChange={handleChange} className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required />
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700'>Trạng thái</label>
                <select name='status' onChange={handleChange} className='mt-1 p-2 block w-full border border-gray-300 rounded-md'>
                  <option value='active'>Đang tham gia</option>
                  <option value='paused'>Tạm ngưng</option>
                  <option value='stopped'>Đã ngưng</option>
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>Tổng tiền đóng BHXH hàng tháng </label>
                <input type='number' name='monthlyAmount' value={form.monthlyAmount} readOnly className='mt-1 p-2 block w-full border border-gray-300 rounded-md bg-black-500' />
              </div>
            </div>

            <div className='mt-4'>
              <label className='block text-sm font-medium text-gray-700'>Ghi chú</label>
              <textarea name='note' onChange={handleChange} className='mt-1 p-2 block w-full border border-gray-300 rounded-md'></textarea>
            </div>

            <button type='submit' className='w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded'>
              Thêm BHXH
            </button>
          </form>
        </div>
      ) : (
        <div className="text-center mt-10">Đang tải danh sách nhân viên...</div>
      )}
    </>
  );
};

export default Add;
