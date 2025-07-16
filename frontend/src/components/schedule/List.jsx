import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import { columns, ScheduleButtons } from '../../utils/ScheduleHelper';

const List = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try{
      const res = await axios.get('http://localhost:5000/api/schedule', {
        headers:{ Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if(res.data.success){
        let sno = 1;
        const data = res.data.schedules.map(sc => ({
          _id: sc._id,
          sno: sno++,
          employeeId: sc.employeeId?.employeeId || '',
          name: sc.employeeId?.userId?.name || '',
          subject: sc.subject,
          classRoom: sc.classRoom,
          date: new Date(sc.date).toLocaleDateString(),
          time: `${sc.startTime} - ${sc.endTime}`,
          action: <ScheduleButtons Id={sc._id} onDelete={handleDelete}/>
        }));
        setSchedules(data);
      }
    }catch(err){
      console.log(err.message);
    }finally{
      setLoading(false);
    }
  }

  useEffect(() => { fetchData(); }, []);

  const handleDelete = (id) => {
    setSchedules(prev => prev.filter(s => s._id !== id));
  }

  return (
    <div className='p-6'>
      <div className='text-center'>
        <h3 className='text-2xl font-bold text-black'>Lịch giảng dạy</h3>
      </div>
      <div className='flex justify-end my-2'>
        <Link to='/admin-dashboard/schedules/add' className='px-4 py-1 bg-teal-600 text-white rounded'>Thêm lịch</Link>
      </div>
      <div className='mt-3'>
        <DataTable columns={columns} data={schedules} pagination progressPending={loading && schedules.length === 0} />
      </div>
    </div>
  );
};

export default List;