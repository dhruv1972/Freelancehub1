import { Link } from 'react-router-dom'
import { useState } from 'react'

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // check if user is logged in from localStorage
  useState(() => {
    const user = localStorage.getItem('user')
    if (user) {
      setIsLoggedIn(true)
    }
  })

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
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          
          {isLoggedIn ? (
            <button 
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
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

