import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { api } from '../services/api'

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userType, setUserType] = useState('')
  const [userName, setUserName] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const [unreadMsgCount, setUnreadMsgCount] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      setIsLoggedIn(true)
      const parsed = JSON.parse(user)
      setUserType(parsed.userType || '')
      setUserName(parsed.name || parsed.firstName || parsed.email || '')
      setIsAdmin(parsed.isAdmin || false)
      setUserId(parsed._id || null)
    }
  }, [])

  useEffect(() => {
    if (!userId) return
    api
      .get<{ count: number }>(`/notifications/${userId}/unread`)
      .then(res => setUnreadCount(res.data?.count || 0))
      .catch(() => setUnreadCount(0))
    api
      .get<{ count: number }>(`/messages/unread/${userId}`)
      .then(res => setUnreadMsgCount(res.data?.count || 0))
      .catch(() => setUnreadMsgCount(0))
  }, [userId])

  useEffect(() => { setMenuOpen(false); setDropdownOpen(false) }, [location])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setIsLoggedIn(false)
    window.location.href = '/'
  }

  const active = (p: string) => location.pathname === p
  const lnk = (p: string) =>
    `font-medium transition whitespace-nowrap ${active(p) ? 'text-white' : 'text-[#999] hover:text-white'}`

  return (
    <nav className="sticky top-0 z-50" style={{ height: 64, background: '#1e1e1e', borderBottom: '1px solid #333' }}>
      <div className="container-app h-full flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-4 shrink-0">
          <Link to="/" className="flex items-center gap-2.5">
            <div
              className="flex items-center justify-center rounded-lg"
              style={{ width: 36, height: 36, background: '#2a2a2a', border: '1px solid #444' }}
            >
              <span style={{ color: '#5eead4', fontWeight: 700, fontSize: 18, lineHeight: 1 }}>F</span>
            </div>
            <span style={{ fontSize: 20, fontWeight: 700, color: '#fff', lineHeight: 1 }}>
              Freelance<span style={{ color: '#5eead4' }}>Hub</span>
            </span>
          </Link>

        </div>

        {/* CENTER */}
        <div className="hidden md:flex items-center" style={{ gap: 32 }}>
          <Link to="/" className={lnk('/')} style={{ fontSize: 14 }}>Home</Link>
          {(!isLoggedIn || userType === 'freelancer') && (
            <Link to="/search" className={lnk('/search')} style={{ fontSize: 14 }}>Find Work</Link>
          )}
          {(!isLoggedIn || userType === 'client') && (
            <Link to="/find-freelancers" className={lnk('/find-freelancers')} style={{ fontSize: 14 }}>Find Talent</Link>
          )}
          {isLoggedIn && (
            <>
              <Link
                to="/messages"
                className={lnk('/messages')}
                style={{
                  fontSize: 14,
                  position: 'relative',
                  color: unreadMsgCount > 0 ? '#ffffff' : undefined,
                  fontWeight: unreadMsgCount > 0 ? 600 : undefined,
                }}
              >
                Messages
                {unreadMsgCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: -6,
                      right: -10,
                      minWidth: 14,
                      height: 14,
                      borderRadius: 999,
                      background: '#f97316',
                      color: '#0b1120',
                      fontSize: 10,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 4px',
                    }}
                  >
                    {unreadMsgCount > 9 ? '9+' : unreadMsgCount}
                  </span>
                )}
              </Link>
              <Link
                to="/notifications"
                className={lnk('/notifications')}
                style={{
                  fontSize: 14,
                  position: 'relative',
                  color: unreadCount > 0 ? '#ffffff' : undefined,
                  fontWeight: unreadCount > 0 ? 600 : undefined,
                }}
              >
                Notifications
                {unreadCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: -6,
                      right: -10,
                      minWidth: 14,
                      height: 14,
                      borderRadius: 999,
                      background: '#f97316',
                      color: '#0b1120',
                      fontSize: 10,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 4px',
                    }}
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
            </>
          )}
        </div>

        {/* RIGHT */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {isLoggedIn ? (
            <>
              {userType === 'client' && (
                <Link to="/create-project" className="btn-primary rounded-lg mr-1" style={{ height: 36, padding: '0 16px', fontSize: 13 }}>
                  Post Project
                </Link>
              )}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 rounded-lg hover:bg-white/5 transition"
                  style={{ height: 36, padding: '0 8px' }}
                >
                  <div
                    className="rounded-full flex items-center justify-center shrink-0"
                    style={{ width: 32, height: 32, background: '#2a2a2a', border: '1px solid #444' }}
                  >
                    <span style={{ color: '#5eead4', fontWeight: 600, fontSize: 13 }}>{userName.charAt(0).toUpperCase()}</span>
                  </div>
                  <svg className="w-4 h-4 text-[#666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {dropdownOpen && (
                  <div
                    className="absolute right-0 z-50"
                    style={{ width: 230, marginTop: 8, background: '#252525', border: '1px solid #404040', borderRadius: 14, padding: '6px 0', boxShadow: '0 12px 32px rgba(0,0,0,0.5)' }}
                  >
                    {[
                      { to: '/dashboard', label: 'Dashboard' },
                      { to: '/profile', label: 'My Profile' },
                      ...(userType === 'freelancer' ? [
                        { to: '/my-proposals', label: 'My Proposals' },
                        { to: '/saved-jobs', label: 'Saved jobs' },
                        { to: '/my-projects', label: 'My Projects' },
                        { to: '/my-time', label: 'My time' },
                      ] : []),
                      ...(userType === 'client' ? [
                        { to: '/my-projects', label: 'My Projects' },
                      ] : []),
                      ...(isAdmin ? [{ to: '/admin', label: 'Admin Dashboard' }] : []),
                    ].map(item => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className="block transition"
                        style={{ padding: '10px 20px', fontSize: 14, color: '#ddd', textDecoration: 'none' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        {item.label}
                      </Link>
                    ))}
                    <div style={{ height: 1, background: '#333', margin: '6px 0' }} />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left transition"
                      style={{ padding: '10px 20px', fontSize: 14, color: '#f87171', background: 'none', border: 'none', cursor: 'pointer' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="hover:text-white transition" style={{ fontSize: 14, color: '#ccc', padding: '0 8px' }}>Sign In</Link>
              <span style={{ color: '#555', fontSize: 14 }}>/</span>
              <div
                className="rounded-full flex items-center justify-center shrink-0"
                style={{ width: 34, height: 34, background: '#2a2a2a', border: '1px solid #444' }}
              >
                <svg className="w-4 h-4" style={{ color: '#999' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <Link to="/register" className="hover:text-white transition" style={{ fontSize: 14, color: '#ccc', padding: '0 8px' }}>Sign Up</Link>
            </div>
          )}
        </div>

        {/* Mobile */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden flex flex-col" style={{ background: '#1e1e1e', borderTop: '1px solid #333', padding: '16px 20px' }}>
          <Link to="/" style={{ padding: '12px 0', fontSize: 15, color: '#fff' }}>Home</Link>
          {(!isLoggedIn || userType === 'freelancer') && (
            <Link to="/search" style={{ padding: '12px 0', fontSize: 15, color: '#fff' }}>Find Work</Link>
          )}
          {(!isLoggedIn || userType === 'client') && (
            <Link to="/find-freelancers" style={{ padding: '12px 0', fontSize: 15, color: '#fff' }}>Find Talent</Link>
          )}
          {isLoggedIn ? (
            <>
              {['/dashboard', '/messages', '/notifications', '/profile'].map((p, i) => (
                <Link key={i} to={p} style={{ padding: '12px 0', fontSize: 15, color: '#fff' }}>
                  {['Dashboard', 'Messages', 'Notifications', 'Profile'][i]}
                </Link>
              ))}
              <button onClick={handleLogout} style={{ padding: '12px 0', fontSize: 15, color: '#f87171', textAlign: 'left' }}>Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ padding: '12px 0', fontSize: 15, color: '#fff' }}>Sign In</Link>
              <Link to="/register" style={{ padding: '12px 0', fontSize: 15, color: '#fff' }}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
