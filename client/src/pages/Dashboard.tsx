import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const navigate = useNavigate()

  useEffect(() => {
    // check if user is logged in
    const userData = localStorage.getItem('user')
    if (!userData) {
      navigate('/login')
      return
    }
    setUser(JSON.parse(userData))
  }, [navigate])

  if (!user) {
    return <div className="p-8 text-center">Loading...</div>
  }

  return (
    <div className="max-w-6xl mx-auto p-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        Welcome, {user.name || user.email}!
      </h1>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-600 text-sm">Active Projects</p>
          <p className="text-2xl font-bold">3</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-600 text-sm">Completed</p>
          <p className="text-2xl font-bold">12</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-600 text-sm">Earnings</p>
          <p className="text-2xl font-bold">$2,450</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-600 text-sm">Rating</p>
          <p className="text-2xl font-bold">4.8</p>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-bold mb-4">My Projects</h2>
        
        <div className="space-y-4">
          {/* sample project data */}
          {[
            { title: 'Website Redesign', status: 'In Progress', budget: '$500' },
            { title: 'Mobile App UI', status: 'In Progress', budget: '$800' },
            { title: 'Logo Design', status: 'Completed', budget: '$150' },
          ].map((project, index) => (
            <div key={index} className="border-b pb-4 last:border-b-0">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{project.title}</h3>
                  <span className={`text-sm ${
                    project.status === 'Completed' ? 'text-green-600' : 'text-blue-600'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <span className="font-medium">{project.budget}</span>
              </div>
            </div>
          ))}
        </div>

        <button className="mt-4 text-blue-600 hover:underline">
          View All Projects
        </button>
      </div>
    </div>
  )
}

export default Dashboard
