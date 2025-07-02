export const columns = [
    {
      name: 'STT',
      selector: (row) => row.sno,
      width: '70px',
    },
    {
      name: 'Mã nhân viên',
      selector: (row) => row.employeeId,
      width: '120px',
    },
    {
      name: 'Tên nhân viên',
      selector: (row) => row.name,
      width: '120px',
    },
    {
      name: 'Phòng ban',
      selector: (row) => row.department,
      width: '150px',
    },
    {
      name: 'Ngày',
      selector: (row) => row.date,
      width: '120px',
    },
    {
      name: 'Trạng thái',
      selector: (row) => row.status,
      width: '120px',
    },
    {
      name: 'Hoàn thành',
      selector: (row) => row.completed,
      width: '120px',
    },
  ];