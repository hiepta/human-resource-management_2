import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../context/authContext'
const Seniority = () => {
  const { id } = useParams()
  const { user, loading } = useAuth()
  const [info, setInfo] = useState(null)

  useEffect(() => {
    if (loading || !user?.role) return
    const fetchInfo = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/seniority/${id}/${user.role}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        if (res.data.success) {
          setInfo(res.data)
        }
      } catch (error) {
        if (error.response) {
          alert(error.response.data.error)
        }
      }
    }
    fetchInfo()
  }, [id, user, loading])

  if (!info) {
    return <div>Loading...</div>
  }

  if (info.message) {
    return <div className='p-6 text-black'>{info.message}</div>
  }

  return (
    <div className='p-6'>
      <h3 className='text-2xl font-bold text-black mb-4'>Seniority</h3>
      <p className='text-black'>Next signing salary: {info.nextSigningSalary}</p>
      <p className='text-black'>Years until retirement: {info.yearsUntilRetirement}</p>
    </div>
  )
}

export default Seniority