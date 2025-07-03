import React, { useState } from 'react'
import axios from 'axios'

const Chatbot = ({ userId }) => {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Xin chào! Bạn muốn hỏi điều gì?' }
  ])
  const [input, setInput] = useState('')

  const toggleOpen = () => setOpen((prev) => !prev)

  const sendMessage = async () => {
    if (!input.trim()) return
    const text = input.trim()
    setMessages((prev) => [...prev, { sender: 'user', text }])
    setInput('')
    const lower = text.toLowerCase()
    if (lower.includes('day') && lower.includes('off')) {
      try {
        const res = await axios.get(`http://localhost:5000/api/chatbot/days-off-left/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        if (res.data.success) {
          setMessages((prev) => [...prev, { sender: 'bot', text: `Bạn còn ${res.data.daysLeft} ngày nghỉ.` }])
          return
        }
      } catch (err) {
        // ignore
      }
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Không thể lấy số ngày nghỉ còn lại.' }])
    } else {
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Xin lỗi, tôi chỉ có thể trả lời về số ngày nghỉ còn lại.' }])
    }
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