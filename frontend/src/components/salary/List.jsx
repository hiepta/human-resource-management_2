import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { salaryColumns } from '../../utils/SalaryHelper';

const SalaryList = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const now = new Date();
        const query = `?month=${now.getMonth() + 1}&year=${now.getFullYear()}`;
        const res = await axios.get(`http://localhost:5000/api/salary/all/list${query}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.data.success) {
          let sno = 1;
          const data = res.data.data.map(r => ({
            ...r,
            sno: sno++,
          }));
          setRecords(data);
        } else {
          setRecords([]);
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error);
        }
        setRecords([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className='p-6'>
      <div className='text-center'>
        <h3 className='text-2xl font-bold text-black'>Lương nhân viên</h3>
      </div>
      <div className='mt-6'>
        <DataTable
          columns={salaryColumns}
          data={records}
          pagination
          progressPending={loading && records.length === 0}
          progressComponent={<div>Loading ...</div>}
          noDataComponent={<div>No salary records</div>}
        />
      </div>
    </div>
  );
};

export default SalaryList;