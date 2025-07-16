import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const columns = [
  { name: 'STT', selector: row => row.sno, width: '70px' },
  { name: 'Mã nhân viên', selector: row => row.employeeId, width: '120px' },
  { name: 'Tên nhân viên', selector: row => row.name, width: '120px' },
  { name: 'Môn học', selector: row => row.subject, width: '150px' },
  { name: 'Phòng', selector: row => row.classRoom, width: '100px' },
  { name: 'Ngày', selector: row => row.date, width: '120px' },
  { name: 'Thời gian', selector: row => row.time, width: '150px' },
  { name: 'Lựa chọn', selector: row => row.action }
];

export const ScheduleButtons = ({ Id, onDelete }) => {
  const navigate = useNavigate();
  const handleDelete = async (id) => {
    if(window.confirm('Bạn có chắc chắn muốn xóa?')){
      try{
        await axios.delete(`http://localhost:5000/api/schedule/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        onDelete && onDelete(id);
      }catch(err){
        alert('Xóa thất bại');
      }
    }
  }
  return (
    <div className='flex space-x-2'>
      <button className='px-3 py-1 bg-red-600 text-white' onClick={() => handleDelete(Id)}>Xóa</button>
    </div>
  )
}