import { useNavigate } from "react-router-dom"
import axios from "axios"; 

export const columns = [
    {
        name: "STT",
        selector: (row) => row.sno,
    },

    {
        name: "Tên phòng ban",
        selector: (row) => row.dep_name,
        sortable: true
    },

    {
        name: "Lựa chọn",
        selector: (row) => row.action
    },
]

export const DepartmentButtons = ({Id, onDepartmentDelete}) => {
    const navigate = useNavigate()
    const handleDelete = async (id) => {
        const confirm = window.confirm("Do you want to delete?")
        if(confirm){
        try {
            const response = await axios.delete(`http://localhost:5000/api/department/${id}`,{
              headers: {
                "Authorization" : `Bearer ${localStorage.getItem('token')}`
              }
            })
            if(response.data.success){
                onDepartmentDelete()
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
             onClick={() => navigate(`/admin-dashboard/department/${Id}`)}>Sửa</button>
            <button className="px-3 py-1 bg-red-600 text-white" onClick={() => handleDelete(Id)}>Xóa</button>
        </div>
    )
}