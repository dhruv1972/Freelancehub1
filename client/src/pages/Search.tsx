import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../services/api'

function Search() {
  const [searchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q') ?? '')
  const [category, setCategory] = useState(() => searchParams.get('category') ?? '')
  const [skillsFilter, setSkillsFilter] = useState('')
  const [minBudget] = useState('')
  const [maxBudget] = useState('')
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())

  const categories = ['Web Development', 'Mobile Apps', 'UI/UX Design', 'Data Science', 'DevOps', 'Writing', 'Marketing']

  // Sync URL query params to state when URL changes (e.g. from Home category click)
  useEffect(() => {
    setCategory(searchParams.get('category') ?? '')
    setSearchQuery(searchParams.get('q') ?? '')
  }, [searchParams])

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) setUser(JSON.parse(userData))
  }, [])

  useEffect(() => {
    const params: any = {}
    if (searchQuery) params.q = searchQuery
    if (category) params.category = category
    if (skillsFilter) params.skills = skillsFilter
    if (minBudget) params.minBudget = minBudget
    if (maxBudget) params.maxBudget = maxBudget

    setLoading(true)
    api.get('/projects', { params })
      .then(res => setProjects(res.data?.projects || res.data || []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false))
  }, [category, searchQuery, skillsFilter, minBudget, maxBudget])

  useEffect(() => {
    if (user?._id && user?.userType === 'freelancer') {
      api.get(`/saved-jobs/${user._id}/ids`).then(res => {
        const ids = Array.isArray(res.data) ? res.data : []
        setSavedIds(new Set(ids.map((id: any) => String(id))))
      }).catch(() => setSavedIds(new Set()))
    }
  }, [user?._id, user?.userType])

  const loadProjects = async () => {
    setLoading(true)
    try {
      const params: any = {}
      if (searchQuery) params.q = searchQuery
      if (category) params.category = category
      if (skillsFilter) params.skills = skillsFilter
      if (minBudget) params.minBudget = minBudget
      if (maxBudget) params.maxBudget = maxBudget
      const res = await api.get('/projects', { params })
      setProjects(res.data?.projects || res.data || [])
    } catch (err) {
      console.error('Failed to load projects:', err)
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    loadProjects()
  }

  const toggleSave = async (projectId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user?._id || user?.userType !== 'freelancer') return
    const isSaved = savedIds.has(projectId)
    try {
      if (isSaved) {
        await api.delete(`/saved-jobs/${user._id}/${projectId}`)
        setSavedIds(prev => { const n = new Set(prev); n.delete(projectId); return n })
      } else {
        await api.post('/saved-jobs', { userId: user._id, projectId })
        setSavedIds(prev => new Set(prev).add(projectId))
      }
    } catch (err) {
      console.error('Failed to toggle save', err)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: 48,
    fontSize: 15,
    padding: '0 16px',
    background: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: 10,
    color: '#fff',
    outline: 'none',
  }

  return (
    <div className="page-content">
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Browse Projects</h1>
        <p style={{ fontSize: 14, color: '#999' }}>Search by keyword, category, and skills to find projects that match you.</p>
      </header>

      <form onSubmit={handleSearch} className="card" style={{ padding: 20, marginBottom: 24 }}>
        <div className="grid md:grid-cols-4" style={{ gap: 12, marginBottom: 12 }}>
          <div className="md:col-span-2">
            <label htmlFor="search-query" className="sr-only">Search</label>
            <input
              id="search-query"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={inputStyle}
              placeholder="e.g. React, logo design, mobile app..."
            />
          </div>
          <div>
            <label htmlFor="search-category" className="sr-only">Category</label>
            <select id="search-category" value={category} onChange={(e) => setCategory(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="">All categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn-primary" style={{ height: 48, borderRadius: 10, fontSize: 15, fontWeight: 600 }}>
            Search
          </button>
        </div>
        <div className="grid md:grid-cols-3" style={{ gap: 12 }}>
          <div>
            <label htmlFor="search-skills" className="sr-only">Skills</label>
            <input
              id="search-skills"
              type="text"
              value={skillsFilter}
              onChange={(e) => setSkillsFilter(e.target.value)}
              style={inputStyle}
              placeholder="Skills (comma separated, e.g. React, Node.js)"
            />
          </div>
        </div>
      </form>

      {loading ? (
        <div className="flex flex-col items-center justify-center" style={{ padding: '60px 0' }}>
          <p style={{ color: '#999', marginBottom: 12, fontSize: 15 }}>Loading projects...</p>
          <div style={{ width: 32, height: 32, border: '2px solid #5eead4', borderTopColor: 'transparent', borderRadius: '50%' }} className="animate-spin" />
        </div>
      ) : projects.length === 0 ? (
        <div className="card" style={{ padding: 60, textAlign: 'center' }}>
          <p style={{ color: '#ccc', fontSize: 17, fontWeight: 500, marginBottom: 8 }}>No projects found</p>
          <p style={{ color: '#777', fontSize: 14, marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>
            Try a different keyword or category, or clear the search to see all projects.
          </p>
          <button
            type="button"
            onClick={() => { setSearchQuery(''); setCategory(''); loadProjects(); }}
            className="btn-primary"
            style={{ height: 44, padding: '0 20px', borderRadius: 10, fontSize: 14, fontWeight: 600 }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <p style={{ fontSize: 13, color: '#999', marginBottom: 16 }}>
            {projects.length} {projects.length === 1 ? 'project' : 'projects'} found
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {projects.map((project: any) => (
              <div key={project._id} className="card" style={{ padding: 24, transition: 'border-color 0.15s' }}>
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
                    {user?.userType === 'freelancer' && (
                      <button
                        type="button"
                        onClick={(e) => toggleSave(project._id, e)}
                        title={savedIds.has(project._id) ? 'Remove from saved' : 'Save for later'}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 42,
                          height: 42,
                          borderRadius: 10,
                          border: '1px solid #333',
                          background: savedIds.has(project._id) ? 'rgba(251,191,36,0.15)' : 'transparent',
                          color: savedIds.has(project._id) ? '#fbbf24' : '#9ca3af',
                          cursor: 'pointer',
                          fontSize: 18,
                        }}
                      >
                        {savedIds.has(project._id) ? '★' : '☆'}
                      </button>
                    )}
                    <Link
                      to={`/project/${project._id}`}
                      className="btn-primary"
                      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: 42, padding: '0 18px', borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}
                    >
                      View details
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

export default Search
