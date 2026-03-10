import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../services/api'

function MyTime() {
  const [user, setUser] = useState<any>(null)
  const [entries, setEntries] = useState<any[]>([])
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
    if (parsed?.userType !== 'freelancer') {
      navigate('/dashboard')
      return
    }
    loadEntries(parsed._id)
  }, [navigate])

  const loadEntries = async (freelancerId: string) => {
    setLoading(true)
    try {
      const res = await api.get(`/time/user/${freelancerId}`)
      setEntries(Array.isArray(res.data) ? res.data : [])
    } catch {
      setEntries([])
    } finally {
      setLoading(false)
    }
  }

  const totalMinutes = entries.reduce((sum, e) => sum + (e.durationMinutes || 0), 0)

  if (!user) return null
  if (user.userType !== 'freelancer') return null

  return (
    <div className="page-content" style={{ maxWidth: 800 }}>
      <header style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 8 }}>My time</h1>
        <p style={{ fontSize: 14, color: '#999' }}>
          All time you've logged across projects. Log time from each project's page when you're the assigned freelancer.
        </p>
      </header>

      {loading ? (
        <div style={{ padding: '60px 0', textAlign: 'center', color: '#9ca3af' }}>Loading...</div>
      ) : (
        <>
          <div className="card" style={{ padding: 20, marginBottom: 24 }}>
            <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 4 }}>Total time logged</p>
            <p style={{ fontSize: 24, fontWeight: 700, color: '#5eead4' }}>
              {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
            </p>
          </div>

          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: 16 }}>Entries</h2>
          {entries.length === 0 ? (
            <div className="card" style={{ padding: 40, textAlign: 'center' }}>
              <p style={{ color: '#9ca3af', marginBottom: 12 }}>No time entries yet.</p>
              <p style={{ fontSize: 13, color: '#777', marginBottom: 16 }}>
                Open a project you're assigned to and use the time tracker there to log time.
              </p>
              <Link to="/my-projects" className="btn-primary" style={{ display: 'inline-flex', padding: '10px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
                My Projects
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {entries.map((entry) => (
                <div
                  key={entry._id}
                  className="card"
                  style={{
                    padding: 16,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 12,
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 500, color: '#e5e7eb' }}>
                      {entry.description || 'No description'}
                    </p>
                    <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>
                      {new Date(entry.startTime).toLocaleString()}
                      {entry.projectId?.title && (
                        <>
                          {' · '}
                          <Link to={`/project/${entry.projectId._id || entry.projectId}`} style={{ color: '#5eead4', textDecoration: 'none' }}>
                            {entry.projectId.title}
                          </Link>
                        </>
                      )}
                    </p>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#5eead4', flexShrink: 0 }}>
                    {entry.durationMinutes != null
                      ? `${Math.floor(entry.durationMinutes / 60)}h ${entry.durationMinutes % 60}m`
                      : 'In progress'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default MyTime
