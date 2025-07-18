import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { fetchDepartments } from '../../utils/EmployeeHelper'
import { useNavigate, useParams } from 'react-router-dom'


const Edit = () => {
    const [employee, setEmployee] = useState({
        name: '',
        maritalStatus: '',  
        salary: 0,
        department: '',
        oldDepartment: '',
        certificate: '',
        academicTitle: '',
        degree: '',
        skill: ''
    })
    const navigate = useNavigate()
    const {id} = useParams()
    const [departments, setDepartments] = useState(null) 

    useEffect(() => {

        const getDepartments = async () => {
        const departments = await fetchDepartments()
        setDepartments(departments)
        }
        getDepartments()
    }, [])

    useEffect(() => {

        const fetchEmployee = async () => {
            try {
              const response = await axios.get(`http://localhost:5000/api/employee/${id}`,{
                headers: {
                  "Authorization" : `Bearer ${localStorage.getItem('token')}`
                }
              })
              console.log(response.data)
              if(response.data.success){
                const employee = response.data.employee
                setEmployee((prev) => ({
                  ...prev,
                  name: employee.userId.name,
                  maritalStatus: employee.maritalStatus,
                  academicTitle: employee.academicTitle || '',
                  degree: employee.degree || '',
                  salary: employee.salary,
                  department: employee.department ? employee.department._id : '',
                  oldDepartment: employee.oldDepartment ? employee.oldDepartment._id : '',
                  address: employee.address,
                  employeeId: employee.employeeId,
                  skill: employee.skill,
                  certificate: employee.certificate,
                }))
              }
            }catch(error){
              if(error.response && !error.response.data.success){
                alert(error.response.data.error)
              }
            }
          }
          fetchEmployee();
    }, [id])

    const handleChange = (e) => {
        const {name, value} = e.target;
            setEmployee((prevData) => ({...prevData, [name] : value}))
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const response = await axios .put(`http://localhost:5000/api/employee/${id}`, employee,{
              headers: {
                "Authorization" : `Bearer ${localStorage.getItem('token')}`
              }
            })
            if(response.data.success){
              navigate("/admin-dashboard/employees")
            }
          }catch(error){
            if(error.response && !error.response.data.success){
              alert(error.response.data.error)
            }
          }
    }
  return (
    <>{departments && employee ? (
    <div className='max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md'>
      <h2 className='text-2xl font-bold mb-6 text-black'>Sửa thông tin nhân viên</h2>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div>
            <div>
                <label className='block text-sm font-medium text-gray-700'>Tên nhân viên: </label>
                <input onChange={handleChange} value={employee.name} type="text" name='name' placeholder='Insert Name' className='mt-1 p-2 block w-full border border-gray-300 rounded-md required'/>
            </div>
        </div>
        
        <div>
            <label className='block text-sm font-medium text-gray-700'>Chứng chỉ liên quan</label>
            <input type="text" value={employee.certificate} onChange={handleChange} name='certificate' placeholder='Chứng chỉ' className='mt-1 p-2 block w-full border border-gray-300 rounded-md required'/>
        </div>

        <div>
            <label className='block text-sm font-medium text-gray-700'>Kĩ năng</label>
            <input type="text" value={employee.skill} onChange={handleChange} name='skill' placeholder='Kĩ năng' className='mt-1 p-2 block w-full border border-gray-300 rounded-md required'/>
        </div>

        <div>
            <label className='block text-sm font-medium text-gray-700'>Mã nhân viên</label>
            <input type="number" onChange={handleChange} value={employee.employeeId} name='employeeId' placeholder='Mã nhân viên' className='mt-1 p-2 block w-full border border-gray-300 rounded-md required'/>
        </div>

        <div>
            <label className='block text-sm font-medium text-gray-700'>Tình trạng hôn nhân</label>
            <select name='maritalStatus' value={employee.maritalStatus} onChange={handleChange} placeholder='Marital Status' className='mt-1 p-2 block w-full border border-gray-300 rounded-md required'>
                <option value="">Lựa chọn tình trạng</option>
                <option value="độc thân">Độc thân</option>
                <option value="đã kết hôn">Đã kết hôn</option>
            </select>
        </div>

        <div>
            <label className='block text-sm font-medium text-gray-700'>Học vị</label>
            <select name='degree' value={employee.degree} onChange={handleChange} className='mt-1 p-2 block w-full border border-gray-300 rounded-md required'>
                <option value="">Học vị</option>
                <option value="bachelor">Cử nhân</option>
                <option value="master">Thạc sĩ</option>
                <option value="doctor">Tiến sĩ</option>
            </select>
        </div>


        <div>
        <label className='block text-sm font-medium text-gray-700'>Học hàm</label>
            <select name='academicTitle' value={employee.academicTitle} onChange={handleChange} className='mt-1 p-2 block w-full border border-gray-300 rounded-md'>
                <option value="">Học hàm</option>
                <option value="PGS">PGS</option>
                <option value="GS">GS</option>
            </select>
        </div>
        
        <div>
            <label className='block text-sm font-medium text-gray-700'>Địa chỉ</label>
            <input type="text" onChange={handleChange} value={employee.address} name='address' placeholder='Địa chỉ' className='mt-1 p-2 block w-full border border-gray-300 rounded-md required'/>
        </div>

        <div>
            <label className='block text-sm font-medium text-gray-700'>Lương</label>
            <input type="number" onChange={handleChange} value={employee.salary} name='salary' placeholder='Salary' className='mt-1 p-2 block w-full border border-gray-300 rounded-md required'/>
        </div>

        <div className='col-span-2'>
            <label className='block text-sm font-medium text-gray-700'>Phòng ban</label>
            <select name='department' value={employee.department} onChange={handleChange} className='mt-1 p-2 block w-full border border-gray-300 rounded-md required'>
                <option value="">Lựa chọn phòng ban</option>
                {departments.map((dep) =>(
                    <option key={dep._id} value={dep._id}>{dep.dep_name}</option>
                ))}
            </select>
            {employee.oldDepartment && (
                <p className='mt-2 text-sm text-gray-600'>Phòng ban cũ: {departments.find(d => d._id === employee.oldDepartment)?.dep_name}</p>
            )}
        </div>

        <button type='submit' className='w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded required'>
            Chỉnh sửa nhân viên
        </button>
      </form>
    </div>
    ) : <div>Loading ...</div>}</>
  )
}

export default Edit
