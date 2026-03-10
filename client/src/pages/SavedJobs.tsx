import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../services/api'

function SavedJobs() {
  const [user, setUser] = useState<any>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const navigate = useNavigate()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      navigate('/login')
      return
    }
    const parsed = JSON.parse(userData)
    setUser(parsed)
    if (parsed.userType !== 'freelancer') {
      navigate('/dashboard')
      return
    }
    loadSaved()
  }, [navigate])

  const loadSaved = async () => {
    const userData = localStorage.getItem('user')
    if (!userData) return
    const parsed = JSON.parse(userData)
    setLoading(true)
    try {
      const res = await api.get(`/saved-jobs/${parsed._id}`)
      const list = Array.isArray(res.data) ? res.data : []
      setProjects(list)
      setSavedIds(new Set(list.map((p: any) => String(p._id))))
    } catch (err) {
      setProjects([])
      setSavedIds(new Set())
    } finally {
      setLoading(false)
    }
  }

  const toggleSave = async (projectId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user?._id) return
    const isSaved = savedIds.has(projectId)
    try {
      if (isSaved) {
        await api.delete(`/saved-jobs/${user._id}/${projectId}`)
        setSavedIds(prev => { const n = new Set(prev); n.delete(projectId); return n })
        setProjects(prev => prev.filter(p => String(p._id) !== projectId))
      }
    } catch (err) {
      console.error('Failed to remove from saved', err)
    }
  }

  if (!user) {
    return (
      <div className="page-content">
        <div style={{ padding: '80px 0', textAlign: 'center', color: '#999', fontSize: 15 }}>Loading...</div>
      </div>
    )
  }

  if (user.userType !== 'freelancer') {
    return null
  }

  return (
    <div className="page-content">
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Saved jobs</h1>
        <p style={{ fontSize: 14, color: '#999' }}>
          Jobs you saved for later. Apply when you're ready.
        </p>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center" style={{ padding: '60px 0' }}>
          <p style={{ color: '#999', marginBottom: 12, fontSize: 15 }}>Loading saved jobs...</p>
          <div style={{ width: 32, height: 32, border: '2px solid #5eead4', borderTopColor: 'transparent', borderRadius: '50%' }} className="animate-spin" />
        </div>
      ) : projects.length === 0 ? (
        <div className="card" style={{ padding: 60, textAlign: 'center' }}>
          <p style={{ color: '#ccc', fontSize: 17, fontWeight: 500, marginBottom: 8 }}>No saved jobs yet</p>
          <p style={{ color: '#777', fontSize: 14, marginBottom: 24 }}>
            When you browse projects, click the star to save them here and apply later.
          </p>
          <Link
            to="/search"
            className="btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', height: 44, padding: '0 20px', borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}
          >
            Browse projects
          </Link>
        </div>
      ) : (
        <>
          <p style={{ fontSize: 13, color: '#999', marginBottom: 16 }}>
            {projects.length} saved {projects.length === 1 ? 'job' : 'jobs'}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {projects.map((project: any) => (
              <div key={project._id} className="card" style={{ padding: 24 }}>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between" style={{ gap: 16 }}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <Link to={`/project/${project._id}`} style={{ fontSize: 17, fontWeight: 600, color: '#fff', textDecoration: 'none', display: 'block', marginBottom: 8 }}>
                      {project.title}
                    </Link>
                    <p style={{ color: '#999', fontSize: 14, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {project.description || 'No description.'}
                    </p>
                    {project.requirements?.length > 0 && (
                      <div className="flex flex-wrap" style={{ gap: 8, marginTop: 12 }}>
                        {project.requirements.map((skill: string, i: number) => (
                          <span key={i} style={{ background: '#333', color: '#999', padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 500 }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex flex-wrap items-center" style={{ gap: 16, marginTop: 14, fontSize: 14 }}>
                      <span style={{ fontWeight: 600, color: '#fff' }}>${project.budget}</span>
                      {project.category && (
                        <span style={{ background: 'rgba(94,234,212,0.1)', color: '#5eead4', padding: '2px 10px', borderRadius: 4, fontSize: 12 }}>
                          {project.category}
                        </span>
                      )}
                      {project.timeline && <span style={{ color: '#999' }}>{project.timeline}</span>}
                    </div>
                  </div>
                  <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button
                      type="button"
                      onClick={(e) => toggleSave(project._id, e)}
                      title="Remove from saved"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 42,
                        height: 42,
                        borderRadius: 10,
                        border: '1px solid #333',
                        background: 'rgba(251,191,36,0.15)',
                        color: '#fbbf24',
                        cursor: 'pointer',
                        fontSize: 18,
                      }}
                    >
                      ★
                    </button>
                    <Link
                      to={`/project/${project._id}`}
                      className="btn-primary"
                      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: 42, padding: '0 18px', borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}
                    >
                      View & apply
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default SavedJobs
