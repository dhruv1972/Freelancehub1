import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [coverLetter, setCoverLetter] = useState('')
  const [proposedBudget, setProposedBudget] = useState('')
  const [timeline, setTimeline] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // sample project data (TODO: fetch from API)
  const [project] = useState({
    _id: id,
    title: 'E-commerce Website Development',
    description: 'Need a full-stack developer to build an online store with payment integration. The website should have product listings, shopping cart, checkout process, and admin dashboard.',
    category: 'Web Development',
    budget: 2000,
    timeline: '4 weeks',
    requirements: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    status: 'open',
    client: { firstName: 'John', lastName: 'Smith', _id: 'client123' }
  })

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // TODO: connect to backend API
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSubmitted(true)
    } catch (err) {
      alert('Failed to submit proposal')
    } finally {
      setLoading(false)
    }
  }

  const isFreelancer = user?.userType === 'freelancer'

  return (
    <div className="max-w-4xl mx-auto p-4 py-8">
      {/* Project Details */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold">{project.title}</h1>
          <span className={`px-3 py-1 rounded text-sm ${
            project.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
          }`}>
            {project.status}
          </span>
        </div>

        <p className="text-gray-600 mb-4">{project.description}</p>

        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Budget</p>
            <p className="font-semibold">${project.budget}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Timeline</p>
            <p className="font-semibold">{project.timeline}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Category</p>
            <p className="font-semibold">{project.category}</p>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">Required Skills</p>
          <div className="flex flex-wrap gap-2">
            {project.requirements.map((skill, i) => (
              <span key={i} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <p className="text-sm text-gray-500">
          Posted by: {project.client.firstName} {project.client.lastName}
        </p>
      </div>

      {/* Submit Proposal Form (for freelancers) */}
      {isFreelancer && project.status === 'open' && !submitted && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Submit a Proposal</h2>
          
          <form onSubmit={handleSubmitProposal}>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Cover Letter</label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="w-full border p-2 rounded"
                rows={5}
                placeholder="Explain why you're the best fit for this project..."
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-1 font-medium">Your Bid ($)</label>
                <input
                  type="number"
                  value={proposedBudget}
                  onChange={(e) => setProposedBudget(e.target.value)}
                  className="w-full border p-2 rounded"
                  placeholder="1500"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Delivery Time</label>
                <input
                  type="text"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className="w-full border p-2 rounded"
                  placeholder="3 weeks"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
            >
              {loading ? 'Submitting...' : 'Submit Proposal'}
            </button>
          </form>
        </div>
      )}

      {submitted && (
        <div className="bg-green-100 text-green-700 p-6 rounded-lg text-center">
          <h2 className="text-xl font-bold mb-2">Proposal Submitted!</h2>
          <p>Your proposal has been sent to the client.</p>
          <button
            onClick={() => navigate('/my-proposals')}
            className="mt-4 text-blue-600 hover:underline"
          >
            View My Proposals
          </button>
        </div>
      )}

      {!user && (
        <div className="bg-gray-100 p-6 rounded-lg text-center">
          <p className="mb-2">Login to submit a proposal</p>
          <button
            onClick={() => navigate('/login')}
            className="text-blue-600 hover:underline"
          >
            Login
          </button>
        </div>
      )}
    </div>
  )
}

export default ProjectDetail

