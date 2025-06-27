import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { fetchDepartments, getEmployees } from '../../utils/EmployeeHelper'
import { useNavigate, useParams } from 'react-router-dom'


const Add = () => {
    const [salary, setSalary] = useState({
        employeeId: null,
        basicSalary: 0,
        allowances: 0,
        deductions: 0,
        payDate: null
    })
    const [departments, setDepartments] = useState(null) 
    const [employees, setEmployees] = useState([]) 
    const navigate = useNavigate()

    useEffect(() => {

        const getDepartments = async () => {
        const departments = await fetchDepartments()
        setDepartments(departments)
        }
        getDepartments()
    }, [])

    const handleChange = (e) => {
        const {name, value} = e.target;
            setSalary((prevData) => ({...prevData, [name] : value}))
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const response = await axios .post(`http://localhost:5000/api/salary/add`, salary,{
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

    const handleDepartment = async (e) => {
        const emps = await getEmployees(e.target.value)
        setEmployees(emps)
    }   

  return (
    <>{departments? (
    <div className='max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md'>
      <h2 className='text-2xl font-bold mb-6 text-black'>Add Salary</h2>
      <form onSubmit={handleSubmit}>
        {/* {Department} */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
            <label className='block text-sm font-medium text-gray-700'>Phòng ban</label>
            <select name='department' onChange={handleDepartment} className='mt-1 p-2 block w-full border border-gray-300 rounded-md required'>
                <option value="">Lựa chọn phòng ban</option>
                {departments.map((dep) =>(
                    <option key={dep._id} value={dep._id}>{dep.dep_name}</option>
                ))}
            </select>
        </div>

        <div>
            <label className='block text-sm font-medium text-gray-700'>Nhân viên</label>
            <select name='employeeId' onChange={handleChange} className='mt-1 p-2 block w-full border border-gray-300 rounded-md required'>
                <option value="">Lựa chọn nhân viên</option>
                {employees.map((emp) =>(
                    <option key={emp._id} value={emp._id}>{emp.employeeId}</option>
                ))}
            </select>
        </div>
        </div>

        <div>
            <label className='block text-sm font-medium text-gray-700'>Lương cơ bản</label>
            <input type="number" onChange={handleChange} name='basicSalary' placeholder='Basic Salary' className='mt-1 p-2 block w-full border border-gray-300 rounded-md required'/>
        </div>

        <div>
            <label className='block text-sm font-medium text-gray-700'>Trợ cấp</label>
            <input type="number" onChange={handleChange} name='allowances' placeholder='Trợ cấp' className='mt-1 p-2 block w-full border border-gray-300 rounded-md required'/>
        </div>

        <div>
            <label className='block text-sm font-medium text-gray-700'>Khấu trừ</label>
            <input type="number" onChange={handleChange} name='deductions' placeholder='Khấu trừ' className='mt-1 p-2 block w-full border border-gray-300 rounded-md required'/>
        </div>

        <div>
            <label className='block text-sm font-medium text-gray-700'>Ngày trả</label>
            <input type="date" onChange={handleChange} name='payDate' className='mt-1 p-2 block w-full border border-gray-300 rounded-md required'/>
        </div>

        <button type='submit' className='w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded required'>
            Add Salary
        </button>
      </form>
    </div>
    ) : <div>Loading ...</div>}</>
  )
}

export default Add
