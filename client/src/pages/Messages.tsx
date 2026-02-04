import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Messages() {
  const [user, setUser] = useState<any>(null)
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const navigate = useNavigate()

  // sample conversations (TODO: fetch from API)
  const [conversations] = useState([
    { partnerId: 'u1', partnerName: 'John Smith', lastMessage: 'Sounds good, lets proceed!', lastMessageTime: '2026-01-30T10:30:00' },
    { partnerId: 'u2', partnerName: 'Sarah Johnson', lastMessage: 'Can you share the design files?', lastMessageTime: '2026-01-29T15:45:00' },
    { partnerId: 'u3', partnerName: 'Mike Davis', lastMessage: 'Thank you for your proposal', lastMessageTime: '2026-01-28T09:00:00' }
  ])

  // sample messages for selected conversation
  const [messages] = useState([
    { _id: '1', senderId: 'u1', content: 'Hi, I saw your proposal for my project', createdAt: '2026-01-30T09:00:00' },
    { _id: '2', senderId: 'me', content: 'Hello! Yes, I am very interested in working on it', createdAt: '2026-01-30T09:15:00' },
    { _id: '3', senderId: 'u1', content: 'Great! Can you start next week?', createdAt: '2026-01-30T09:30:00' },
    { _id: '4', senderId: 'me', content: 'Absolutely, I can start on Monday', createdAt: '2026-01-30T10:00:00' },
    { _id: '5', senderId: 'u1', content: 'Sounds good, lets proceed!', createdAt: '2026-01-30T10:30:00' }
  ])

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      navigate('/login')
      return
    }
    setUser(JSON.parse(userData))
  }, [navigate])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return
    
    // TODO: send to backend
    alert('Message sent: ' + newMessage)
    setNewMessage('')
  }

  if (!user) return <div className="p-8">Loading...</div>

  return (
    <div className="max-w-6xl mx-auto p-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>

      <div className="bg-white rounded-lg shadow flex" style={{ height: '500px' }}>
        {/* Conversations List */}
        <div className="w-1/3 border-r overflow-y-auto">
          {conversations.map(conv => (
            <div
              key={conv.partnerId}
              onClick={() => setSelectedConversation(conv.partnerId)}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                selectedConversation === conv.partnerId ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  {conv.partnerName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{conv.partnerName}</p>
                  <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Messages Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map(msg => (
                  <div
                    key={msg._id}
                    className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.senderId === 'me' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <p>{msg.content}</p>
                      <p className={`text-xs mt-1 ${
                        msg.senderId === 'me' ? 'text-blue-200' : 'text-gray-400'
                      }`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 border p-2 rounded"
                  placeholder="Type a message..."
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Send
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Messages

