import { useEffect, useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { api, withUser } from '../services/api'

function FreelancerProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [freelancer, setFreelancer] = useState<any | null>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any | null>(null)
  const [searchParams] = useSearchParams()
  const [proposal, setProposal] = useState<any | null>(null)
  const [acting, setActing] = useState<'accept' | 'reject' | null>(null)
  const [clientOpenProjects, setClientOpenProjects] = useState<any[]>([])
  const [invitedProjectIds, setInvitedProjectIds] = useState<Set<string>>(new Set())
  const [invitingProjectId, setInvitingProjectId] = useState<string | null>(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }

    if (!id) {
      navigate('/find-freelancers')
      return
    }
    api
      .get(`/profile/${id}`)
      .then(res => setFreelancer(res.data))
      .catch(() => setFreelancer(null))
      .finally(() => setLoading(false))

    api
      .get(`/reviews/user/${id}`)
      .then(res => {
        const list = Array.isArray(res.data) ? res.data : []
        setReviews(list.filter((r: any) => r.reviewType === 'client-to-freelancer'))
      })
      .catch(() => setReviews([]))

    const projectId = searchParams.get('projectId')
    const proposalId = searchParams.get('proposalId')

    if (projectId && proposalId && userData) {
      api
        .get(`/proposals/project/${projectId}`)
        .then(res => {
          const list = res.data || []
          const found = list.find((p: any) => p._id === proposalId)
          setProposal(found || null)
        })
        .catch(() => setProposal(null))
    }

    const parsed = userData ? JSON.parse(userData) : null
    if (parsed?.userType === 'client' && parsed?._id && id) {
      api.get('/projects/my').then(res => {
        const list = Array.isArray(res.data) ? res.data : []
        setClientOpenProjects(list.filter((p: any) => p.status === 'open'))
      }).catch(() => setClientOpenProjects([]))
      api.get(`/invitations/freelancer/${id}`).then(res => {
        const list = Array.isArray(res.data) ? res.data : []
        setInvitedProjectIds(new Set(list.map((i: any) => String(i.projectId?._id || i.projectId))))
      }).catch(() => setInvitedProjectIds(new Set()))
    } else {
      setClientOpenProjects([])
      setInvitedProjectIds(new Set())
    }
  }, [id, navigate, searchParams])

  const canActOnProposal = !!(
    user &&
    user.userType === 'client' &&
    proposal &&
    proposal.status === 'pending'
  )

  const handleProposalAction = async (action: 'accept' | 'reject') => {
    if (!user || !proposal || !canActOnProposal) return
    try {
      setActing(action)
      const userApi = withUser(user.email)
      const res = await userApi.post(`/proposals/${proposal._id}/${action}`)
      const updated = res.data
      setProposal({ ...proposal, status: updated.status })
    } catch (err: any) {
      alert(err.response?.data?.error || `Failed to ${action} proposal`)
    } finally {
      setActing(null)
    }
  }

  const handleInviteToApply = async (projectId: string) => {
    if (!user?._id || user?.userType !== 'client' || !id) return
    setInvitingProjectId(projectId)
    try {
      await api.post('/invitations', { projectId, clientId: user._id, freelancerId: id })
      setInvitedProjectIds(prev => new Set(prev).add(projectId))
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to send invitation')
    } finally {
      setInvitingProjectId(null)
    }
  }

  if (loading) {
    return (
      <div className="page-content">
        <div style={{ padding: '80px 0', textAlign: 'center', color: '#999', fontSize: 15 }}>
          Loading freelancer profile...
        </div>
      </div>
    )
  }

  if (!freelancer) {
    return (
      <div className="page-content">
        <div style={{ padding: '80px 0', textAlign: 'center', color: '#999', fontSize: 15 }}>
          This freelancer profile could not be found.
        </div>
      </div>
    )
  }

  const profile = freelancer.profile || {}
  const fullName = `${freelancer.firstName || ''} ${freelancer.lastName || ''}`.trim() || freelancer.email

  return (
    <div className="page-content" style={{ maxWidth: 720 }}>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 6 }}>
          {fullName}
        </h1>
        <p style={{ fontSize: 14, color: '#9ca3af' }}>
          Public freelancer profile as seen by clients.
        </p>
      </header>

      {user?.userType === 'client' && id && id !== user._id && clientOpenProjects.length > 0 && (
        <div className="card" style={{ padding: 20, marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>Invite to apply</div>
          <p style={{ fontSize: 14, color: '#d1d5db', marginBottom: 14 }}>Invite this freelancer to apply for one of your open projects. They will get a notification with a link to the project.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {clientOpenProjects.map((proj: any) => {
              const pid = String(proj._id)
              const alreadyInvited = invitedProjectIds.has(pid)
              return (
                <div key={pid} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => handleInviteToApply(pid)}
                    disabled={alreadyInvited || invitingProjectId === pid}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 8,
                      border: '1px solid #333',
                      background: alreadyInvited ? 'rgba(74,222,128,0.12)' : 'transparent',
                      color: alreadyInvited ? '#4ade80' : '#5eead4',
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: alreadyInvited || invitingProjectId === pid ? 'default' : 'pointer',
                      opacity: invitingProjectId === pid ? 0.7 : 1,
                    }}
                  >
                    {alreadyInvited ? `✓ Invited: ${proj.title}` : invitingProjectId === pid ? 'Sending...' : `Invite to "${proj.title}"`}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="card" style={{ padding: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '999px',
              background: '#1f2933',
              border: '1px solid #374151',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              fontWeight: 600,
              color: '#5eead4',
            }}
          >
            {(freelancer.firstName || freelancer.email || 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#fff' }}>{fullName}</div>
            <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 4 }}>{freelancer.email}</div>
            {profile.location && (
              <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 2 }}>{profile.location}</div>
            )}
          </div>
        </div>

        {profile.bio && (
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
              Bio
            </div>
            <p style={{ fontSize: 14, color: '#e5e7eb', lineHeight: 1.6 }}>{profile.bio}</p>
          </div>
        )}

        {Array.isArray(profile.skills) && profile.skills.length > 0 && (
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
              Skills
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {profile.skills.map((skill: string) => (
                <span
                  key={skill}
                  style={{
                    fontSize: 12,
                    padding: '4px 10px',
                    borderRadius: 999,
                    background: 'rgba(148,163,184,0.18)',
                    color: '#e5e7eb',
                    border: '1px solid rgba(148,163,184,0.4)',
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {profile.experience && (
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
              Experience
            </div>
            <p style={{ fontSize: 14, color: '#e5e7eb', lineHeight: 1.6 }}>{profile.experience}</p>
          </div>
        )}

        {Array.isArray(profile.portfolio) && profile.portfolio.length > 0 && (
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
              Portfolio
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {profile.portfolio.map((item: any, index: number) => (
                <div
                  key={index}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 10,
                    border: '1px solid #1f2937',
                    background: '#020617',
                  }}
                >
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#e5e7eb', marginBottom: 4 }}>
                    {item.title || 'Untitled project'}
                  </div>
                  {item.description && (
                    <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 4 }}>
                      {item.description}
                    </p>
                  )}
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: 13, color: '#5eead4', textDecoration: 'underline' }}
                    >
                      View project
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {profile.resume && (
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
              Resume
            </div>
            <a
              href={profile.resume}
              download={profile.resumeFileName || 'resume.pdf'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 16px',
                borderRadius: 10,
                background: 'rgba(94,234,212,0.12)',
                color: '#5eead4',
                border: '1px solid rgba(94,234,212,0.3)',
                fontSize: 14,
                fontWeight: 500,
                textDecoration: 'none',
              }}
            >
              Download resume {profile.resumeFileName ? `(${profile.resumeFileName})` : ''}
            </a>
          </div>
        )}

        {(profile.rating != null || reviews.length > 0) && (
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
              Rating & reviews
            </div>
            <div style={{ padding: '12px 14px', borderRadius: 10, background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', marginBottom: 12 }}>
              <p style={{ fontSize: 14, color: '#fbbf24', fontWeight: 600 }}>
                ⭐ {(profile.rating != null ? profile.rating : reviews.length ? reviews.reduce((s: number, r: any) => s + (r.rating || 0), 0) / reviews.length : 0).toFixed(1)} / 5
                {reviews.length > 0 && (
                  <span style={{ fontSize: 13, color: '#9ca3af', fontWeight: 400 }}> ({reviews.length} review{reviews.length === 1 ? '' : 's'})</span>
                )}
              </p>
            </div>
            {reviews.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {reviews.map((r: any) => (
                  <div
                    key={r._id}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 10,
                      border: '1px solid #333',
                      background: '#0b0b0b',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: '#e5e7eb' }}>
                        {r.reviewerId?.firstName} {r.reviewerId?.lastName}
                      </span>
                      <span style={{ fontSize: 13, color: '#fbbf24' }}>⭐ {r.rating}/5</span>
                    </div>
                    {r.projectId?.title && (
                      <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Project: {r.projectId.title}</p>
                    )}
                    <p style={{ fontSize: 14, color: '#d1d5db', lineHeight: 1.5 }}>{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {proposal && (
          <div style={{ marginTop: 28, borderTop: '1px solid #1f2937', paddingTop: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>Proposal for your project</h2>
              <span
                style={{
                  padding: '3px 10px',
                  borderRadius: 999,
                  fontSize: 12,
                  textTransform: 'capitalize',
                  background: proposal.status === 'accepted'
                    ? 'rgba(74,222,128,0.15)'
                    : proposal.status === 'rejected'
                      ? 'rgba(248,113,113,0.15)'
                      : 'rgba(251,191,36,0.15)',
                  color: proposal.status === 'accepted'
                    ? '#4ade80'
                    : proposal.status === 'rejected'
                      ? '#f87171'
                      : '#fbbf24',
                }}
              >
                {proposal.status}
              </span>
            </div>
            <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 6 }}>
              Bid: <span style={{ color: '#e5e7eb', fontWeight: 500 }}>${proposal.proposedBudget}</span> · Timeline:{' '}
              <span style={{ color: '#e5e7eb', fontWeight: 500 }}>{proposal.timeline}</span>
            </p>
            <p style={{ fontSize: 14, color: '#d1d5db', lineHeight: 1.6, marginBottom: 10 }}>{proposal.coverLetter}</p>

            {canActOnProposal && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
                <button
                  type="button"
                  onClick={() => handleProposalAction('reject')}
                  disabled={acting !== null}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 999,
                    border: '1px solid #4b5563',
                    background: '#111827',
                    color: '#e5e7eb',
                    fontSize: 13,
                    cursor: acting ? 'default' : 'pointer',
                    opacity: acting ? 0.6 : 1,
                  }}
                >
                  {acting === 'reject' ? 'Updating...' : 'Reject'}
                </button>
                <button
                  type="button"
                  onClick={() => handleProposalAction('accept')}
                  disabled={acting !== null}
                  className="btn-primary"
                  style={{
                    padding: '6px 18px',
                    borderRadius: 999,
                    fontSize: 13,
                    fontWeight: 600,
                    opacity: acting ? 0.6 : 1,
                  }}
                >
                  {acting === 'accept' ? 'Updating...' : 'Accept'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default FreelancerProfile

