import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userType, setUserType] = useState('')
  const [userName, setUserName] = useState('')
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
    }
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setDropdownOpen(false)
  }, [location])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setIsLoggedIn(false)
    window.location.href = '/'
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">F</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              Freelance<span className="text-blue-600">Hub</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/" className={`px-3 py-2 rounded-lg text-sm font-medium transition ${isActive('/') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}>
              Home
            </Link>
            <Link to="/search" className={`px-3 py-2 rounded-lg text-sm font-medium transition ${isActive('/search') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}>
              Find Work
            </Link>
            <Link to="/find-freelancers" className={`px-3 py-2 rounded-lg text-sm font-medium transition ${isActive('/find-freelancers') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}>
              Find Talent
            </Link>

            {isLoggedIn && (
              <>
                <Link to="/dashboard" className={`px-3 py-2 rounded-lg text-sm font-medium transition ${isActive('/dashboard') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                  Dashboard
                </Link>
                <Link to="/messages" className={`px-3 py-2 rounded-lg text-sm font-medium transition ${isActive('/messages') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                  Messages
                </Link>
                <Link to="/notifications" className={`px-3 py-2 rounded-lg text-sm font-medium transition relative ${isActive('/notifications') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                  Notifications
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                </Link>
              </>
            )}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                {userType === 'client' && (
                  <Link to="/create-project" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                    + Post Project
                  </Link>
                )}
                
                {/* User dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
                        {userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{userName.split(' ')[0]}</span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Profile</Link>
                      {userType === 'freelancer' && (
                        <>
                          <Link to="/my-proposals" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Proposals</Link>
                          <Link to="/my-projects" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Projects</Link>
                        </>
                      )}
                      <hr className="my-1 border-gray-100" />
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition">
                  Sign In
                </Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-1">
              <Link to="/" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">Home</Link>
              <Link to="/search" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">Find Work</Link>
              <Link to="/find-freelancers" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">Find Talent</Link>
              {isLoggedIn ? (
                <>
                  <Link to="/dashboard" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">Dashboard</Link>
                  <Link to="/messages" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">Messages</Link>
                  <Link to="/notifications" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">Notifications</Link>
                  <Link to="/profile" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">Profile</Link>
                  <button onClick={handleLogout} className="text-left px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50">Sign Out</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">Sign In</Link>
                  <Link to="/register" className="px-3 py-2 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50">Get Started</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
