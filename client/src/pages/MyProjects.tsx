import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function MyProjects() {
  const [user, setUser] = useState<any>(null)
  const navigate = useNavigate()

  // sample projects data (TODO: fetch from API)
  const [projects] = useState([
    {
      _id: 'p1',
      title: 'E-commerce Website Development',
      description: 'Building an online store with React and Node.js',
      budget: 2000,
      status: 'in-progress',
      client: { firstName: 'John', lastName: 'Smith' },
      progress: 45
    },
    {
      _id: 'p2',
      title: 'Mobile App UI Design',
      description: 'Creating UI mockups for a fitness tracking app',
      budget: 1000,
      status: 'in-progress',
      client: { firstName: 'Sarah', lastName: 'Johnson' },
      progress: 80
    },
    {
      _id: 'p3',
      title: 'Portfolio Website',
      description: 'Personal portfolio site with blog functionality',
      budget: 500,
      status: 'completed',
      client: { firstName: 'Mike', lastName: 'Davis' },
      progress: 100
    }
  ])

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      navigate('/login')
      return
    }
    setUser(JSON.parse(userData))
  }, [navigate])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700'
      case 'in-progress': return 'bg-blue-100 text-blue-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const handleStatusUpdate = (projectId: string, newStatus: string) => {
    // TODO: update via API
    alert(`Project ${projectId} status updated to: ${newStatus}`)
  }

  if (!user) return <div className="p-8">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto p-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Projects</h1>

      {projects.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-500 mb-4">You don't have any active projects</p>
          <Link to="/search" className="text-blue-600 hover:underline">
            Find Projects
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map(project => (
            <div key={project._id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <Link 
                    to={`/project/${project._id}`}
                    className="text-lg font-semibold hover:text-blue-600"
                  >
                    {project.title}
                  </Link>
                  <p className="text-sm text-gray-500">
                    Client: {project.client.firstName} {project.client.lastName}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded text-sm capitalize ${getStatusColor(project.status)}`}>
                  {project.status.replace('-', ' ')}
                </span>
              </div>

              <p className="text-gray-600 mb-4">{project.description}</p>

              {/* Progress bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium">${project.budget}</span>
                
                {project.status === 'in-progress' && (
                  <div className="flex gap-2">
                    <Link 
                      to={`/messages`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Message Client
                    </Link>
                    <button
                      onClick={() => handleStatusUpdate(project._id, 'completed')}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                    >
                      Mark Complete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyProjects

