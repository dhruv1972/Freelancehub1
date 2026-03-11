import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../services/api'

function SearchFreelancers() {
  const [searchParams] = useSearchParams()
  const inviteProjectId = searchParams.get('invite')
  const [searchQuery, setSearchQuery] = useState('')
  const [skillsFilter, setSkillsFilter] = useState('')
  const [experienceFilter, setExperienceFilter] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [freelancers, setFreelancers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [inviteProject, setInviteProject] = useState<any | null>(null)
  const [invitedFreelancerIds, setInvitedFreelancerIds] = useState<Set<string>>(new Set())
  const [user, setUser] = useState<any>(null)
  const [invitingId, setInvitingId] = useState<string | null>(null)

  const fetchFreelancers = async () => {
    try {
      setLoading(true)
      const params: any = {}
      if (searchQuery.trim()) params.q = searchQuery.trim()
      if (skillsFilter.trim()) params.skills = skillsFilter.trim()
      if (experienceFilter.trim()) params.experience = experienceFilter.trim()
      if (locationFilter.trim()) params.location = locationFilter.trim()

      const res = await api.get('/freelancers', { params })
      setFreelancers(res.data || [])
    } catch {
      setFreelancers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) setUser(JSON.parse(userData))
    fetchFreelancers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!inviteProjectId) {
      setInviteProject(null)
      setInvitedFreelancerIds(new Set())
      return
    }
    api.get(`/projects/${inviteProjectId}`).then(res => setInviteProject(res.data)).catch(() => setInviteProject(null))
    api.get(`/invitations/project/${inviteProjectId}`).then(res => {
      const list = Array.isArray(res.data) ? res.data : []
      setInvitedFreelancerIds(new Set(list.map((i: any) => String(i.freelancerId?._id || i.freelancerId))))
    }).catch(() => setInvitedFreelancerIds(new Set()))
  }, [inviteProjectId])

  const handleInvite = async (freelancerId: string) => {
    if (!inviteProjectId || !user?._id || user?.userType !== 'client') return
    setInvitingId(freelancerId)
    try {
      await api.post('/invitations', { projectId: inviteProjectId, clientId: user._id, freelancerId })
      setInvitedFreelancerIds(prev => {
        const next = new Set(prev)
        next.add(String(freelancerId))
        return next
      })
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to send invitation')
    } finally {
      setInvitingId(null)
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
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Find Freelancers</h1>
        <p style={{ fontSize: 14, color: '#999' }}>Search by name, skills, experience, or location to find freelancers for your project.</p>
        {inviteProjectId && inviteProject && (
          <div style={{ marginTop: 16, padding: '12px 16px', borderRadius: 10, background: 'rgba(94,234,212,0.1)', border: '1px solid rgba(94,234,212,0.3)' }}>
            <span style={{ fontSize: 14, color: '#5eead4', fontWeight: 500 }}>Inviting to: {inviteProject.title}</span>
            <span style={{ fontSize: 13, color: '#9ca3af', marginLeft: 8 }}>— Click &quot;Invite to apply&quot; to notify a freelancer.</span>
          </div>
        )}
      </header>

      <div className="card" style={{ padding: 20, marginBottom: 24 }}>
        <form
          className="grid md:grid-cols-2 lg:grid-cols-4"
          style={{ gap: 12 }}
          onSubmit={e => { e.preventDefault(); fetchFreelancers() }}
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={inputStyle}
            placeholder="Name or bio..."
          />
          <input
            type="text"
            value={skillsFilter}
            onChange={(e) => setSkillsFilter(e.target.value)}
            style={inputStyle}
            placeholder="Skills (comma-separated)"
          />
          <input
            type="text"
            value={experienceFilter}
            onChange={(e) => setExperienceFilter(e.target.value)}
            style={inputStyle}
            placeholder="Experience (keywords)"
          />
          <input
            type="text"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            style={inputStyle}
            placeholder="Location..."
          />
          <button
            type="submit"
            className="btn-primary"
            style={{ gridColumn: '1 / -1', height: 48, borderRadius: 10, fontSize: 15, fontWeight: 600 }}
          >
            Search freelancers
          </button>
        </form>
      </div>

      {loading ? (
        <div className="card" style={{ padding: 60, textAlign: 'center' }}>
          <p style={{ color: '#999', fontSize: 15 }}>Searching freelancers...</p>
        </div>
      ) : freelancers.length === 0 ? (
        <div className="card" style={{ padding: 60, textAlign: 'center' }}>
          <p style={{ color: '#999', fontSize: 15 }}>No freelancers found</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2" style={{ gap: 16 }}>
          {freelancers.map(freelancer => (
            <div key={freelancer._id} className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{
                  width: 48,
                  height: 48,
                  background: '#333',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <span style={{ color: '#5eead4', fontWeight: 700, fontSize: 18 }}>{freelancer.firstName.charAt(0)}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <h2 style={{ fontSize: 17, fontWeight: 600, color: '#fff' }}>{freelancer.firstName} {freelancer.lastName}</h2>
                    <span style={{ color: '#fbbf24', fontWeight: 500, fontSize: 14, flexShrink: 0 }}>⭐ {freelancer.profile?.rating ?? 0}</span>
                  </div>
                  <p style={{ fontSize: 13, color: '#999', marginBottom: 8 }}>{freelancer.profile?.location || 'Location not set'}</p>
                  <p style={{ fontSize: 14, color: '#999', lineHeight: 1.6, marginBottom: 12 }}>{freelancer.profile?.bio || 'No bio yet.'}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                    {(freelancer.profile?.skills || []).map((skill: string, i: number) => (
                      <span key={i} style={{ background: '#333', color: '#999', padding: '4px 10px', borderRadius: 6, fontSize: 12 }}>{skill}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    <Link to={`/profile/${freelancer._id}`} style={{ color: '#5eead4', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>
                      View Profile
                    </Link>
                    {inviteProjectId && user?.userType === 'client' && (
                      invitedFreelancerIds.has(freelancer._id)
                        ? <span style={{ fontSize: 13, color: '#4ade80', fontWeight: 500 }}>✓ Invited</span>
                        : (
                            <button
                              type="button"
                              onClick={() => handleInvite(freelancer._id)}
                              disabled={!!invitingId}
                              style={{
                                padding: '6px 12px',
                                borderRadius: 8,
                                border: '1px solid #5eead4',
                                background: 'transparent',
                                color: '#5eead4',
                                fontSize: 13,
                                fontWeight: 500,
                                cursor: invitingId ? 'default' : 'pointer',
                                opacity: invitingId === freelancer._id ? 0.7 : 1,
                              }}
                            >
                              {invitingId === freelancer._id ? 'Sending...' : 'Invite to apply'}
                            </button>
                          )
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchFreelancers
