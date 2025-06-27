import { useNavigate } from "react-router-dom";

export const columns = [
    {
        name: "STT",
        selector: (row) => row.sno,
        width: "70px",
    },

    {
        name: "Mã nhân viên",
        selector: (row) => row.employeeId,
        width: "120px",
    },

    {
        name: "Tên nhân viên",
        selector: (row) => row.name,
        width: "120px",
    },

    {
        name: "Nghỉ phép",
        selector: (row) => row.leaveType,
        width: "140px",
    },

    {
        name: "Phòng ban",
        selector: (row) => row.department,
        width: "150px",
    },

    {
        name: "Số ngày nghỉ",
        selector: (row) => row.days,
        width: "120px",
    },

    {
        name: "Trạng thái",
        selector: (row) => row.status,
        width: "120px",
    },

    {
        name: "Lựa chọn",
        selector: (row) => row.action,
        center: true,
    },
];

export const LeaveButtons = ({ Id }) => {
    const navigate = useNavigate()
    const handleView = (id) => {
        navigate(`/admin-dashboard/leaves/${id}`);
    }
    return(
        <button className="px-4 py-1 bg-teal-500 rounded text-white hover:bg-teal-600" onClick={() => handleView(Id)}>
            View
        </button>
    )
}