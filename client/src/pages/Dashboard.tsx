import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { withUser } from '../services/api'

function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [proposals, setProposals] = useState<any[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      navigate('/login')
      return
    }
    const parsed = JSON.parse(userData)
    setUser(parsed)
    loadData(parsed)
  }, [navigate])

  const loadData = async (currentUser: any) => {
    try {
      const userApi = withUser(currentUser.email)
      
      if (currentUser.userType === 'freelancer') {
        const [projRes, propRes] = await Promise.all([
          userApi.get('/projects/my').catch(() => ({ data: [] })),
          userApi.get('/proposals/my').catch(() => ({ data: [] })),
        ])
        setProjects(projRes.data || [])
        setProposals(propRes.data || [])
      } else {
        const projRes = await userApi.get('/projects?status=all').catch(() => ({ data: { projects: [] } }))
        setProjects(projRes.data?.projects || projRes.data || [])
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err)
    }
  }

  if (!user) return <div className="p-8 text-center text-gray-500">Loading...</div>

  const activeProjects = projects.filter((p: any) => p.status === 'in-progress')
  const completedProjects = projects.filter((p: any) => p.status === 'completed')

  const stats = [
    { label: 'Active Projects', value: String(activeProjects.length), color: 'text-blue-600' },
    { label: 'Completed', value: String(completedProjects.length), color: 'text-green-600' },
    { label: 'Proposals', value: String(proposals.length), color: 'text-purple-600' },
    { label: 'Total Projects', value: String(projects.length), color: 'text-orange-600' },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user.firstName || user.name || user.email}
        </h1>
        <p className="text-gray-500 mt-1">Here's what's happening with your projects</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-gray-900">My Projects</h2>
            <Link to="/my-projects" className="text-sm text-blue-600 hover:text-blue-700">View All</Link>
          </div>
          {projects.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No projects yet</p>
          ) : (
            <div className="space-y-3">
              {projects.slice(0, 5).map((project: any) => (
                <div key={project._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{project.title}</h3>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      project.status === 'completed' ? 'bg-green-100 text-green-700' :
                      project.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <span className="font-medium text-gray-700">${project.budget}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-5">Quick Actions</h2>
          <div className="space-y-2">
            <Link to="/search" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition">
              <span className="text-xl">🔍</span>
              <span className="text-sm font-medium text-gray-700">Find Work</span>
            </Link>
            <Link to="/messages" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition">
              <span className="text-xl">💬</span>
              <span className="text-sm font-medium text-gray-700">Messages</span>
            </Link>
            <Link to="/my-proposals" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition">
              <span className="text-xl">📋</span>
              <span className="text-sm font-medium text-gray-700">My Proposals</span>
            </Link>
            <Link to="/profile" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition">
              <span className="text-xl">👤</span>
              <span className="text-sm font-medium text-gray-700">Profile</span>
            </Link>
            {user.userType === 'client' && (
              <Link to="/create-project" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition">
                <span className="text-xl">➕</span>
                <span className="text-sm font-medium text-gray-700">Post Project</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
