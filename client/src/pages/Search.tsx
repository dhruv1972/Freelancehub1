import { useState } from 'react'
import { Link } from 'react-router-dom'

function Search() {
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState('')
  const [minBudget, setMinBudget] = useState('')
  const [maxBudget, setMaxBudget] = useState('')

  const [projects] = useState([
    {
      _id: '1',
      title: 'E-commerce Website Development',
      description: 'Need a full-stack developer to build an online store with payment integration and admin panel.',
      category: 'Web Development',
      budget: 2000,
      timeline: '4 weeks',
      requirements: ['React', 'Node.js', 'Stripe'],
      client: { firstName: 'John', lastName: 'Smith' }
    },
    {
      _id: '2',
      title: 'Mobile App UI Design',
      description: 'Looking for a UI/UX designer to create modern mockups for a fitness tracking app.',
      category: 'UI/UX Design',
      budget: 800,
      timeline: '2 weeks',
      requirements: ['Figma', 'Mobile Design'],
      client: { firstName: 'Sarah', lastName: 'Johnson' }
    },
    {
      _id: '3',
      title: 'WordPress Blog Setup',
      description: 'Simple WordPress blog with custom theme and SEO optimization needed.',
      category: 'Web Development',
      budget: 300,
      timeline: '1 week',
      requirements: ['WordPress', 'SEO'],
      client: { firstName: 'Mike', lastName: 'Davis' }
    }
  ])

  const categories = ['Web Development', 'Mobile Apps', 'UI/UX Design', 'Data Science', 'DevOps', 'Writing', 'Marketing']

  const filtered = projects.filter(project => {
    const matchesSearch = !searchQuery || 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !category || project.category === category
    const matchesMin = !minBudget || project.budget >= Number(minBudget)
    const matchesMax = !maxBudget || project.budget <= Number(maxBudget)
    return matchesSearch && matchesCategory && matchesMin && matchesMax
  })

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Browse Projects</h1>
        <p className="text-gray-500 mt-1">Find your next freelance opportunity</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
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
          <div className="flex gap-2">
            <input
              type="number"
              value={minBudget}
              onChange={(e) => setMinBudget(e.target.value)}
              className="w-1/2 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Min $"
            />
            <input
              type="number"
              value={maxBudget}
              onChange={(e) => setMaxBudget(e.target.value)}
              className="w-1/2 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Max $"
            />
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-4">{filtered.length} projects found</p>

      {/* Results */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <p className="text-gray-400 text-lg mb-2">No projects found</p>
            <p className="text-gray-400 text-sm">Try adjusting your search filters</p>
          </div>
        ) : (
          filtered.map(project => (
            <div key={project._id} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-200 hover:shadow-sm transition">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <Link to={`/project/${project._id}`} className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition">
                    {project.title}
                  </Link>
                  <p className="text-gray-500 text-sm mt-2 leading-relaxed">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    {project.requirements.map((skill, i) => (
                      <span key={i} className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-xs font-medium">{skill}</span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                    <span className="font-medium text-gray-900">${project.budget}</span>
                    <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs">{project.category}</span>
                    <span>{project.timeline}</span>
                    <span>by {project.client.firstName} {project.client.lastName}</span>
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
          ))
        )}
      </div>
    </div>
  )
}

export default Search
