import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'

function Admin() {
  const [activeTab, setActiveTab] = useState('users')
  const [users, setUsers] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [loadingProjects, setLoadingProjects] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) { navigate('/login'); return }
    const parsed = JSON.parse(userData)
    if (!parsed.isAdmin) { navigate('/dashboard'); return }
    loadUsers()
    loadProjects()
  }, [navigate])

  const loadUsers = async () => {
    setLoadingUsers(true)
    try {
      const res = await api.get('/admin/users')
      setUsers(res.data || [])
    } catch (err) {
      console.error('Failed to load users:', err)
    } finally {
      setLoadingUsers(false)
    }
  }

  const loadProjects = async () => {
    setLoadingProjects(true)
    try {
      const res = await api.get('/admin/projects')
      setProjects(res.data || [])
    } catch (err) {
      console.error('Failed to load projects:', err)
    } finally {
      setLoadingProjects(false)
    }
  }

  const handleSuspend = async (userId: string) => {
    try {
      await api.post(`/admin/users/${userId}/suspend`)
      loadUsers()
    } catch (err) {
      console.error('Failed to suspend user:', err)
    }
  }

  const handleActivate = async (userId: string) => {
    try {
      await api.post(`/admin/users/${userId}/activate`)
      loadUsers()
    } catch (err) {
      console.error('Failed to activate user:', err)
    }
  }

  const activeUsers = users.filter(u => u.status !== 'suspended')
  const openProjects = projects.filter(p => p.status === 'open')

  const tabStyle = (tab: string): React.CSSProperties => ({
    padding: '10px 20px',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    border: activeTab === tab ? '1px solid rgba(94,234,212,0.3)' : '1px solid #404040',
    background: activeTab === tab ? 'rgba(94,234,212,0.1)' : '#252525',
    color: activeTab === tab ? '#5eead4' : '#999',
    transition: 'all 0.15s',
  })

  return (
    <div className="page-content">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 6 }}>Admin Dashboard</h1>
        <p style={{ fontSize: 14, color: '#999' }}>Manage users, projects, and platform activity.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Total Users', value: users.length, color: '#5eead4' },
          { label: 'Total Projects', value: projects.length, color: '#a78bfa' },
          { label: 'Active Users', value: activeUsers.length, color: '#34d399' },
          { label: 'Open Projects', value: openProjects.length, color: '#fbbf24' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '20px 24px' }}>
            <p style={{ fontSize: 13, color: '#999', marginBottom: 4 }}>{s.label}</p>
            <p style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{loadingUsers || loadingProjects ? '—' : s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        <button onClick={() => setActiveTab('users')} style={tabStyle('users')}>Users ({users.length})</button>
        <button onClick={() => setActiveTab('projects')} style={tabStyle('projects')}>Projects ({projects.length})</button>
      </div>

      {/* Users Table */}
      {activeTab === 'users' && (
        <div className="card" style={{ overflow: 'hidden' }}>
          {loadingUsers ? (
            <div style={{ padding: 48, textAlign: 'center', color: '#999', fontSize: 14 }}>Loading users...</div>
          ) : users.length === 0 ? (
            <div style={{ padding: 48, textAlign: 'center', color: '#999', fontSize: 14 }}>No users registered yet.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#2d2d2d' }}>
                    {['Name', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#999' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id} style={{ borderTop: '1px solid #333' }}>
                      <td style={{ padding: '14px 16px', fontSize: 14, color: '#fff', fontWeight: 500 }}>{user.firstName} {user.lastName}</td>
                      <td style={{ padding: '14px 16px', fontSize: 14, color: '#999' }}>{user.email}</td>
                      <td style={{ padding: '14px 16px', fontSize: 14, color: '#999', textTransform: 'capitalize' }}>{user.userType}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 600,
                          background: user.status === 'suspended' ? 'rgba(239,68,68,0.15)' : 'rgba(52,211,153,0.15)',
                          color: user.status === 'suspended' ? '#f87171' : '#34d399',
                        }}>
                          {user.status || 'active'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 14, color: '#999' }}>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</td>
                      <td style={{ padding: '14px 16px' }}>
                        {user.status === 'suspended' ? (
                          <button onClick={() => handleActivate(user._id)} style={{ fontSize: 13, color: '#34d399', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Activate</button>
                        ) : (
                          <button onClick={() => handleSuspend(user._id)} style={{ fontSize: 13, color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Suspend</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Projects Table */}
      {activeTab === 'projects' && (
        <div className="card" style={{ overflow: 'hidden' }}>
          {loadingProjects ? (
            <div style={{ padding: 48, textAlign: 'center', color: '#999', fontSize: 14 }}>Loading projects...</div>
          ) : projects.length === 0 ? (
            <div style={{ padding: 48, textAlign: 'center', color: '#999', fontSize: 14 }}>No projects created yet.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#2d2d2d' }}>
                    {['Title', 'Client', 'Category', 'Budget', 'Status'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#999' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {projects.map(project => (
                    <tr key={project._id} style={{ borderTop: '1px solid #333' }}>
                      <td style={{ padding: '14px 16px', fontSize: 14, color: '#fff', fontWeight: 500 }}>{project.title}</td>
                      <td style={{ padding: '14px 16px', fontSize: 14, color: '#999' }}>
                        {project.clientId?.firstName} {project.clientId?.lastName}
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 14, color: '#999' }}>{project.category}</td>
                      <td style={{ padding: '14px 16px', fontSize: 14, color: '#fff', fontWeight: 500 }}>${project.budget}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 600,
                          background: project.status === 'open' ? 'rgba(52,211,153,0.15)' :
                                     project.status === 'in-progress' ? 'rgba(94,234,212,0.15)' :
                                     'rgba(156,163,175,0.15)',
                          color: project.status === 'open' ? '#34d399' :
                                 project.status === 'in-progress' ? '#5eead4' :
                                 '#9ca3af',
                        }}>
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
      )}
    </div>
  )
}

export default Admin
