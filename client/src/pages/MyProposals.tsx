import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { withUser } from '../services/api'

function MyProposals() {
  const [user, setUser] = useState<any>(null)
  const [proposals, setProposals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      navigate('/login')
      return
    }
    const parsed = JSON.parse(userData)
    setUser(parsed)
    loadProposals(parsed)
  }, [navigate])

  const loadProposals = async (currentUser: any) => {
    try {
      const userApi = withUser(currentUser.email)
      const res = await userApi.get(`/proposals/my/${currentUser._id}`)
      setProposals(res.data || [])
    } catch (err) {
      console.error('Failed to load proposals:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleWithdraw = async (id: string) => {
    if (!user) return
    const confirmWithdraw = window.confirm('Are you sure you want to withdraw this proposal?')
    if (!confirmWithdraw) return

    try {
      setWithdrawingId(id)
      const userApi = withUser(user.email)
      await userApi.delete(`/proposals/${id}`, {
        data: { freelancerId: user._id },
      } as any)
      setProposals(prev => prev.filter(p => p._id !== id))
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to withdraw proposal')
    } finally {
      setWithdrawingId(null)
    }
  }

  const getStatusStyle = (status: string): React.CSSProperties => {
    switch (status) {
      case 'accepted': return { background: 'rgba(74,222,128,0.15)', color: '#4ade80' }
      case 'rejected': return { background: 'rgba(248,113,113,0.15)', color: '#f87171' }
      default: return { background: 'rgba(251,191,36,0.15)', color: '#fbbf24' }
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
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 8 }}>My Proposals</h1>
        <p style={{ fontSize: 14, color: '#999' }}>Track the status of proposals you've submitted. When a client accepts, the project will appear in My Projects.</p>
      </header>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0' }}>
          <p style={{ color: '#999', marginBottom: 12, fontSize: 15 }}>Loading your proposals...</p>
          <div style={{ width: 32, height: 32, border: '2px solid #5eead4', borderTopColor: 'transparent', borderRadius: '50%' }} className="animate-spin" />
        </div>
      ) : proposals.length === 0 ? (
        <div className="card" style={{ padding: 60, textAlign: 'center' }}>
          <p style={{ color: '#ccc', fontSize: 17, fontWeight: 500, marginBottom: 8 }}>No proposals yet</p>
          <p style={{ color: '#777', fontSize: 14, marginBottom: 24 }}>Browse projects and submit a proposal to get started.</p>
          <Link to="/search" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', height: 44, padding: '0 20px', borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
            Browse projects
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {proposals.map((proposal: any) => (
            <div key={proposal._id} className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div style={{ minWidth: 0 }}>
                  <Link to={`/project/${proposal.projectId?._id}`} style={{ fontSize: 17, fontWeight: 600, color: '#fff', textDecoration: 'none', display: 'block', marginBottom: 4 }}>
                    {proposal.projectId?.title || 'Untitled Project'}
                  </Link>
                  <p style={{ fontSize: 13, color: '#777' }}>{proposal.projectId?.category}</p>
                </div>
                <span style={{
                  padding: '4px 14px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 500,
                  textTransform: 'capitalize',
                  flexShrink: 0,
                  marginLeft: 12,
                  ...getStatusStyle(proposal.status),
                }}>
                  {proposal.status}
                </span>
              </div>

              <div className="grid grid-cols-3" style={{ gap: 16, fontSize: 14, marginBottom: 14 }}>
                <div>
                  <span style={{ color: '#777' }}>Project Budget:</span>
                  <span style={{ marginLeft: 8, fontWeight: 500, color: '#ccc' }}>${proposal.projectId?.budget}</span>
                </div>
                <div>
                  <span style={{ color: '#777' }}>Your Bid:</span>
                  <span style={{ marginLeft: 8, fontWeight: 500, color: '#ccc' }}>${proposal.proposedBudget}</span>
                </div>
                <div>
                  <span style={{ color: '#777' }}>Timeline:</span>
                  <span style={{ marginLeft: 8, fontWeight: 500, color: '#ccc' }}>{proposal.timeline}</span>
                </div>
              </div>

              <p style={{ color: '#777', fontSize: 14, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {proposal.coverLetter}
              </p>

              {proposal.status === 'pending' && (
                <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => handleWithdraw(proposal._id)}
                    disabled={withdrawingId === proposal._id}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 999,
                      border: '1px solid #4b5563',
                      background: '#111827',
                      color: '#f9fafb',
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: withdrawingId === proposal._id ? 'default' : 'pointer',
                      opacity: withdrawingId === proposal._id ? 0.6 : 1,
                    }}
                  >
                    {withdrawingId === proposal._id ? 'Withdrawing...' : 'Withdraw proposal'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyProposals
