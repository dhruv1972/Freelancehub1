import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function MyProposals() {
  const [user, setUser] = useState<any>(null)
  const navigate = useNavigate()

  // sample proposals data (TODO: fetch from API)
  const [proposals] = useState([
    {
      _id: '1',
      projectId: { _id: 'p1', title: 'E-commerce Website', budget: 2000, category: 'Web Development' },
      coverLetter: 'I have 5 years of experience in React and Node.js...',
      proposedBudget: 1800,
      timeline: '3 weeks',
      status: 'pending',
      createdAt: '2026-01-25'
    },
    {
      _id: '2',
      projectId: { _id: 'p2', title: 'Mobile App Design', budget: 1000, category: 'UI/UX Design' },
      coverLetter: 'As a UI/UX designer with expertise in mobile apps...',
      proposedBudget: 900,
      timeline: '2 weeks',
      status: 'accepted',
      createdAt: '2026-01-20'
    },
    {
      _id: '3',
      projectId: { _id: 'p3', title: 'Logo Design', budget: 200, category: 'Design' },
      coverLetter: 'I would love to create a unique logo for your brand...',
      proposedBudget: 150,
      timeline: '5 days',
      status: 'rejected',
      createdAt: '2026-01-18'
    }
  ])

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      navigate('/login')
      return
    }
    setUser(JSON.parse(userData))
  }, [navigate])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-700'
      case 'rejected': return 'bg-red-100 text-red-700'
      default: return 'bg-yellow-100 text-yellow-700'
    }
  }

  if (!user) return <div className="p-8">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto p-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Proposals</h1>

      {proposals.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-500 mb-4">You haven't submitted any proposals yet</p>
          <Link to="/search" className="text-blue-600 hover:underline">
            Browse Projects
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {proposals.map(proposal => (
            <div key={proposal._id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <Link 
                    to={`/project/${proposal.projectId._id}`}
                    className="text-lg font-semibold hover:text-blue-600"
                  >
                    {proposal.projectId.title}
                  </Link>
                  <p className="text-sm text-gray-500">{proposal.projectId.category}</p>
                </div>
                <span className={`px-3 py-1 rounded text-sm capitalize ${getStatusColor(proposal.status)}`}>
                  {proposal.status}
                </span>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-3 text-sm">
                <div>
                  <span className="text-gray-500">Project Budget:</span>
                  <span className="ml-2 font-medium">${proposal.projectId.budget}</span>
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

              <p className="text-gray-600 text-sm line-clamp-2">{proposal.coverLetter}</p>
              
              <p className="text-xs text-gray-400 mt-3">
                Submitted: {new Date(proposal.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyProposals

