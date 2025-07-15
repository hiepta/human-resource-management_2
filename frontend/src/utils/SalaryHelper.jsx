export const salaryColumns = [
    { name: 'STT', selector: row => row.sno, width: '70px' },
    { name: 'Mã nhân viên', selector: row => row.employeeId, width: '120px' },
    { name: 'Tên nhân viên', selector: row => row.name, width: '120px' },
    { name: 'Phòng ban', selector: row => row.department, width: '150px' },
    { name: 'Lương cơ bản', selector: row => row.baseSalary, width: '120px' },
    { name: 'Ngày công', selector: row => row.presentDays, width: '100px' },
    { name: 'Lương nhận', selector: row => row.salary, width: '120px' }
  ];