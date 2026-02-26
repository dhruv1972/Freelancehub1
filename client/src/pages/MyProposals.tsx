import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { withUser } from '../services/api'

function MyProposals() {
  const [user, setUser] = useState<any>(null)
  const [proposals, setProposals] = useState<any[]>([])
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
    loadProposals(parsed)
  }, [navigate])

  const loadProposals = async (currentUser: any) => {
    try {
      const userApi = withUser(currentUser.email)
      const res = await userApi.get('/proposals/my')
      setProposals(res.data || [])
    } catch (err) {
      console.error('Failed to load proposals:', err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-700'
      case 'rejected': return 'bg-red-100 text-red-700'
      default: return 'bg-yellow-100 text-yellow-700'
    }
  }

  if (!user) return <div className="p-8 text-center text-gray-500">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Proposals</h1>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading proposals...</div>
      ) : proposals.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <p className="text-gray-400 mb-4">You haven't submitted any proposals yet</p>
          <Link to="/search" className="text-blue-600 hover:text-blue-700 font-medium text-sm">Browse Projects</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {proposals.map((proposal: any) => (
            <div key={proposal._id} className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <Link to={`/project/${proposal.projectId?._id}`} className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                    {proposal.projectId?.title || 'Untitled Project'}
                  </Link>
                  <p className="text-sm text-gray-500">{proposal.projectId?.category}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(proposal.status)}`}>
                  {proposal.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                <div>
                  <span className="text-gray-500">Project Budget:</span>
                  <span className="ml-2 font-medium">${proposal.projectId?.budget}</span>
                </div>
                <div>
                  <span className="text-gray-500">Your Bid:</span>
                  <span className="ml-2 font-medium">${proposal.proposedBudget}</span>
                </div>
                <div>
                  <span className="text-gray-500">Timeline:</span>
                  <span className="ml-2 font-medium">{proposal.timeline}</span>
                </div>
              </div>

              <p className="text-gray-500 text-sm line-clamp-2">{proposal.coverLetter}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyProposals
