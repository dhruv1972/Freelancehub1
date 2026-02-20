import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Notifications() {
  const [user, setUser] = useState<any>(null)
  const navigate = useNavigate()

  // sample notifications (TODO: fetch from API)
  const [notifications, setNotifications] = useState([
    { _id: '1', title: 'Proposal Accepted!', message: 'Your proposal for "E-commerce Website" has been accepted.', type: 'proposal_accepted', isRead: false, createdAt: '2026-02-12T10:30:00' },
    { _id: '2', title: 'New Message', message: 'John Smith sent you a message about the project.', type: 'message_received', isRead: false, createdAt: '2026-02-12T09:15:00' },
    { _id: '3', title: 'Payment Received', message: 'You received $500 for "Logo Design" project.', type: 'payment_received', isRead: true, createdAt: '2026-02-11T16:00:00' },
    { _id: '4', title: 'New Proposal', message: 'Sarah Johnson submitted a proposal for your project.', type: 'proposal_received', isRead: true, createdAt: '2026-02-10T14:30:00' },
    { _id: '5', title: 'Project Completed', message: 'The project "Portfolio Website" has been marked as completed.', type: 'project_completed', isRead: true, createdAt: '2026-02-09T11:00:00' },
  ])

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      navigate('/login')
      return
    }
    setUser(JSON.parse(userData))
  }, [navigate])

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n._id === id ? { ...n, isRead: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'proposal_accepted': return '✅'
      case 'proposal_received': return '📩'
      case 'proposal_rejected': return '❌'
      case 'message_received': return '💬'
      case 'payment_received': return '💰'
      case 'project_completed': return '🎉'
      default: return '🔔'
    }
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  if (!user) return <div className="p-8">Loading...</div>

  return (
    <div className="max-w-3xl mx-auto p-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-500">{unreadCount} unread</p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-blue-600 hover:underline text-sm"
          >
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-500">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map(notification => (
            <div
              key={notification._id}
              onClick={() => markAsRead(notification._id)}
              className={`bg-white p-4 rounded-lg shadow flex items-start gap-3 cursor-pointer ${
                !notification.isRead ? 'border-l-4 border-blue-500' : ''
              }`}
            >
              <span className="text-2xl">{getIcon(notification.type)}</span>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className={`font-medium ${!notification.isRead ? 'text-black' : 'text-gray-600'}`}>
                    {notification.title}
                  </h3>
                  {!notification.isRead && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Notifications

