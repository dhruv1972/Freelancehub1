import { useState } from 'react'
import { Link } from 'react-router-dom'

function Search() {
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState('')
  const [minBudget, setMinBudget] = useState('')
  const [maxBudget, setMaxBudget] = useState('')

  // sample project data (TODO: fetch from API)
  const [projects] = useState([
    {
      _id: '1',
      title: 'E-commerce Website Development',
      description: 'Need a full-stack developer to build an online store with payment integration.',
      category: 'Web Development',
      budget: 2000,
      timeline: '4 weeks',
      client: { firstName: 'John', lastName: 'Smith' }
    },
    {
      _id: '2',
      title: 'Mobile App UI Design',
      description: 'Looking for a UI/UX designer to create mockups for a fitness app.',
      category: 'UI/UX Design',
      budget: 800,
      timeline: '2 weeks',
      client: { firstName: 'Sarah', lastName: 'Johnson' }
    },
    {
      _id: '3',
      title: 'WordPress Blog Setup',
      description: 'Simple WordPress blog with custom theme needed.',
      category: 'Web Development',
      budget: 300,
      timeline: '1 week',
      client: { firstName: 'Mike', lastName: 'Davis' }
    }
  ])

  const categories = [
    'Web Development',
    'Mobile Apps',
    'UI/UX Design',
    'Data Science',
    'DevOps',
    'Writing',
    'Marketing'
  ]

  // filter projects based on search
  const filteredProjects = projects.filter(project => {
    const matchesSearch = !searchQuery || 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = !category || project.category === category
    
    const matchesMinBudget = !minBudget || project.budget >= Number(minBudget)
    const matchesMaxBudget = !maxBudget || project.budget <= Number(maxBudget)

    return matchesSearch && matchesCategory && matchesMinBudget && matchesMaxBudget
  })

  return (
    <div className="max-w-6xl mx-auto p-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Browse Projects</h1>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="Search projects..."
            />
          </div>
          <div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              value={minBudget}
              onChange={(e) => setMinBudget(e.target.value)}
              className="w-1/2 border p-2 rounded"
              placeholder="Min $"
            />
            <input
              type="number"
              value={maxBudget}
              onChange={(e) => setMaxBudget(e.target.value)}
              className="w-1/2 border p-2 rounded"
              placeholder="Max $"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {filteredProjects.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No projects found</p>
        ) : (
          filteredProjects.map(project => (
            <div key={project._id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
                  <p className="text-gray-600 mb-3">{project.description}</p>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span className="bg-gray-100 px-2 py-1 rounded">{project.category}</span>
                    <span>Budget: ${project.budget}</span>
                    <span>Timeline: {project.timeline}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Posted by: {project.client.firstName} {project.client.lastName}
                  </p>
                </div>
                <Link
                  to={`/project/${project._id}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Search

