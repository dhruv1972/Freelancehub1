import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userType, setUserType] = useState('')

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      setIsLoggedIn(true)
      const parsed = JSON.parse(user)
      setUserType(parsed.userType || '')
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setIsLoggedIn(false)
    window.location.href = '/'
  }

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          FreelanceHub
        </Link>
        
        <div className="flex gap-4 items-center text-sm">
          <Link to="/" className="hover:text-blue-200">Home</Link>
          <Link to="/search" className="hover:text-blue-200">Find Work</Link>
          <Link to="/find-freelancers" className="hover:text-blue-200">Find Talent</Link>
          
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="hover:text-blue-200">Dashboard</Link>
              <Link to="/messages" className="hover:text-blue-200">Messages</Link>
              <Link to="/notifications" className="hover:text-blue-200 relative">
                Notifications
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">2</span>
              </Link>
              
              {userType === 'freelancer' && (
                <>
                  <Link to="/my-proposals" className="hover:text-blue-200">My Proposals</Link>
                  <Link to="/my-projects" className="hover:text-blue-200">My Projects</Link>
                </>
              )}
              
              {userType === 'client' && (
                <Link to="/create-project" className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-50">
                  Post Project
                </Link>
              )}
              
              <Link to="/profile" className="hover:text-blue-200">Profile</Link>
              <button 
                onClick={handleLogout}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-200">Login</Link>
              <Link 
                to="/register" 
                className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-50"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
