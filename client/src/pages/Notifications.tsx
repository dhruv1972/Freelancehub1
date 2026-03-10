import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'

type NotificationItem = {
  _id: string
  title: string
  message: string
  type: string
  isRead: boolean
  createdAt: string
  relatedId?: string
}

function Notifications() {
  const [user, setUser] = useState<any>(null)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      navigate('/login')
      return
    }
    const parsed = JSON.parse(userData)
    setUser(parsed)

    api
      .get<NotificationItem[]>(`/notifications/${parsed._id}`)
      .then(res => setNotifications(res.data || []))
      .catch(() => setNotifications([]))
  }, [navigate])

  const getRelatedId = (n: NotificationItem): string | null => {
    const r = n.relatedId
    if (r == null) return null
    if (typeof r === 'string') return r
    return (r as any)?._id ?? (r as any)?.toString?.() ?? null
  }

  const markAsReadAndNavigate = async (n: NotificationItem) => {
    // Compute target first so we always navigate even if mark-as-read fails
    let target: string | null = null
    const relatedId = getRelatedId(n)
    switch (n.type) {
      case 'project_posted':
      case 'proposal_received':
        target = relatedId ? `/project/${relatedId}` : '/my-projects'
        break
      case 'proposal_accepted':
        target = relatedId ? `/project/${relatedId}` : '/my-proposals'
        break
      case 'proposal_rejected':
        target = '/my-proposals'
        break
      case 'payment_received':
        target = relatedId ? `/project/${relatedId}` : '/my-projects'
        break
      case 'project_completed':
        target = '/my-projects'
        break
      case 'message_received':
        target = '/messages'
        break
      case 'invitation_to_apply':
        target = relatedId ? `/project/${relatedId}` : '/search'
        break
      default:
        target = null
    }

    if (target) {
      navigate(target)
    }

    try {
      if (!n.isRead) {
        await api.patch(`/notifications/${n._id}/read`)
        setNotifications(prev => prev.map(item =>
          item._id === n._id ? { ...item, isRead: true } : item
        ))
      }
    } catch {
      // ignore mark-as-read errors; navigation already happened
    }
  }

  const markAllAsRead = async () => {
    try {
      await api.patch(`/notifications/${user._id}/read-all`)
      setNotifications(notifications.map(n => ({ ...n, isRead: true })))
    } catch {
      // ignore error
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'proposal_accepted': return '✅'
      case 'proposal_received': return '📩'
      case 'proposal_rejected': return '❌'
      case 'message_received': return '💬'
      case 'payment_received': return '💰'
      case 'project_completed': return '🎉'
      case 'project_posted': return '📢'
      case 'invitation_to_apply': return '📨'
      default: return '🔔'
    }
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  if (!user) return (
    <div className="page-content">
      <div style={{ padding: '80px 0', textAlign: 'center', color: '#999', fontSize: 15 }}>Loading...</div>
    </div>
  )

  return (
    <div className="page-content" style={{ maxWidth: 840 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Notifications</h1>
          <p style={{ fontSize: 14, color: '#999' }}>Updates on proposals, messages, and payments.</p>
          {unreadCount > 0 && <p style={{ fontSize: 13, color: '#999', marginTop: 4 }}>{unreadCount} unread</p>}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            style={{ color: '#5eead4', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500 }}
            onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
            onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
          >
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="card" style={{ padding: 60, textAlign: 'center' }}>
          <p style={{ color: '#999', fontSize: 15 }}>No notifications yet</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {notifications.map(notification => (
            <div
              key={notification._id}
              onClick={() => markAsReadAndNavigate(notification)}
              className="card"
              style={{
                padding: 20,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 14,
                cursor: 'pointer',
                transition: 'border-color 0.15s',
                borderLeft: !notification.isRead ? '4px solid #5eead4' : undefined,
              }}
            >
              <span style={{ fontSize: 24, flexShrink: 0 }}>{getIcon(notification.type)}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ fontWeight: 500, fontSize: 15, color: !notification.isRead ? '#fff' : '#999' }}>{notification.title}</h3>
                  {!notification.isRead && <span style={{ width: 8, height: 8, background: '#5eead4', borderRadius: '50%', marginTop: 6, flexShrink: 0 }} />}
                </div>
                <p style={{ fontSize: 14, color: '#999', marginTop: 4, lineHeight: 1.5 }}>{notification.message}</p>
                <p style={{ fontSize: 12, color: '#777', marginTop: 8 }}>{new Date(notification.createdAt).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Notifications
