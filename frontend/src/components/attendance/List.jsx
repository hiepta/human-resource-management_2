import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { columns } from '../../utils/AttendanceHelper';

const List = () => {
  // const [attendances, setAttendances] = useState(null);
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/attendance', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.data.success) {
          let sno = 1;
          const data = response.data.attendances.map((att) => ({
            _id: att._id,
            sno: sno++,
            employeeId: att.employeeSnapshot?.employeeId || att.employeeId?.employeeId || '',
            name: att.employeeSnapshot?.name || att.employeeId?.userId?.name || '',
            department: att.employeeSnapshot?.department || att.employeeId?.department?.dep_name || '',
            date: att.date ? new Date(att.date).toLocaleDateString() : '',
            status: att.status,
            completed: att.isCompleted ? 'Yes' : 'No',
          }));
          setAttendances(data);
        }else{
          setAttendances([]);
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error);
        }
        setAttendances([]);
      }finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className='p-6'>
      <div className='text-center'>
        <h3 className='text-2xl font-bold text-black'>Chấm công</h3>
      </div>
      <div className='mt-6'>
        <DataTable
          columns={columns}
          data={attendances}
          pagination
          progressPending={loading && attendances.length === 0}
          progressComponent={<div>Loading ...</div>}
          noDataComponent={<div>No attendance records</div>}
        />
      </div>
    </div>
  );
};

export default List;