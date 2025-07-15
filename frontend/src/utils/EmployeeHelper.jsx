import axios from "axios"
import { useNavigate } from "react-router-dom"
export const columns = [
  {
      name: "STT",
      selector: (row) => row.sno,
      width: "70px"
  },

  {
      name: "Tên",
      selector: (row) => row.name,
      sortable: true,
      width: "100px"
  },

  {
    name: "Ảnh",
    selector: (row) => row.profileImage,
    width: "100px"
  },

  {
    name: "Phòng ban",
    selector: (row) => row.dep_name,
    width: "120px"
  },

  {
    name: "Ngày sinh",
    selector: (row) => row.dob,
    sortable: true,
    width: "130px" 
  },

  {
      name: "Lựa chọn",
      selector: (row) => row.action,
      center: "true"
  }

]

export const fetchDepartments = async () => {
    let departments
    try {
      const response = await axios.get('http://localhost:5000/api/department',{
        headers: {
          "Authorization" : `Bearer ${localStorage.getItem('token')}`
        }
      })
      if(response.data.success){
        departments = response.data.departments
      }
    }catch(error){
      if(error.response && !error.response.data.success){
        alert(error.response.data.error)
      }
    }
    return departments
  }

  // employees for salary form

  export const getEmployees = async (id) => {
    let employees;
    try {
      const response = await axios.get(`http://localhost:5000/api/employee/department/${id}`,{
        headers: {
          "Authorization" : `Bearer ${localStorage.getItem('token')}`
        }
      })
      console.log(response)
      if(response.data.success){
        employees = response.data.employees
      }
    }catch(error){
      if(error.response && !error.response.data.success){
        alert(error.response.data.error)
      }
    }
    return employees
  }

  export const fetchAllEmployees = async () => {
    let employees
    try {
      const response = await axios.get('http://localhost:5000/api/employee',{ 
        headers:{
          "Authorization" : `Bearer ${localStorage.getItem('token')}`
        }
      })
      if(response.data.success){
        employees = response.data.employees
      }
    }catch(error){
      if(error.response && !error.response.data.success){
        alert(error.response.data.error)
      }
    }
    return employees
}

export const EmployeeButtons = ({Id, onEmployeeDelete}) => {
    const navigate = useNavigate()
    const handleDelete = async(id) => {
      const confirmDelete = window.confirm("Do you want to delete?")
      if(confirmDelete){
          try{
              const response = await axios.delete(`http://localhost:5000/api/employee/${id}`, {
                  headers: {
                      "Authorization" : `Bearer ${localStorage.getItem('token')}`
                  }
              })
              if(response.data.success){
                  onEmployeeDelete && onEmployeeDelete(id)
              }
          }catch(error){
              if(error.response && !error.response.data.success){
                  alert(error.response.data.error)
              }
          }
      }
  }
    return (
        <div className="flex space-x-3">
            <button className="px-3 py-1 bg-teal-600 text-white"
             onClick={() => navigate(`/admin-dashboard/employees/${Id}`)}>Xem</button>
            <button className="px-3 py-1 bg-blue-600 text-white" onClick={() => navigate(`/admin-dashboard/employees/edit/${Id}`)}>Sửa</button>
            <button className="px-3 py-1 bg-gray-600 text-white" onClick={() => handleDelete(Id)}>Xóa</button>
            <button className="px-3 py-1 bg-red-600 text-white" onClick={() => navigate(`/admin-dashboard/employees/leaves/${Id}`)}>Nghỉ phép</button>
            <button className="px-3 py-1 bg-yellow-600 text-white" onClick={() => navigate(`/admin-dashboard/seniority/${Id}`)}>Thâm niên</button>
        </div>
    )
}