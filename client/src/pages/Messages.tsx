import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { withUser } from '../services/api'

function Messages() {
  const [user, setUser] = useState<any>(null)
  const [conversations, setConversations] = useState<any[]>([])
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      navigate('/login')
      return
    }
    const parsed = JSON.parse(userData)
    setUser(parsed)
    loadConversations(parsed)
  }, [navigate])

  const loadConversations = async (currentUser: any) => {
    try {
      const userApi = withUser(currentUser.email)
      const res = await userApi.get('/messages')
      const msgs = res.data || []

      const convMap: any = {}
      msgs.forEach((msg: any) => {
        const partnerId = msg.senderId?._id === currentUser._id
          ? msg.receiverId?._id
          : msg.senderId?._id
        const partner = msg.senderId?._id === currentUser._id
          ? msg.receiverId
          : msg.senderId

        if (partnerId && !convMap[partnerId]) {
          convMap[partnerId] = {
            partnerId,
            partnerName: `${partner?.firstName || ''} ${partner?.lastName || ''}`.trim() || 'User',
            lastMessage: msg.content,
          }
        }
      })
      setConversations(Object.values(convMap))
    } catch (err) {
      console.error('Failed to load conversations:', err)
    }
  }

  const loadMessages = async (partnerId: string) => {
    setSelectedUser(partnerId)
    try {
      const userApi = withUser(user.email)
      const res = await userApi.get('/messages', { params: { withUserId: partnerId } })
      setMessages(res.data || [])
    } catch (err) {
      console.error('Failed to load messages:', err)
    }
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedUser) return

    try {
      const userApi = withUser(user.email)
      await userApi.post('/messages', {
        receiverId: selectedUser,
        content: newMessage
      })
      setNewMessage('')
      loadMessages(selectedUser)
    } catch (err) {
      console.error('Failed to send message:', err)
    }
  }

  if (!user) return <div className="p-8 text-center text-gray-500">Loading...</div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Messages</h1>

      <div className="bg-white border border-gray-200 rounded-xl flex" style={{ height: '500px' }}>
        <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-6 text-center text-gray-400 text-sm">No conversations yet</div>
          ) : (
            conversations.map((conv: any) => (
              <div
                key={conv.partnerId}
                onClick={() => loadMessages(conv.partnerId)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition ${
                  selectedUser === conv.partnerId ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">{conv.partnerName.charAt(0)}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-gray-900">{conv.partnerName}</p>
                    <p className="text-xs text-gray-400 truncate">{conv.lastMessage}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex-1 flex flex-col">
          {selectedUser ? (
            <>
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {messages.map((msg: any) => {
                  const isMe = msg.senderId?._id === user._id || msg.senderId === user._id
                  return (
                    <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                        isMe ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  )
                })}
              </div>
              <form onSubmit={handleSend} className="p-4 border-t border-gray-200 flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type a message..."
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                  Send
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Messages
