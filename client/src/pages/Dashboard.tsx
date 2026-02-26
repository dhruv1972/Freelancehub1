import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      navigate('/login')
      return
    }
    setUser(JSON.parse(userData))
  }, [navigate])

  if (!user) {
    return <div className="p-8 text-center text-gray-500">Loading...</div>
  }

  const stats = [
    { label: 'Active Projects', value: '3', color: 'bg-blue-50 text-blue-600' },
    { label: 'Completed', value: '12', color: 'bg-green-50 text-green-600' },
    { label: 'Total Earnings', value: '$2,450', color: 'bg-purple-50 text-purple-600' },
    { label: 'Avg Rating', value: '4.8', color: 'bg-orange-50 text-orange-600' },
  ]

  const projects = [
    { title: 'Website Redesign', status: 'In Progress', budget: '$500', progress: 65 },
    { title: 'Mobile App UI', status: 'In Progress', budget: '$800', progress: 30 },
    { title: 'Logo Design', status: 'Completed', budget: '$150', progress: 100 },
  ]

  const activities = [
    { icon: '💬', text: 'New message from John Smith', time: '5 min ago' },
    { icon: '✅', text: 'Proposal accepted for E-commerce project', time: '2 hours ago' },
    { icon: '💰', text: 'Payment received - $500', time: 'Yesterday' },
    { icon: '⭐', text: 'Received 5-star review', time: '2 days ago' },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user.name || user.email}
        </h1>
        <p className="text-gray-500 mt-1">Here's what's happening with your projects</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color.split(' ')[1]}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Projects */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-gray-900">My Projects</h2>
            <Link to="/my-projects" className="text-sm text-blue-600 hover:text-blue-700">View All</Link>
          </div>
          <div className="space-y-4">
            {projects.map((project, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{project.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      project.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {project.status}
                    </span>
                    <span className="text-sm text-gray-500">{project.budget}</span>
                  </div>
                </div>
                <div className="w-24">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${project.progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-5">Recent Activity</h2>
          <div className="space-y-4">
            {activities.map((item, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-lg">{item.icon}</span>
                <div>
                  <p className="text-sm text-gray-700">{item.text}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <Link to="/search" className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-blue-300 hover:shadow-sm transition">
          <span className="text-2xl block mb-2">🔍</span>
          <span className="text-sm font-medium text-gray-700">Find Work</span>
        </Link>
        <Link to="/messages" className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-blue-300 hover:shadow-sm transition">
          <span className="text-2xl block mb-2">💬</span>
          <span className="text-sm font-medium text-gray-700">Messages</span>
        </Link>
        <Link to="/my-proposals" className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-blue-300 hover:shadow-sm transition">
          <span className="text-2xl block mb-2">📋</span>
          <span className="text-sm font-medium text-gray-700">My Proposals</span>
        </Link>
        <Link to="/profile" className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-blue-300 hover:shadow-sm transition">
          <span className="text-2xl block mb-2">👤</span>
          <span className="text-sm font-medium text-gray-700">Profile</span>
        </Link>
      </div>
    </div>
  )
}

export default Dashboard
