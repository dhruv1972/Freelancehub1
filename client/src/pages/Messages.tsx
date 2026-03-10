import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { api, withUser } from '../services/api'

function Messages() {
  const [user, setUser] = useState<any>(null)
  const [conversations, setConversations] = useState<any[]>([])
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const [allUsers, setAllUsers] = useState<any[]>([])
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      navigate('/login')
      return
    }
    const parsed = JSON.parse(userData)
    setUser(parsed)
    loadConversations(parsed)
    loadAllUsers(parsed)

    const partnerFromQuery = searchParams.get('withUserId')
    if (partnerFromQuery) {
      // pre-open conversation if query param provided
      setSelectedUser(partnerFromQuery)
      loadMessages(parsed, partnerFromQuery)
    }
  }, [navigate, searchParams])

  const loadConversations = async (currentUser: any) => {
    try {
      const res = await api.get(`/messages/conversations/${currentUser._id}`)
      setConversations(res.data || [])
    } catch (err) {
      console.error('Failed to load conversations:', err)
    }
  }

  const loadAllUsers = async (currentUser: any) => {
    try {
      const res = await api.get('/users')
      const list = (res.data || []).filter((u: any) => u._id !== currentUser._id)
      setAllUsers(list)
    } catch (err) {
      console.error('Failed to load users for messaging:', err)
    }
  }

  const loadMessages = async (currentUser: any, partnerId: string) => {
    setSelectedUser(partnerId)
    try {
      const res = await api.get(`/messages/${currentUser._id}/${partnerId}`)
      setMessages(res.data || [])
    } catch (err) {
      console.error('Failed to load messages:', err)
    }
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser) return
    if (!newMessage.trim() && pendingFiles.length === 0) return

    try {
      const userApi = withUser(user.email)

      const readFileAsDataUrl = (file: File) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = (err) => reject(err)
          reader.readAsDataURL(file)
        })

      const attachments =
        pendingFiles.length > 0
          ? await Promise.all(
              pendingFiles.map(async (file) => ({
                name: file.name,
                data: await readFileAsDataUrl(file),
                mimeType: file.type,
              })),
            )
          : []

      await userApi.post('/messages', {
        senderId: user._id,
        receiverId: selectedUser,
        content: newMessage.trim() || 'Attachment',
        attachments,
      })
      setNewMessage('')
      setPendingFiles([])
      // reload current thread so the new message appears
      await loadMessages(user, selectedUser)
      // also refresh conversations list so this chat appears under "Chats"
      await loadConversations(user)
    } catch (err) {
      console.error('Failed to send message:', err)
    }
  }

  const getPartnerName = (partnerId: string | null): string => {
    if (!partnerId) return ''
    const fromConv = conversations.find((c: any) => c.partnerId === partnerId)
    if (fromConv) return fromConv.partnerName
    const fromAll = allUsers.find((u: any) => u._id === partnerId)
    if (fromAll) return `${fromAll.firstName || ''} ${fromAll.lastName || ''}`.trim() || fromAll.email
    return ''
  }

  if (!user) return (
    <div className="page-content">
      <div style={{ padding: '80px 0', textAlign: 'center', color: '#999', fontSize: 15 }}>Loading...</div>
    </div>
  )

  return (
    <div className="page-content">
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Messages</h1>
        <p style={{ fontSize: 14, color: '#999' }}>Chat with clients or freelancers about your projects.</p>
      </header>

      <div className="card" style={{ display: 'flex', overflow: 'hidden', height: 560 }}>
        <div style={{ width: '33.333%', borderRight: '1px solid #333', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '10px 16px', borderBottom: '1px solid #333', fontSize: 13, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Chats
          </div>
          <div style={{ flexGrow: 0 }}>
            {conversations.length === 0 ? (
              <div style={{ padding: 16, textAlign: 'center', color: '#777', fontSize: 13 }}>No conversations yet</div>
            ) : (
              conversations.map((conv: any) => (
                <div
                  key={conv.partnerId}
                  onClick={() => loadMessages(user, conv.partnerId)}
                  style={{
                    padding: 16,
                    borderBottom: '1px solid #333',
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                    background: selectedUser === conv.partnerId ? '#333' : 'transparent',
                  }}
                  onMouseEnter={e => { if (selectedUser !== conv.partnerId) e.currentTarget.style.background = '#2a2a2a' }}
                  onMouseLeave={e => { if (selectedUser !== conv.partnerId) e.currentTarget.style.background = 'transparent' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 36,
                      height: 36,
                      background: '#333',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <span style={{ color: '#5eead4', fontWeight: 600, fontSize: 14 }}>{conv.partnerName.charAt(0)}</span>
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontWeight: 500, fontSize: 14, color: '#fff' }}>{conv.partnerName}</p>
                      <p style={{ fontSize: 12, color: '#777', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{conv.lastMessage}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={{ padding: '10px 16px', borderTop: '1px solid #333', borderBottom: '1px solid #333', fontSize: 13, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 4 }}>
            All users
          </div>
          <div style={{ flexGrow: 1, overflowY: 'auto' }}>
            {allUsers.length === 0 ? (
              <div style={{ padding: 16, textAlign: 'center', color: '#777', fontSize: 13 }}>No other users yet</div>
            ) : (
              (() => {
                const inChatIds = new Set(conversations.map((c: any) => c.partnerId))
                const available = allUsers.filter((u: any) => !inChatIds.has(u._id))
                if (available.length === 0) {
                  return (
                    <div style={{ padding: 16, textAlign: 'center', color: '#777', fontSize: 13 }}>
                      Everyone you can chat with is already in Chats.
                    </div>
                  )
                }
                return available.map((u: any) => (
                  <div
                    key={u._id}
                    onClick={() => loadMessages(user, u._id)}
                    style={{
                      padding: 14,
                      borderBottom: '1px solid #333',
                      cursor: 'pointer',
                      transition: 'background 0.15s',
                      background: selectedUser === u._id ? '#333' : 'transparent',
                    }}
                    onMouseEnter={e => { if (selectedUser !== u._id) e.currentTarget.style.background = '#2a2a2a' }}
                    onMouseLeave={e => { if (selectedUser !== u._id) e.currentTarget.style.background = 'transparent' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 32,
                        height: 32,
                        background: '#333',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <span style={{ color: '#5eead4', fontWeight: 600, fontSize: 13 }}>
                          {(u.firstName || u.email || 'U').charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontWeight: 500, fontSize: 14, color: '#fff' }}>
                          {`${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email}
                        </p>
                        <p style={{ fontSize: 12, color: '#777' }}>
                          {u.userType === 'client' ? 'Client' : 'Freelancer'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              })()
            )}
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {selectedUser ? (
            <>
              <div style={{ padding: '12px 20px', borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 36,
                  height: 36,
                  background: '#333',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <span style={{ color: '#5eead4', fontWeight: 600, fontSize: 14 }}>
                    {(getPartnerName(selectedUser) || 'U').charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 15, color: '#fff' }}>{getPartnerName(selectedUser) || 'User'}</p>
                </div>
              </div>
              <div style={{ flex: 1, padding: 20, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {messages.map((msg: any) => {
                  const isMe = msg.senderId?._id === user._id || msg.senderId === user._id
                  const attachments = msg.attachments || []
                  return (
                    <div key={msg._id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                      <div style={{
                        maxWidth: 360,
                        padding: '10px 16px',
                        borderRadius: 16,
                        fontSize: 14,
                        lineHeight: 1.5,
                        background: isMe ? 'rgba(94,234,212,0.15)' : '#333',
                        color: isMe ? '#5eead4' : '#e5e5e5',
                        border: isMe ? '1px solid rgba(94,234,212,0.25)' : '1px solid #444',
                      }}>
                        <div>{msg.content}</div>
                        {attachments.length > 0 && (
                          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {attachments.map((att: any, index: number) => {
                              const name = att?.name || `Attachment ${index + 1}`
                              const href = att?.data || att
                              return (
                                <a
                                  key={index}
                                  href={href}
                                  download={name}
                                  style={{
                                    fontSize: 12,
                                    color: isMe ? '#bbf7d0' : '#93c5fd',
                                    textDecoration: 'underline',
                                    wordBreak: 'break-all',
                                  }}
                                >
                                  {name}
                                </a>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
              <form onSubmit={handleSend} style={{ padding: 16, borderTop: '1px solid #333', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {pendingFiles.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, fontSize: 12 }}>
                    {pendingFiles.map((file, index) => (
                      <div
                        key={index}
                        style={{
                          padding: '4px 8px',
                          borderRadius: 999,
                          background: '#111827',
                          border: '1px solid #374151',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        <span style={{ color: '#e5e7eb' }}>{file.name}</span>
                        <button
                          type="button"
                          onClick={() => setPendingFiles(pendingFiles.filter((_, i) => i !== index))}
                          style={{
                            border: 'none',
                            background: 'transparent',
                            color: '#f87171',
                            cursor: 'pointer',
                            fontSize: 12,
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ display: 'flex', gap: 10 }}>
                  <label
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 12px',
                      borderRadius: 10,
                      border: '1px solid #374151',
                      background: '#020617',
                      color: '#e5e7eb',
                      fontSize: 13,
                      cursor: 'pointer',
                    }}
                  >
                    Attach
                    <input
                      type="file"
                      multiple
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const files = Array.from(e.target.files || [])
                        // simple size guard: max ~2MB each
                        const allowed = files.filter(f => f.size <= 2 * 1024 * 1024)
                        setPendingFiles(allowed)
                      }}
                    />
                  </label>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  style={{
                    flex: 1,
                    height: 42,
                    fontSize: 14,
                    padding: '0 16px',
                    background: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: 10,
                    color: '#fff',
                    outline: 'none',
                  }}
                  placeholder="Type a message..."
                />
                  <button
                    type="submit"
                    style={{
                      height: 42,
                      padding: '0 18px',
                      background: '#333',
                      border: '1px solid #444',
                      borderRadius: 10,
                      color: '#fff',
                      fontSize: 14,
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#444')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#333')}
                  >
                    Send
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, textAlign: 'center' }}>
              <p style={{ color: '#999', marginBottom: 8, fontSize: 15 }}>Select a conversation from the list to view messages.</p>
              <p style={{ color: '#777', fontSize: 13 }}>New conversations appear when you send or receive a message.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Messages
