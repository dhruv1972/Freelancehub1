import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { withUser } from '../services/api'

function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [proposals, setProposals] = useState<any[]>([])
  const navigate = useNavigate()
  const location = useLocation() as any

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
          userApi.get(`/proposals/my/${currentUser._id}`).catch(() => ({ data: [] })),
        ])
        setProjects(projRes.data || [])
        setProposals(propRes.data || [])
      } else {
        const projRes = await userApi.get('/projects/my').catch(() => ({ data: [] }))
        setProjects(projRes.data || [])
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err)
    }
  }

  if (!user) {
    return (
      <div className="page-content">
        <div className="flex items-center justify-center" style={{ padding: '80px 0' }}>
          <p style={{ color: '#999', fontSize: 15 }}>Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const activeProjects = projects.filter((p: any) => p.status === 'in-progress')
  const completedProjects = projects.filter((p: any) => p.status === 'completed')
  const displayName = user.firstName || user.name || user.email?.split('@')[0] || 'there'

  const statColors: Record<string, string> = {
    'Active Projects': '#5eead4',
    'Completed': '#4ade80',
    'Proposals': '#c084fc',
    'Total Projects': '#fbbf24',
  }

  const stats =
    user.userType === 'freelancer'
      ? [
          { label: 'Active Projects', value: String(activeProjects.length) },
          { label: 'Completed', value: String(completedProjects.length) },
          { label: 'Proposals', value: String(proposals.length) },
          { label: 'Total Projects', value: String(projects.length) },
        ]
      : [
          { label: 'Active Projects', value: String(activeProjects.length) },
          { label: 'Completed', value: String(completedProjects.length) },
          { label: 'Total Projects', value: String(projects.length) },
        ]

  const quickActions =
    user.userType === 'freelancer'
      ? [
          { to: '/search', label: 'Find Work', desc: 'Browse and apply to projects', icon: '🔍' },
          { to: '/saved-jobs', label: 'Saved jobs', desc: 'Jobs you saved to apply later', icon: '⭐' },
          { to: '/messages', label: 'Messages', desc: 'Chat with clients or freelancers', icon: '💬' },
          { to: '/my-proposals', label: 'My Proposals', desc: 'Track your submitted proposals', icon: '📋' },
          { to: '/profile', label: 'My Profile', desc: 'Edit your profile and skills', icon: '👤' },
          { to: '/my-time', label: 'My time', desc: 'View and track time on projects', icon: '⏱️' },
        ]
      : [
          { to: '/find-freelancers', label: 'Find Freelancers', desc: 'Search freelancers by skills and hire', icon: '🔍' },
          { to: '/messages', label: 'Messages', desc: 'Chat with clients or freelancers', icon: '💬' },
          { to: '/create-project', label: 'Post Project', desc: 'Create a new project', icon: '➕' },
          { to: '/profile', label: 'My Profile', desc: 'Edit your profile', icon: '👤' },
        ]

  return (
    <div className="page-content">
      {location.state?.projectPosted && (
        <div
          style={{
            marginBottom: 20,
            padding: '12px 16px',
            borderRadius: 10,
            fontSize: 14,
            background: 'rgba(34,197,94,0.12)',
            border: '1px solid rgba(34,197,94,0.4)',
            color: '#4ade80',
          }}
        >
          You posted this project successfully.
        </div>
      )}
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 8 }}>
          Welcome back, {displayName}
        </h1>
        <p style={{ fontSize: 14, color: '#999' }}>
          Here's an overview of your projects and quick links to get things done.
        </p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: 16, marginBottom: 28 }}>
        {stats.map((stat) => (
          <div key={stat.label} className="card" style={{ padding: 28 }}>
            <p style={{ fontSize: 13, color: '#999', marginBottom: 6 }}>{stat.label}</p>
            <p style={{ fontSize: 26, fontWeight: 700, color: statColors[stat.label] }}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3" style={{ gap: 20 }}>
        <div className="lg:col-span-2 card" style={{ padding: 28 }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 17, fontWeight: 600, color: '#fff' }}>Recent Projects</h2>
            <Link to="/my-projects" style={{ fontSize: 13, color: '#5eead4', fontWeight: 500, textDecoration: 'none' }}>
              View all
            </Link>
          </div>
          {projects.length === 0 ? (
            <div style={{ padding: '60px 0', textAlign: 'center' }}>
              <p style={{ color: '#999', marginBottom: 8, fontSize: 15 }}>You don't have any projects yet.</p>
              <p style={{ fontSize: 13, color: '#777', marginBottom: 20 }}>
                {user.userType === 'client' ? 'Post a project to get proposals from freelancers.' : 'Apply to projects from the Find Work page.'}
              </p>
              <Link
                to={user.userType === 'client' ? '/create-project' : '/search'}
                className="btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', height: 44, padding: '0 20px', borderRadius: 10, fontSize: 14, fontWeight: 600 }}
              >
                {user.userType === 'client' ? 'Post a Project' : 'Browse Projects'}
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {projects.slice(0, 5).map((project: any) => (
                <div key={project._id} className="flex items-center justify-between" style={{ padding: 16, background: '#1a1a1a', border: '1px solid #333', borderRadius: 10 }}>
                  <div style={{ minWidth: 0 }}>
                    <Link to={`/project/${project._id}`} style={{ fontWeight: 500, color: '#fff', fontSize: 14, textDecoration: 'none', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {project.title}
                    </Link>
                    <span style={{
                      fontSize: 11,
                      fontWeight: 500,
                      padding: '2px 10px',
                      borderRadius: 20,
                      background: project.status === 'completed' ? 'rgba(74,222,128,0.15)' : project.status === 'in-progress' ? 'rgba(94,234,212,0.15)' : 'rgba(156,163,175,0.15)',
                      color: project.status === 'completed' ? '#4ade80' : project.status === 'in-progress' ? '#5eead4' : '#9ca3af',
                      marginTop: 6,
                      display: 'inline-block',
                    }}>
                      {project.status}
                    </span>
                  </div>
                  <span style={{ fontWeight: 500, color: '#ccc', fontSize: 14, flexShrink: 0, marginLeft: 12 }}>${project.budget}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card" style={{ padding: 28 }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, color: '#fff', marginBottom: 18 }}>Quick Actions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {quickActions.map((action) => (
              <Link
                key={action.to}
                to={action.to}
                className="flex items-center"
                style={{ gap: 14, padding: '12px 10px', borderRadius: 10, textDecoration: 'none', transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <span style={{ fontSize: 22 }} aria-hidden>{action.icon}</span>
                <div style={{ minWidth: 0 }}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: '#fff', display: 'block' }}>{action.label}</span>
                  <span style={{ fontSize: 12, color: '#777' }}>{action.desc}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
