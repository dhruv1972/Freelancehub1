import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { withUser } from '../services/api'

type Filter = 'all' | 'ongoing' | 'completed'

function MyProjects() {
  const [user, setUser] = useState<any>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>('ongoing')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
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

  const filteredProjects =
    filter === 'ongoing'
      ? projects.filter((p: any) => p.status === 'in-progress' || p.status === 'open')
      : filter === 'completed'
        ? projects.filter((p: any) => p.status === 'completed')
        : projects

  const handleUpdateStatus = async (projectId: string, status: string) => {
    if (!user) return
    setUpdatingId(projectId)
    try {
      const userApi = withUser(user.email)
      await userApi.put(`/projects/${projectId}`, { status })
      await loadProjects(user)
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update project')
    } finally {
      setUpdatingId(null)
    }
  }

  const getStatusStyle = (status: string): React.CSSProperties => {
    switch (status) {
      case 'completed': return { background: 'rgba(74,222,128,0.15)', color: '#4ade80' }
      case 'in-progress': return { background: 'rgba(94,234,212,0.15)', color: '#5eead4' }
      default: return { background: 'rgba(156,163,175,0.15)', color: '#9ca3af' }
    }
  }

  if (!user) return (
    <div className="page-content">
      <div style={{ padding: '80px 0', textAlign: 'center', color: '#999', fontSize: 15 }}>Loading...</div>
    </div>
  )

  return (
    <div className="page-content" style={{ maxWidth: 960 }}>
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 8 }}>My Projects</h1>
        <p style={{ fontSize: 14, color: '#999' }}>
          {user?.userType === 'freelancer'
            ? 'View and manage your ongoing work. Message clients and mark projects complete when done.'
            : 'Projects you\'re working on or have completed. Use Messages to communicate with your client or freelancer.'}
        </p>
      </header>

      {!loading && projects.length > 0 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {(['ongoing', 'completed', 'all'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              style={{
                padding: '8px 16px',
                borderRadius: 10,
                border: '1px solid #333',
                background: filter === f ? 'rgba(94,234,212,0.15)' : '#1a1a1a',
                color: filter === f ? '#5eead4' : '#9ca3af',
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {f === 'ongoing' ? 'Ongoing' : f === 'completed' ? 'Completed' : 'All'}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0' }}>
          <p style={{ color: '#999', marginBottom: 12, fontSize: 15 }}>Loading your projects...</p>
          <div style={{ width: 32, height: 32, border: '2px solid #5eead4', borderTopColor: 'transparent', borderRadius: '50%' }} className="animate-spin" />
        </div>
      ) : projects.length === 0 ? (
        <div className="card" style={{ padding: 60, textAlign: 'center' }}>
          <p style={{ color: '#ccc', fontSize: 17, fontWeight: 500, marginBottom: 8 }}>No projects yet</p>
          <p style={{ color: '#777', fontSize: 14, marginBottom: 24 }}>
            {user?.userType === 'client' ? 'Post a project to receive proposals from freelancers.' : 'When a client accepts your proposal, the project will appear here.'}
          </p>
          <Link
            to={user?.userType === 'client' ? '/create-project' : '/search'}
            className="btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', height: 44, padding: '0 20px', borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}
          >
            {user?.userType === 'client' ? 'Post a project' : 'Browse projects'}
          </Link>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <p style={{ color: '#9ca3af', fontSize: 15 }}>
            {filter === 'ongoing' ? 'No ongoing projects.' : filter === 'completed' ? 'No completed projects yet.' : 'No projects.'}
          </p>
          <p style={{ color: '#6b7280', fontSize: 13, marginTop: 8 }}>Switch tabs or check back later.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filteredProjects.map((project: any) => (
            <div key={project._id} className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div style={{ minWidth: 0 }}>
                  <Link to={`/project/${project._id}`} style={{ fontSize: 17, fontWeight: 600, color: '#fff', textDecoration: 'none', display: 'block', marginBottom: 4 }}>
                    {project.title}
                  </Link>
                  <p style={{ fontSize: 13, color: '#999' }}>
                    Client: {project.clientId?.firstName} {project.clientId?.lastName}
                  </p>
                </div>
                <span style={{
                  padding: '4px 14px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 500,
                  textTransform: 'capitalize',
                  flexShrink: 0,
                  marginLeft: 12,
                  ...getStatusStyle(project.status),
                }}>
                  {project.status}
                </span>
              </div>

              <p style={{ color: '#999', fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>
                {project.description?.slice(0, 120)}...
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 500, color: '#fff', fontSize: 15 }}>${project.budget}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {user?.userType === 'freelancer' && project.status === 'in-progress' && (
                    <button
                      type="button"
                      disabled={updatingId === project._id}
                      onClick={() => handleUpdateStatus(project._id, 'completed')}
                      className="btn-primary"
                      style={{
                        padding: '6px 14px',
                        borderRadius: 10,
                        fontSize: 13,
                        fontWeight: 600,
                        opacity: updatingId === project._id ? 0.6 : 1,
                      }}
                    >
                      {updatingId === project._id ? 'Updating...' : 'Mark as complete'}
                    </button>
                  )}
                  <Link
                    to={user?.userType === 'client' && project.selectedFreelancer
                      ? `/messages?withUserId=${project.selectedFreelancer}`
                      : project.clientId?._id
                        ? `/messages?withUserId=${project.clientId._id}`
                        : '/messages'}
                    style={{ color: '#5eead4', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}
                  >
                    {user?.userType === 'client' ? 'Message Freelancer' : 'Message Client'}
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
