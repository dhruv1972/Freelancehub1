import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { withUser } from '../services/api'

function CreateProject() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [budget, setBudget] = useState('')
  const [timeline, setTimeline] = useState('')
  const [location, setLocation] = useState('')
  const [requirements, setRequirements] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [user, setUser] = useState<any>(null)

  const navigate = useNavigate()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      navigate('/login')
      return
    }
    setUser(JSON.parse(userData))
  }, [navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!user || !user._id) {
      setError('Your session expired. Please sign in again.')
      return
    }
    setLoading(true)

    try {
      const userApi = withUser(user.email)
      await userApi.post('/projects', {
        clientId: user._id,
        title,
        description,
        category,
        budget: Number(budget),
        timeline,
        location,
        requirements: requirements.split(',').map(s => s.trim()).filter(Boolean)
      })
      navigate('/dashboard', { state: { projectPosted: true } })
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  const categories = ['Web Development', 'Mobile Apps', 'UI/UX Design', 'Data Science', 'DevOps', 'Writing', 'Marketing', 'Other']

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

  const textareaStyle: React.CSSProperties = {
    width: '100%',
    fontSize: 15,
    padding: '14px 16px',
    background: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: 10,
    color: '#fff',
    outline: 'none',
    resize: 'vertical',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 14,
    fontWeight: 500,
    color: '#ccc',
    marginBottom: 8,
  }

  return (
    <div className="page-content" style={{ maxWidth: 720 }}>
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Post a new project</h1>
        <p style={{ fontSize: 14, color: '#999' }}>Describe your project, set a budget and timeline, and list the skills you need. Freelancers will send you proposals.</p>
      </header>

      {error && (
        <div style={{
          padding: '12px 16px',
          borderRadius: 10,
          fontSize: 14,
          marginBottom: 24,
          background: 'rgba(248,113,113,0.08)',
          color: '#f87171',
          border: '1px solid rgba(248,113,113,0.25)',
        }} role="alert">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="card" style={{ padding: 32 }}>
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Project Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} placeholder="e.g. Build a React Dashboard" required />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} style={textareaStyle} placeholder="Describe your project in detail..." required />
        </div>
        <div className="grid md:grid-cols-2" style={{ gap: 20, marginBottom: 20 }}>
          <div>
            <label style={labelStyle}>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }} required>
              <option value="">Select category</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Budget ($)</label>
            <input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} style={inputStyle} placeholder="500" required />
          </div>
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Timeline</label>
          <input type="text" value={timeline} onChange={(e) => setTimeline(e.target.value)} style={inputStyle} placeholder="e.g. 2 weeks" required />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Location (optional)</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={inputStyle}
            placeholder="e.g. Remote, New York, Europe only"
          />
        </div>
        <div style={{ marginBottom: 28 }}>
          <label style={labelStyle}>Required Skills (comma separated)</label>
          <input type="text" value={requirements} onChange={(e) => setRequirements(e.target.value)} style={inputStyle} placeholder="React, TypeScript, CSS" />
        </div>
        <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', height: 50, borderRadius: 10, fontSize: 15, fontWeight: 600, opacity: loading ? 0.6 : 1 }}>
          {loading ? 'Posting...' : 'Post project'}
        </button>
      </form>
    </div>
  )
}

export default CreateProject
