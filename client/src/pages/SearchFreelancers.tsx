import { useState } from 'react'
import { Link } from 'react-router-dom'

function SearchFreelancers() {
  const [searchQuery, setSearchQuery] = useState('')
  const [skillsFilter, setSkillsFilter] = useState('')
  const [locationFilter, setLocationFilter] = useState('')

  // sample freelancer data (TODO: fetch from API)
  const [freelancers] = useState([
    {
      _id: 'f1',
      firstName: 'Alex',
      lastName: 'Chen',
      profile: {
        bio: 'Full-stack developer with 5 years experience in React and Node.js',
        skills: ['React', 'Node.js', 'TypeScript', 'MongoDB'],
        location: 'Toronto, Canada',
        rating: 4.9
      }
    },
    {
      _id: 'f2',
      firstName: 'Maria',
      lastName: 'Garcia',
      profile: {
        bio: 'UI/UX designer specializing in mobile app interfaces',
        skills: ['Figma', 'UI Design', 'Mobile Apps', 'Prototyping'],
        location: 'Vancouver, Canada',
        rating: 4.7
      }
    },
    {
      _id: 'f3',
      firstName: 'James',
      lastName: 'Wilson',
      profile: {
        bio: 'Backend developer experienced in APIs and cloud services',
        skills: ['Python', 'AWS', 'Docker', 'PostgreSQL'],
        location: 'Montreal, Canada',
        rating: 4.5
      }
    },
    {
      _id: 'f4',
      firstName: 'Priya',
      lastName: 'Sharma',
      profile: {
        bio: 'WordPress developer and SEO specialist',
        skills: ['WordPress', 'PHP', 'SEO', 'HTML/CSS'],
        location: 'Mississauga, Canada',
        rating: 4.3
      }
    }
  ])

  // filter freelancers
  const filtered = freelancers.filter(f => {
    const matchesSearch = !searchQuery ||
      `${f.firstName} ${f.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.profile.bio.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesSkills = !skillsFilter ||
      f.profile.skills.some(s => s.toLowerCase().includes(skillsFilter.toLowerCase()))

    const matchesLocation = !locationFilter ||
      f.profile.location.toLowerCase().includes(locationFilter.toLowerCase())

    return matchesSearch && matchesSkills && matchesLocation
  })

  return (
    <div className="max-w-6xl mx-auto p-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Find Freelancers</h1>

      {/* Search Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid md:grid-cols-3 gap-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Search by name or bio..."
          />
          <input
            type="text"
            value={skillsFilter}
            onChange={(e) => setSkillsFilter(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Filter by skill..."
          />
          <input
            type="text"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Filter by location..."
          />
        </div>
      </div>

      {/* Results */}
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <p className="text-gray-500 col-span-2 text-center py-8">No freelancers found</p>
        ) : (
          filtered.map(freelancer => (
            <div key={freelancer._id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {freelancer.firstName.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h2 className="font-semibold text-lg">
                      {freelancer.firstName} {freelancer.lastName}
                    </h2>
                    <span className="text-yellow-500 font-medium">
                      ⭐ {freelancer.profile.rating}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{freelancer.profile.location}</p>
                  <p className="text-gray-600 text-sm mt-2">{freelancer.profile.bio}</p>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {freelancer.profile.skills.map((skill, i) => (
                      <span key={i} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <Link
                    to={`/profile/${freelancer._id}`}
                    className="text-blue-600 hover:underline text-sm mt-3 inline-block"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default SearchFreelancers

