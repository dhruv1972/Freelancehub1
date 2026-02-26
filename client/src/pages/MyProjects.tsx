import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { withUser } from '../services/api'

function MyProjects() {
  const [user, setUser] = useState<any>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      navigate('/login')
      return
    }
    const parsed = JSON.parse(userData)
    setUser(parsed)
    loadProjects(parsed)
  }, [navigate])

  const loadProjects = async (currentUser: any) => {
    try {
      const userApi = withUser(currentUser.email)
      const res = await userApi.get('/projects/my')
      setProjects(res.data || [])
    } catch (err) {
      console.error('Failed to load projects:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return <div className="p-8 text-center text-gray-500">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Projects</h1>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <p className="text-gray-400 mb-4">No active projects yet</p>
          <Link to="/search" className="text-blue-600 hover:text-blue-700 font-medium text-sm">Find Projects</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project: any) => (
            <div key={project._id} className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <Link to={`/project/${project._id}`} className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                    {project.title}
                  </Link>
                  <p className="text-sm text-gray-500">
                    Client: {project.clientId?.firstName} {project.clientId?.lastName}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                  project.status === 'completed' ? 'bg-green-100 text-green-700' :
                  project.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {project.status}
                </span>
              </div>

              <p className="text-gray-500 text-sm mb-4">{project.description?.slice(0, 120)}...</p>

              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">${project.budget}</span>
                <div className="flex gap-3">
                  <Link to={`/messages`} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Message Client
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyProjects
