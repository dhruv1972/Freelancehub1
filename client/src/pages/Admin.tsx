import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Admin() {
  const [activeTab, setActiveTab] = useState('users')
  const navigate = useNavigate()

  // sample users data (TODO: fetch from API)
  const [users] = useState([
    { _id: 'u1', firstName: 'John', lastName: 'Smith', email: 'john@test.com', userType: 'client', status: 'active', createdAt: '2026-01-15' },
    { _id: 'u2', firstName: 'Sarah', lastName: 'Johnson', email: 'sarah@test.com', userType: 'freelancer', status: 'active', createdAt: '2026-01-16' },
    { _id: 'u3', firstName: 'Mike', lastName: 'Davis', email: 'mike@test.com', userType: 'freelancer', status: 'suspended', createdAt: '2026-01-18' },
    { _id: 'u4', firstName: 'Emily', lastName: 'Brown', email: 'emily@test.com', userType: 'client', status: 'active', createdAt: '2026-01-20' },
  ])

  // sample projects data
  const [projects] = useState([
    { _id: 'p1', title: 'E-commerce Website', budget: 2000, status: 'in-progress', category: 'Web Development', client: 'John Smith' },
    { _id: 'p2', title: 'Mobile App Design', budget: 1000, status: 'open', category: 'UI/UX Design', client: 'Emily Brown' },
    { _id: 'p3', title: 'Portfolio Website', budget: 500, status: 'completed', category: 'Web Development', client: 'John Smith' },
  ])

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      navigate('/login')
      return
    }
    // TODO: check if user is admin
  }, [navigate])

  const handleSuspend = (userId: string) => {
    // TODO: call API
    alert('User ' + userId + ' suspended')
  }

  const handleActivate = (userId: string) => {
    // TODO: call API
    alert('User ' + userId + ' activated')
  }

  return (
    <div className="max-w-6xl mx-auto p-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-600 text-sm">Total Users</p>
          <p className="text-2xl font-bold">{users.length}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-600 text-sm">Total Projects</p>
          <p className="text-2xl font-bold">{projects.length}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-600 text-sm">Active Users</p>
          <p className="text-2xl font-bold">{users.filter(u => u.status === 'active').length}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-600 text-sm">Open Projects</p>
          <p className="text-2xl font-bold">{projects.filter(p => p.status === 'open').length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`px-4 py-2 rounded ${activeTab === 'projects' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Projects
        </button>
      </div>

      {/* Users Table */}
      {activeTab === 'users' && (
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 text-sm font-medium">Name</th>
                <th className="text-left p-3 text-sm font-medium">Email</th>
                <th className="text-left p-3 text-sm font-medium">Type</th>
                <th className="text-left p-3 text-sm font-medium">Status</th>
                <th className="text-left p-3 text-sm font-medium">Joined</th>
                <th className="text-left p-3 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} className="border-t">
                  <td className="p-3">{user.firstName} {user.lastName}</td>
                  <td className="p-3 text-gray-600">{user.email}</td>
                  <td className="p-3 capitalize">{user.userType}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-3 text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="p-3">
                    {user.status === 'active' ? (
                      <button
                        onClick={() => handleSuspend(user._id)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Suspend
                      </button>
                    ) : (
                      <button
                        onClick={() => handleActivate(user._id)}
                        className="text-green-600 hover:underline text-sm"
                      >
                        Activate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Projects Table */}
      {activeTab === 'projects' && (
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 text-sm font-medium">Title</th>
                <th className="text-left p-3 text-sm font-medium">Client</th>
                <th className="text-left p-3 text-sm font-medium">Category</th>
                <th className="text-left p-3 text-sm font-medium">Budget</th>
                <th className="text-left p-3 text-sm font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(project => (
                <tr key={project._id} className="border-t">
                  <td className="p-3 font-medium">{project.title}</td>
                  <td className="p-3 text-gray-600">{project.client}</td>
                  <td className="p-3">{project.category}</td>
                  <td className="p-3">${project.budget}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      project.status === 'open' ? 'bg-green-100 text-green-700' :
                      project.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {project.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Admin

