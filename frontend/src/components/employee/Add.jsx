import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { fetchDepartments } from '../../utils/EmployeeHelper'
import { useNavigate } from 'react-router-dom'
const Add = () => {
    const [departments, setDepartments] = useState([])
    // const [formData, setFormData] = useState({})
    const [formData, setFormData] = useState({employeeId: '', salary: 2340000})
    const navigate = useNavigate()

    useEffect(() => {

        const getDepartments = async () => {
        const departments = await fetchDepartments()
        setDepartments(departments)
        }
        const getNextId = async () => {
            try{
                const resp = await axios.get('http://localhost:5000/api/employee/next-id', {
                    headers: { "Authorization" : `Bearer ${localStorage.getItem('token')}` }
                })
                if(resp.data.success){
                    setFormData(prev => ({...prev, employeeId: resp.data.nextId}))
                }
            }catch(err){
                console.error(err)
            }
        }
        getDepartments()
        getNextId()
    }, [])

    useEffect(() => {
        const fetchNextId = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/employee/next-id', {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('token')}`
                    }
                })
                if (response.data.success) {
                    setFormData(prev => ({ ...prev, employeeId: response.data.nextId }))
                } else {
                    setFormData(prev => ({ ...prev, employeeId: '1' }))
                }
            } catch (error) {
                console.error(error)
                setFormData(prev => ({ ...prev, employeeId: '1' }))
            }
        }
        fetchNextId()
    }, [])

    const handleChange = (e) => {
        const {name, value, files} = e.target;
        if(name === 'image'){
            setFormData((prevData) => ({...prevData, [name] : files[0]}))
        }else{
            setFormData((prevData) => ({...prevData, [name] : value}))
        }
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataObj = new FormData()
        Object.keys(formData).forEach((key) =>{
            formDataObj.append(key, formData[key])
        })
        try{
            const response = await axios .post('http://localhost:5000/api/employee/add', formDataObj,{
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
    <div className='bg-white min-h-screen'>
        <div className='max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md'>
      <h2 className='text-2xl font-bold mb-6 text-black'>Thêm mới nhân viên</h2>
      <form onSubmit={handleSubmit}>
        {/* Name */}
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
                <label className='block text-sm font-medium text-gray-700'>Tên nhân viên</label>
                <input onChange={handleChange} type="text" name='name' placeholder='Insert Name' className='mt-1 p-2 block w-full border border-gray-300 rounded-md required'/>
            </div>
        

        {/* Email */}
            <div>
                <label className='block text-sm font-medium text-gray-700'>Email</label>
                <input type="email" onChange={handleChange} name='email' placeholder='Insert Email' className='mt-1 p-2 block w-full border border-gray-300 rounded-md required'/>
            </div>

{/* Địa chỉ */}
            <div>
                <label className='block text-sm font-medium text-gray-700'>Địa chỉ thường trú</label>
                <input type="text" onChange={handleChange} name='address' placeholder='Địa chỉ' className='mt-1 p-2 block w-full border border-gray-300 rounded-md required'/>
            </div>

            {/* SĐT */}

            <div>
                <label className='block text-sm font-medium text-gray-700'>Số điện thoại</label>
                <input type="number" onChange={handleChange} name='phoneNumber' placeholder='Số điện thoại' className='mt-1 p-2 block w-full border border-gray-300 rounded-md required'/>
            </div>

            {/* CMND */}

            <div>
                <label className='block text-sm font-medium text-gray-700'>Số CMND/CCCD</label>
                <input type="number" onChange={handleChange} name='identification' placeholder='Số CMND/CCCD' className='mt-1 p-2 block w-full border border-gray-300 rounded-md required'/>
            </div>

        {/* Employee */}
            <div>
                <label className='block text-sm font-medium text-gray-700'>Mã nhân viên</label>
                <input type="text" readOnly onChange={handleChange} value={formData.employeeId} name='employeeId' placeholder='Employee ID' className='mt-1 p-2 block w-full border border-gray-300 rounded-md required'/>
            </div>

        {/* Date of birth */}
            <div>
                <label className='block text-sm font-medium text-gray-700'>Ngày sinh</label>
                <input type="date" onChange={handleChange} name='dob' placeholder='DOB' className='mt-1 p-2 block w-full border border-gray-300 rounded-md required'/>
            </div>

        {/* Gender */}
        <div>
            <label className='block text-sm font-medium text-gray-700'>Giới tính</label>
            <select name='gender' onChange={handleChange} className='mt-1 p-2 block w-full border border-gray-300 rounded-md required'>
                <option value="">Giới tính</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
            </select>
        </div>
        
        <div>
            <label className='block text-sm font-medium text-gray-700'>Bằng cấp</label>
            <select name='dilopma' onChange={handleChange} placeholder='Bằng cấp' className='mt-1 p-2 block w-full border border-gray-300 rounded-md required'>
                <option value="">Bằng cấp</option>
                <option value="cử nhân">Cử nhân</option>
                <option value="kĩ sư">Kĩ sư</option>
            </select>
        </div>
        <div>
        <label className='block text-sm font-medium text-gray-700'>Học hàm</label>
            <select name='academicTitle' onChange={handleChange} className='mt-1 p-2 block w-full border border-gray-300 rounded-md'>
                <option value="">Học hàm</option>
                <option value="PGS">PGS</option>
                <option value="GS">GS</option>
            </select>
        </div>
        <div>
            <label className='block text-sm font-medium text-gray-700'>Học vị</label>
            <select name='degree' onChange={handleChange} className='mt-1 p-2 block w-full border border-gray-300 rounded-md required'>
                <option value="">Học vị</option>
                <option value="bachelor">Cử nhân</option>
                <option value="master">Thạc sĩ</option>
                <option value="doctor">Tiến sĩ</option>
            </select>
        </div>
        <div>
            <label className='block text-sm font-medium text-gray-700'>Chứng chỉ liên quan</label>
            <input type="text" onChange={handleChange} name='certificate' placeholder='Chứng chỉ' className='mt-1 p-2 block w-full border border-gray-300 rounded-md required'/>
        </div>

        <div>
            <label className='block text-sm font-medium text-gray-700'>Kĩ năng</label>
            <input type="text" onChange={handleChange} name='skill' placeholder='Kĩ năng' className='mt-1 p-2 block w-full border border-gray-300 rounded-md required'/>
        </div>


        <div>
            <label className='block text-sm font-medium text-gray-700'>Tình trạng hôn nhân</label>
            <select name='maritalStatus' onChange={handleChange} placeholder='Marital Status' className='mt-1 p-2 block w-full border border-gray-300 rounded-md required'>
                <option value="">Tình trạng hôn nhân</option>
                <option value="single">Độc thân</option>
                <option value="married">Đã kết hôn</option>
            </select>
        </div>

        <div>
            <label className='block text-sm font-medium text-gray-700'>Phòng ban</label>
            <select name='department' onChange={handleChange} className='mt-1 p-2 block w-full border border-gray-300 rounded-md required'>
                <option value="">Lựa chọn phòng ban</option>
                {departments.map((dep) =>(
                    <option key={dep._id} value={dep._id}>{dep.dep_name}</option>
                ))}
            </select>
        </div>

        <div>
            <label className='block text-sm font-medium text-gray-700'>Lương</label>
            <input type="number" onChange={handleChange} name='salary' value={formData.salary} className='mt-1 p-2 block w-full border border-gray-300 rounded-md required'/>
        </div>

        <div>
            <label className='block text-sm font-medium text-gray-700'>Mật khẩu</label>
            <input type="password" onChange={handleChange} name='password' placeholder='******' className='mt-1 p-2 block w-full border border-gray-300 rounded-md required'/>
        </div>

        <div>
            <label className='block text-sm font-medium text-gray-700'>Vai trò</label>
            <select name='role' onChange={handleChange} className='mt-1 p-2 block w-full border border-gray-300 rounded-md required'>
                <option value="">Lựa chọn vai trò</option>
                <option value="admin">Admin</option>
                <option value="employee">Nhân viên</option>
            </select>
        </div>

        <div>
            <label className='block text-sm font-medium text-gray-700'>Ảnh chân dung</label>
            <input type="file" name='image' onChange={handleChange} placeholder='Upload Image' accept='image/*' className='mt-1 p-2 block w-full border border-gray-300 rounded-md required'/>
        </div>
    </div>
        <button type='submit' className='w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded required'>
            Thêm nhân viên
        </button>
      </form>
    </div>
    </div>
  )
}

export default Add
