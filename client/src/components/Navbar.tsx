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
    <nav className="bg-blue-600 text-white p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          FreelanceHub
        </Link>
        
        <div className="flex gap-4 items-center">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/search" className="hover:underline">Find Work</Link>
          
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="hover:underline">Dashboard</Link>
              <Link to="/messages" className="hover:underline">Messages</Link>
              
              {userType === 'freelancer' && (
                <>
                  <Link to="/my-proposals" className="hover:underline">My Proposals</Link>
                  <Link to="/my-projects" className="hover:underline">My Projects</Link>
                </>
              )}
              
              {userType === 'client' && (
                <Link to="/create-project" className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100">
                  Post Project
                </Link>
              )}
              
              <Link to="/profile" className="hover:underline">Profile</Link>
              <button 
                onClick={handleLogout}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link 
                to="/register" 
                className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100"
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
