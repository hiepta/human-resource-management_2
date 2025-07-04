import React, { useState } from 'react'
import axios from 'axios'

const Chatbot = ({ userId }) => {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Xin chào! Bạn muốn hỏi điều gì?' }
  ])
  const [input, setInput] = useState('')
  const [pending, setPending] = useState(null)
  // const [askLeave, setAskLeave] = useState(false)

  const toggleOpen = () => setOpen((prev) => !prev)

  const sendMessage = async () => {
    if (!input.trim()) return
    const text = input.trim()
    setMessages((prev) => [...prev, { sender: 'user', text }])
    setInput('')
    const lower = text.toLowerCase()

    if (pending === 'confirmLeaveToday') {
      if (['yes', 'y', 'co', 'có'].includes(lower)) {
        try {
          await axios.post('http://localhost:5000/api/chatbot/request-leave-today', { userId }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          })
          setMessages((prev) => [...prev, { sender: 'bot', text: 'Đã ghi nhận ngày nghỉ hôm nay.' }])
        } catch (err) {
          setMessages((prev) => [...prev, { sender: 'bot', text: 'Không thể tạo yêu cầu nghỉ.' }])
        }
      } else {
        setMessages((prev) => [...prev, { sender: 'bot', text: 'Đã hủy yêu cầu nghỉ.' }])
      }
      setPending(null)
      return
    }

    if (lower.includes('ngh') && lower.includes('phep')) {
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Bạn có muốn nghỉ hôm nay không? (yes/no)' }])
      setPending('confirmLeaveToday')
      return
    }

    if (lower.includes('bao') && lower.includes('hiem')) {
      try {
        const res = await axios.get(`http://localhost:5000/api/chatbot/social-insurance/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        if (res.data.success) {
          setMessages((prev) => [...prev, { sender: 'bot', text: `Mức đóng BHXH hàng tháng của bạn là ${res.data.monthlyAmount}.` }])
          return
        }
      } catch (err) {}
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Không thể lấy thông tin BHXH.' }])
      return
    }

    if (lower.includes('hop dong') || lower.includes('contract')) {
      try {
        const res = await axios.get(`http://localhost:5000/api/chatbot/contract-date/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        if (res.data.success) {
          const d = new Date(res.data.startDate).toLocaleDateString()
          setMessages((prev) => [...prev, { sender: 'bot', text: `Ngày ký hợp đồng: ${d}.` }])
          return
        }
      } catch (err) {}
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Không thể lấy thông tin hợp đồng.' }])
      return
    }

    if (lower.includes('nghi huu') || lower.includes('retire')) {
      try {
        const res = await axios.get(`http://localhost:5000/api/chatbot/retirement/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        if (res.data.success) {
          setMessages((prev) => [...prev, { sender: 'bot', text: `Bạn còn ${res.data.yearsLeft} năm nữa đến tuổi nghỉ hưu.` }])
          return
        }
      } catch (err) {}
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Không thể tính năm nghỉ hưu.' }])
      return
    }

    if (lower.includes('day') && lower.includes('off')) {
      try {
        const res = await axios.get(`http://localhost:5000/api/chatbot/days-off-left/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        if (res.data.success) {
          setMessages((prev) => [...prev, { sender: 'bot', text: `Bạn còn ${res.data.daysLeft} ngày nghỉ.` }])
          return
        }
      } catch (err) {}
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Không thể lấy số ngày nghỉ còn lại.' }])
      return
    }

    setMessages((prev) => [...prev, { sender: 'bot', text: 'Xin lỗi, tôi chưa hiểu câu hỏi.' }])
  }
  if (!open) {
    return (
      <button
        className='fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-full'
        onClick={toggleOpen}
      >
        Chatbot
      </button>
    )
  }

  return (
    <div className='fixed bottom-4 right-4 bg-white p-4 rounded shadow w-80'>
      <div className='flex justify-between items-center mb-2'>
        <h4 className='font-semibold text-blue-600'>Chatbot</h4>
        <button className='text-gray-600' onClick={toggleOpen}>✕</button>
      </div>
      <div className='h-40 overflow-y-auto mb-4'>
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`mb-1 ${m.sender === 'bot' ? 'text-blue-600' : 'text-gray-800'}`}
          >
            <span className='font-semibold'>{m.sender === 'bot' ? 'Bot:' : 'Bạn:'}</span> {m.text}
          </div>
        ))}
      </div>
      <div className='flex'>
        <input
          className='flex-1 border p-2 mr-2'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Nhập câu hỏi...'
        />
        <button className='bg-blue-500 text-white px-4 rounded' onClick={sendMessage}>
          Gửi
        </button>
      </div>
    </div>
  )
}

export default Chatbot