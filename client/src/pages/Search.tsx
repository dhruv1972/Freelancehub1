import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'

function Search() {
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState('')
  const [minBudget] = useState('')
  const [maxBudget] = useState('')
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const categories = ['Web Development', 'Mobile Apps', 'UI/UX Design', 'Data Science', 'DevOps', 'Writing', 'Marketing']

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    setLoading(true)
    try {
      const params: any = {}
      if (searchQuery) params.q = searchQuery
      if (category) params.category = category
      if (minBudget) params.minBudget = minBudget
      if (maxBudget) params.maxBudget = maxBudget

      const res = await api.get('/projects', { params })
      setProjects(res.data?.projects || res.data || [])
    } catch (err) {
      console.error('Failed to load projects:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    loadProjects()
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Browse Projects</h1>
        <p className="text-gray-500 mt-1">Find your next freelance opportunity</p>
      </div>

      <form onSubmit={handleSearch} className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
        <div className="grid md:grid-cols-4 gap-3">
          <div className="md:col-span-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search by title or keyword..."
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button type="submit" className="bg-blue-600 text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-blue-700 transition">
            Search
          </button>
        </div>
      </form>

      <p className="text-sm text-gray-500 mb-4">{projects.length} projects found</p>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <p className="text-gray-400 text-lg mb-2">No projects found</p>
          <p className="text-gray-400 text-sm">Try adjusting your search filters</p>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project: any) => (
            <div key={project._id} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-200 hover:shadow-sm transition">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <Link to={`/project/${project._id}`} className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition">
                    {project.title}
                  </Link>
                  <p className="text-gray-500 text-sm mt-2 leading-relaxed">{project.description?.slice(0, 150)}...</p>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    {project.requirements?.map((skill: string, i: number) => (
                      <span key={i} className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-xs font-medium">{skill}</span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                    <span className="font-medium text-gray-900">${project.budget}</span>
                    <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs">{project.category}</span>
                    <span>{project.timeline}</span>
                  </div>
                </div>
                <Link
                  to={`/project/${project._id}`}
                  className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition hidden md:block"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Search
