import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { api, withUser } from '../services/api'
import TimeTracker from '../components/TimeTracker'
import PaymentModal from '../components/PaymentModal'

function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [coverLetter, setCoverLetter] = useState('')
  const [proposedBudget, setProposedBudget] = useState('')
  const [timeline, setTimeline] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [project, setProject] = useState<any | null>(null)
  const [proposals, setProposals] = useState<any[]>([])
  const [actingOnProposalId, setActingOnProposalId] = useState<string | null>(null)
  const [updatingProject, setUpdatingProject] = useState(false)
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('')
  const [projectReviews, setProjectReviews] = useState<any[]>([])
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)
  const [clientReviewRating, setClientReviewRating] = useState(5)
  const [clientReviewComment, setClientReviewComment] = useState('')
  const [submittingClientReview, setSubmittingClientReview] = useState(false)
  const [projectPayments, setProjectPayments] = useState<any[]>([])
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [isProjectSaved, setIsProjectSaved] = useState(false)
  const [invitedFreelancers, setInvitedFreelancers] = useState<any[]>([])

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
    if (id) {
      api
        .get(`/projects/${id}`)
        .then(res => setProject(res.data))
        .catch(() => setProject(null))

      api
        .get(`/proposals/project/${id}`)
        .then(res => setProposals(res.data || []))
        .catch(() => setProposals([]))

      api
        .get(`/reviews/project/${id}`)
        .then(res => setProjectReviews(Array.isArray(res.data) ? res.data : []))
        .catch(() => setProjectReviews([]))

      api
        .get(`/payments/project/${id}`)
        .then(res => setProjectPayments(Array.isArray(res.data) ? res.data : []))
        .catch(() => setProjectPayments([]))

      api
        .get(`/invitations/project/${id}`)
        .then(res => setInvitedFreelancers(Array.isArray(res.data) ? res.data : []))
        .catch(() => setInvitedFreelancers([]))
    }
  }, [id])

  useEffect(() => {
    if (user?._id && user?.userType === 'freelancer' && id) {
      api.get(`/saved-jobs/${user._id}/ids`).then(res => {
        const ids = Array.isArray(res.data) ? res.data : []
        setIsProjectSaved(ids.some((pid: any) => String(pid) === String(id)))
      }).catch(() => setIsProjectSaved(false))
    } else {
      setIsProjectSaved(false)
    }
  }, [user?._id, user?.userType, id])

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !user._id || !id) {
      alert('Please sign in as a freelancer to submit a proposal.')
      return
    }

    setLoading(true)

    try {
      const userApi = withUser(user.email)
      await userApi.post(`/proposals/${id}`, {
        freelancerId: user._id,
        coverLetter,
        proposedBudget: Number(proposedBudget),
        timeline,
      })
      setSubmitted(true)
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to submit proposal')
    } finally {
      setLoading(false)
    }
  }

  const isFreelancer = user?.userType === 'freelancer'
  const isClientOwner = user && user.userType === 'client' && project && project.clientId && String(project.clientId._id) === String(user._id)
  const isAssignedFreelancer =
    user &&
    project &&
    project.selectedFreelancer &&
    String(project.selectedFreelancer) === String(user._id)

  const handleProposalAction = async (proposalId: string, action: 'accept' | 'reject') => {
    if (!user || !isClientOwner) return
    setActingOnProposalId(proposalId)
    try {
      const userApi = withUser(user.email)
      const res = await userApi.post(`/proposals/${proposalId}/${action}`)
      const updated = res.data
      setProposals(prev => prev.map(p => (p._id === proposalId ? { ...p, status: updated.status } : p)))
    } catch (err: any) {
      alert(err.response?.data?.error || `Failed to ${action} proposal`)
    } finally {
      setActingOnProposalId(null)
    }
  }

  const handleUpdateProject = async (updates: { status?: string; milestones?: any[] }) => {
    if (!user?.email || !id) return
    setUpdatingProject(true)
    try {
      const userApi = withUser(user.email)
      const res = await userApi.put(`/projects/${id}`, updates)
      setProject(res.data)
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update project')
    } finally {
      setUpdatingProject(false)
    }
  }

  const handleMilestoneStatus = (index: number, status: string) => {
    const milestones = [...(project?.milestones || [])]
    if (!milestones[index]) return
    milestones[index] = { ...milestones[index], status }
    handleUpdateProject({ milestones })
  }

  const handleAddMilestone = () => {
    if (!newMilestoneTitle.trim()) return
    const milestones = [...(project?.milestones || []), { title: newMilestoneTitle.trim(), status: 'pending' }]
    setNewMilestoneTitle('')
    handleUpdateProject({ milestones })
  }

  const handleRemoveMilestone = (index: number) => {
    const milestones = (project?.milestones || []).filter((_: any, i: number) => i !== index)
    handleUpdateProject({ milestones })
  }

  const acceptedProposal = proposals.find((p: any) => p.status === 'accepted')
  const freelancerId = project?.selectedFreelancer?._id || project?.selectedFreelancer
  const freelancerName = acceptedProposal?.freelancerId
    ? `${acceptedProposal.freelancerId.firstName || ''} ${acceptedProposal.freelancerId.lastName || ''}`.trim() || acceptedProposal.freelancerId.email
    : 'your freelancer'
  const clientId = project?.clientId?._id || project?.clientId
  const clientName = project?.clientId
    ? `${(project.clientId as any).firstName || ''} ${(project.clientId as any).lastName || ''}`.trim() || (project.clientId as any).email
    : 'the client'
  const myReview = projectReviews.find(
    (r: any) => r.reviewType === 'client-to-freelancer' && String(r.reviewerId?._id || r.reviewerId) === String(user?._id)
  )
  const myReviewAsFreelancer = projectReviews.find(
    (r: any) => r.reviewType === 'freelancer-to-client' && String(r.reviewerId?._id || r.reviewerId) === String(user?._id)
  )

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.email || !user?._id || !id || !freelancerId) return
    setSubmittingReview(true)
    try {
      const userApi = withUser(user.email)
      await userApi.post('/reviews', {
        projectId: id,
        reviewerId: user._id,
        revieweeId: freelancerId,
        rating: reviewRating,
        comment: reviewComment.trim(),
        reviewType: 'client-to-freelancer',
      })
      const res = await api.get(`/reviews/project/${id}`)
      setProjectReviews(Array.isArray(res.data) ? res.data : [])
      setReviewComment('')
      setReviewRating(5)
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to submit review')
    } finally {
      setSubmittingReview(false)
    }
  }

  const toggleSaveJob = async () => {
    if (!user?._id || user?.userType !== 'freelancer' || !id) return
    try {
      if (isProjectSaved) {
        await api.delete(`/saved-jobs/${user._id}/${id}`)
        setIsProjectSaved(false)
      } else {
        await api.post('/saved-jobs', { userId: user._id, projectId: id })
        setIsProjectSaved(true)
      }
    } catch (err) {
      console.error('Failed to toggle save', err)
    }
  }

  const handleSubmitClientReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.email || !user?._id || !id || !clientId) return
    setSubmittingClientReview(true)
    try {
      const userApi = withUser(user.email)
      await userApi.post('/reviews', {
        projectId: id,
        reviewerId: user._id,
        revieweeId: clientId,
        rating: clientReviewRating,
        comment: clientReviewComment.trim(),
        reviewType: 'freelancer-to-client',
      })
      const res = await api.get(`/reviews/project/${id}`)
      setProjectReviews(Array.isArray(res.data) ? res.data : [])
      setClientReviewComment('')
      setClientReviewRating(5)
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to submit review')
    } finally {
      setSubmittingClientReview(false)
    }
  }

  if (!project) {
    return (
      <div className="page-content">
        <div style={{ padding: '80px 0', textAlign: 'center', color: '#999', fontSize: 15 }}>
          Loading project...
        </div>
      </div>
    )
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
    <div className="page-content" style={{ maxWidth: 960 }}>
      <div className="card" style={{ padding: 32, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#fff' }}>{project.title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, marginLeft: 16 }}>
            {isFreelancer && project.status === 'open' && (
              <button
                type="button"
                onClick={toggleSaveJob}
                title={isProjectSaved ? 'Remove from saved jobs' : 'Save for later'}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  height: 38,
                  padding: '0 14px',
                  borderRadius: 8,
                  border: '1px solid #333',
                  background: isProjectSaved ? 'rgba(251,191,36,0.15)' : 'transparent',
                  color: isProjectSaved ? '#fbbf24' : '#9ca3af',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                <span style={{ fontSize: 16 }}>{isProjectSaved ? '★' : '☆'}</span>
                {isProjectSaved ? 'Saved' : 'Save for later'}
              </button>
            )}
            <span style={{
              padding: '4px 14px',
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 500,
              background: project.status === 'open' ? 'rgba(74,222,128,0.15)' : 'rgba(156,163,175,0.15)',
              color: project.status === 'open' ? '#4ade80' : '#9ca3af',
            }}>
              {project.status}
            </span>
          </div>
        </div>
        <p style={{ color: '#999', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>{project.description}</p>
        <div className="grid md:grid-cols-3" style={{ gap: 20, marginBottom: 24 }}>
          <div>
            <p style={{ fontSize: 13, color: '#777', marginBottom: 4 }}>Budget</p>
            <p style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>${project.budget}</p>
          </div>
          <div>
            <p style={{ fontSize: 13, color: '#777', marginBottom: 4 }}>Timeline</p>
            <p style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>{project.timeline}</p>
          </div>
          <div>
            <p style={{ fontSize: 13, color: '#777', marginBottom: 4 }}>Category</p>
            <p style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>{project.category}</p>
          </div>
        </div>
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 13, color: '#777', marginBottom: 10 }}>Required Skills</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {(project.requirements || []).map((skill: string, i: number) => (
              <span key={i} style={{ background: 'rgba(94,234,212,0.1)', color: '#5eead4', padding: '4px 12px', borderRadius: 6, fontSize: 13 }}>{skill}</span>
            ))}
          </div>
        </div>
        {project.clientId && (
          <p style={{ fontSize: 13, color: '#777', marginBottom: project.milestones?.length ? 16 : 0 }}>
            Posted by: {project.clientId.firstName} {project.clientId.lastName}
          </p>
        )}
        {Array.isArray(project.milestones) && project.milestones.length > 0 && (
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #333' }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#9ca3af', marginBottom: 8 }}>Milestones</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {project.milestones.map((m: any, i: number) => (
                <div key={m._id || i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
                  <span style={{ color: '#e5e7eb' }}>{m.title}</span>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 500,
                    textTransform: 'capitalize',
                    background: m.status === 'completed' ? 'rgba(74,222,128,0.15)' : m.status === 'in-progress' ? 'rgba(94,234,212,0.15)' : 'rgba(156,163,175,0.15)',
                    color: m.status === 'completed' ? '#4ade80' : m.status === 'in-progress' ? '#5eead4' : '#9ca3af',
                  }}>
                    {m.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {isFreelancer && project.status === 'open' && !submitted && (
        <div className="card" style={{ padding: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 24 }}>Submit a Proposal</h2>
          <form onSubmit={handleSubmitProposal}>
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Cover Letter</label>
              <textarea value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} rows={5} style={textareaStyle} placeholder="Explain why you're the best fit..." required />
            </div>
            <div className="grid md:grid-cols-2" style={{ gap: 20, marginBottom: 28 }}>
              <div>
                <label style={labelStyle}>Your Bid ($)</label>
                <input type="number" value={proposedBudget} onChange={(e) => setProposedBudget(e.target.value)} style={inputStyle} placeholder="1500" required />
              </div>
              <div>
                <label style={labelStyle}>Delivery Time</label>
                <input type="text" value={timeline} onChange={(e) => setTimeline(e.target.value)} style={inputStyle} placeholder="3 weeks" required />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', height: 50, borderRadius: 10, fontSize: 15, fontWeight: 600, opacity: loading ? 0.6 : 1 }}>
              {loading ? 'Submitting...' : 'Submit Proposal'}
            </button>
          </form>
        </div>
      )}

      {isAssignedFreelancer && user?.email && (
        <div style={{ marginTop: 24 }}>
          <div className="card" style={{ padding: 24, marginBottom: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 16 }}>Project status & milestones</h2>
            <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 16 }}>Update the project status and add or complete milestones so you and the client stay in sync.</p>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#9ca3af', marginBottom: 8 }}>Project status</label>
              <select
                value={project.status}
                onChange={(e) => handleUpdateProject({ status: e.target.value })}
                disabled={updatingProject}
                style={{
                  height: 42,
                  padding: '0 14px',
                  fontSize: 14,
                  background: '#1a1a1a',
                  border: '1px solid #333',
                  borderRadius: 10,
                  color: '#fff',
                  cursor: updatingProject ? 'default' : 'pointer',
                  opacity: updatingProject ? 0.7 : 1,
                }}
              >
                <option value="in-progress">In progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#9ca3af' }}>Milestones</label>
              </div>
              {(project.milestones || []).length === 0 ? (
                <p style={{ fontSize: 13, color: '#777', marginBottom: 12 }}>No milestones yet. Add one below.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
                  {(project.milestones || []).map((m: any, index: number) => (
                    <div
                      key={m._id || index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '10px 14px',
                        borderRadius: 10,
                        border: '1px solid #333',
                        background: '#0b0b0b',
                        flexWrap: 'wrap',
                      }}
                    >
                      <span style={{ flex: 1, minWidth: 120, fontSize: 14, color: '#e5e7eb' }}>{m.title}</span>
                      <select
                        value={m.status || 'pending'}
                        onChange={(e) => handleMilestoneStatus(index, e.target.value)}
                        disabled={updatingProject}
                        style={{
                          height: 34,
                          padding: '0 10px',
                          fontSize: 12,
                          background: '#1a1a1a',
                          border: '1px solid #333',
                          borderRadius: 8,
                          color: '#fff',
                          cursor: updatingProject ? 'default' : 'pointer',
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In progress</option>
                        <option value="completed">Completed</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => handleRemoveMilestone(index)}
                        disabled={updatingProject}
                        style={{
                          padding: '4px 10px',
                          fontSize: 12,
                          border: 'none',
                          background: 'rgba(248,113,113,0.15)',
                          color: '#f87171',
                          borderRadius: 6,
                          cursor: updatingProject ? 'default' : 'pointer',
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ display: 'flex', gap: 10 }}>
                <input
                  type="text"
                  value={newMilestoneTitle}
                  onChange={(e) => setNewMilestoneTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddMilestone()}
                  placeholder="New milestone (e.g. Design mockups)"
                  disabled={updatingProject}
                  style={{
                    flex: 1,
                    height: 42,
                    padding: '0 14px',
                    fontSize: 14,
                    background: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: 10,
                    color: '#fff',
                    outline: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddMilestone}
                  disabled={updatingProject || !newMilestoneTitle.trim()}
                  className="btn-primary"
                  style={{
                    height: 42,
                    padding: '0 18px',
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: 600,
                    opacity: updatingProject || !newMilestoneTitle.trim() ? 0.6 : 1,
                  }}
                >
                  Add milestone
                </button>
              </div>
            </div>
          </div>

          <TimeTracker
            projectId={id!}
            userId={user._id}
            userEmail={user.email}
          />
        </div>
      )}

      {isClientOwner && (
        <div className="card" style={{ padding: 32, marginTop: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>Proposals</h2>
            <span style={{ fontSize: 13, color: '#9ca3af' }}>{proposals.length} proposal{proposals.length === 1 ? '' : 's'}</span>
          </div>

          {proposals.length === 0 ? (
            <p style={{ fontSize: 14, color: '#9ca3af' }}>You haven't received any proposals for this project yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {proposals.map((p: any) => (
                <div key={p._id} style={{ padding: 18, borderRadius: 10, border: '1px solid #333', background: '#111827' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>
                        {p.freelancerId?.firstName} {p.freelancerId?.lastName}
                      </div>
                      <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 2 }}>{p.freelancerId?.email}</div>
                      {p.freelancerId?._id && (
                        <button
                          type="button"
                          onClick={() => navigate(`/profile/${p.freelancerId._id}?projectId=${project._id}&proposalId=${p._id}`)}
                          style={{
                            marginTop: 6,
                            padding: 0,
                            border: 'none',
                            background: 'none',
                            color: '#5eead4',
                            fontSize: 13,
                            fontWeight: 500,
                            cursor: 'pointer',
                          }}
                        >
                          View full profile
                        </button>
                      )}
                    </div>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: 999,
                      fontSize: 12,
                      textTransform: 'capitalize',
                      background: p.status === 'accepted'
                        ? 'rgba(74,222,128,0.15)'
                        : p.status === 'rejected'
                          ? 'rgba(248,113,113,0.15)'
                          : 'rgba(251,191,36,0.15)',
                      color: p.status === 'accepted'
                        ? '#4ade80'
                        : p.status === 'rejected'
                          ? '#f87171'
                          : '#fbbf24',
                    }}>
                      {p.status}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#9ca3af', marginBottom: 8 }}>
                    <div>Bid: <span style={{ color: '#e5e7eb', fontWeight: 500 }}>${p.proposedBudget}</span></div>
                    <div>Timeline: <span style={{ color: '#e5e7eb', fontWeight: 500 }}>{p.timeline}</span></div>
                  </div>

              <p style={{ fontSize: 14, color: '#d1d5db', lineHeight: 1.6, marginBottom: 10 }}>{p.coverLetter}</p>

              {p.status === 'pending' && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
                  <button
                    type="button"
                    onClick={() => handleProposalAction(p._id, 'reject')}
                    disabled={actingOnProposalId === p._id}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 999,
                      border: '1px solid #4b5563',
                      background: '#111827',
                      color: '#e5e7eb',
                      fontSize: 13,
                      cursor: actingOnProposalId === p._id ? 'default' : 'pointer',
                      opacity: actingOnProposalId === p._id ? 0.6 : 1,
                    }}
                  >
                    {actingOnProposalId === p._id ? 'Updating...' : 'Reject'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleProposalAction(p._id, 'accept')}
                    disabled={actingOnProposalId === p._id}
                    className="btn-primary"
                    style={{
                      padding: '6px 18px',
                      borderRadius: 999,
                      fontSize: 13,
                      fontWeight: 600,
                      opacity: actingOnProposalId === p._id ? 0.6 : 1,
                    }}
                  >
                    {actingOnProposalId === p._id ? 'Updating...' : 'Accept'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
      )}

      {isClientOwner && project?.status === 'open' && (
        <div className="card" style={{ padding: 32, marginTop: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>Invited freelancers</h2>
            <Link
              to={`/find-freelancers?invite=${id}`}
              style={{ fontSize: 14, color: '#5eead4', fontWeight: 500, textDecoration: 'none' }}
            >
              Invite more
            </Link>
          </div>
          <p style={{ fontSize: 14, color: '#9ca3af', marginBottom: 16 }}>
            Freelancers you invite will receive a notification and can submit a proposal from the project page.
          </p>
          {invitedFreelancers.length === 0 ? (
            <p style={{ fontSize: 14, color: '#9ca3af' }}>No one invited yet. Click &quot;Invite more&quot; to search and invite freelancers.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {invitedFreelancers.map((inv: any) => {
                const fl = inv.freelancerId
                const name = fl ? `${fl.firstName || ''} ${fl.lastName || ''}`.trim() || fl.email : 'Unknown'
                return (
                  <div key={inv._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: 10, border: '1px solid #333', background: '#0b0b0b' }}>
                    <span style={{ fontSize: 14, color: '#e5e7eb', fontWeight: 500 }}>{name}</span>
                    {fl?._id && (
                      <button
                        type="button"
                        onClick={() => navigate(`/profile/${fl._id}`)}
                        style={{ fontSize: 13, color: '#5eead4', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}
                      >
                        View profile
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {isClientOwner && freelancerId && (
        <div className="card" style={{ padding: 32, marginTop: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Payment</h2>
          <p style={{ fontSize: 14, color: '#9ca3af', marginBottom: 20 }}>
            Pay {freelancerName} securely for this project. Payment is processed by Stripe; the freelancer will be notified when you pay.
          </p>
          {projectPayments.some((p: any) => p.status === 'succeeded') ? (
            <div style={{ padding: 16, borderRadius: 10, border: '1px solid rgba(74,222,128,0.3)', background: 'rgba(74,222,128,0.08)' }}>
              <span style={{ color: '#4ade80', fontWeight: 600 }}>✓ Payment sent</span>
              <p style={{ fontSize: 13, color: '#9ca3af', marginTop: 4 }}>
                You paid ${(projectPayments.find((p: any) => p.status === 'succeeded')?.amount / 100).toFixed(2)} for this project.
              </p>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowPaymentModal(true)}
              className="btn-primary"
              style={{ padding: '12px 24px', borderRadius: 10, fontSize: 15, fontWeight: 600 }}
            >
              Pay freelancer ${(acceptedProposal?.proposedBudget ?? project?.budget ?? 0).toFixed(2)}
            </button>
          )}
        </div>
      )}

      {isClientOwner && freelancerId && (
        <div className="card" style={{ padding: 32, marginTop: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Rate your freelancer</h2>
          <p style={{ fontSize: 14, color: '#9ca3af', marginBottom: 20 }}>
            Only the project owner (you) can leave a review for {freelancerName}. Your review will appear on their public profile.
          </p>
          {myReview ? (
            <div style={{ padding: 16, borderRadius: 10, border: '1px solid #333', background: '#0b0b0b' }}>
              <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 8 }}>You left this review:</p>
              <p style={{ fontSize: 14, color: '#fbbf24', fontWeight: 600, marginBottom: 8 }}>⭐ {myReview.rating} / 5</p>
              <p style={{ fontSize: 14, color: '#e5e7eb', lineHeight: 1.5 }}>{myReview.comment}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmitReview}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#ccc', marginBottom: 8 }}>Rating (1–5 stars)</label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  style={{
                    width: '100%',
                    height: 44,
                    padding: '0 14px',
                    fontSize: 14,
                    background: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: 10,
                    color: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>{n} star{n === 1 ? '' : 's'}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#ccc', marginBottom: 8 }}>Your review</label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  required
                  rows={4}
                  placeholder="Share your experience working with this freelancer..."
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    fontSize: 14,
                    background: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: 10,
                    color: '#fff',
                    outline: 'none',
                    resize: 'vertical',
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={submittingReview || !reviewComment.trim()}
                className="btn-primary"
                style={{
                  height: 44,
                  padding: '0 24px',
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 600,
                  opacity: submittingReview || !reviewComment.trim() ? 0.6 : 1,
                }}
              >
                {submittingReview ? 'Submitting...' : 'Submit review'}
              </button>
            </form>
          )}
        </div>
      )}

      {isAssignedFreelancer && clientId && (
        <div className="card" style={{ padding: 32, marginTop: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Rate your client</h2>
          <p style={{ fontSize: 14, color: '#9ca3af', marginBottom: 20 }}>
            Share your experience working with {clientName}. Your feedback helps other freelancers and improves the platform.
          </p>
          {myReviewAsFreelancer ? (
            <div style={{ padding: 16, borderRadius: 10, border: '1px solid #333', background: '#0b0b0b' }}>
              <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 8 }}>You left this review:</p>
              <p style={{ fontSize: 14, color: '#fbbf24', fontWeight: 600, marginBottom: 8 }}>⭐ {myReviewAsFreelancer.rating} / 5</p>
              <p style={{ fontSize: 14, color: '#e5e7eb', lineHeight: 1.5 }}>{myReviewAsFreelancer.comment}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmitClientReview}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#ccc', marginBottom: 8 }}>Rating (1–5 stars)</label>
                <select
                  value={clientReviewRating}
                  onChange={(e) => setClientReviewRating(Number(e.target.value))}
                  style={{
                    width: '100%',
                    height: 44,
                    padding: '0 14px',
                    fontSize: 14,
                    background: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: 10,
                    color: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>{n} star{n === 1 ? '' : 's'}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#ccc', marginBottom: 8 }}>Your feedback</label>
                <textarea
                  value={clientReviewComment}
                  onChange={(e) => setClientReviewComment(e.target.value)}
                  required
                  rows={4}
                  placeholder="Share your experience working with this client..."
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    fontSize: 14,
                    background: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: 10,
                    color: '#fff',
                    outline: 'none',
                    resize: 'vertical',
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={submittingClientReview || !clientReviewComment.trim()}
                className="btn-primary"
                style={{
                  height: 44,
                  padding: '0 24px',
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 600,
                  opacity: submittingClientReview || !clientReviewComment.trim() ? 0.6 : 1,
                }}
              >
                {submittingClientReview ? 'Submitting...' : 'Submit review'}
              </button>
            </form>
          )}
        </div>
      )}

      {submitted && (
        <div style={{
          background: 'rgba(74,222,128,0.08)',
          border: '1px solid rgba(74,222,128,0.25)',
          color: '#4ade80',
          padding: 32,
          borderRadius: 12,
          textAlign: 'center',
          marginTop: 24,
        }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Proposal Submitted!</h2>
          <p style={{ fontSize: 14 }}>Your proposal has been sent to the client.</p>
          <button
            onClick={() => navigate('/my-proposals')}
            style={{ marginTop: 16, color: '#5eead4', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500 }}
            onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
            onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
          >
            View My Proposals
          </button>
        </div>
      )}

      {!user && (
        <div className="card" style={{ padding: 32, textAlign: 'center' }}>
          <p style={{ color: '#999', marginBottom: 10, fontSize: 15 }}>Login to submit a proposal</p>
          <button
            onClick={() => navigate('/login')}
            style={{ color: '#5eead4', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500 }}
            onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
            onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
          >
            Login
          </button>
        </div>
      )}

      {showPaymentModal && project && user && (
        <PaymentModal
          projectId={project._id}
          amount={Number(acceptedProposal?.proposedBudget ?? project.budget ?? 0)}
          projectTitle={project.title || 'Project'}
          clientId={user._id}
          onSuccess={() => api.get(`/payments/project/${id}`).then(res => setProjectPayments(Array.isArray(res.data) ? res.data : []))}
          onClose={() => setShowPaymentModal(false)}
        />
      )}
    </div>
  )
}

export default ProjectDetail
