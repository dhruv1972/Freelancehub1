import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { withUser } from '../services/api'

function Profile() {
  const [user, setUser] = useState<any>(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [bio, setBio] = useState('')
  const [skills, setSkills] = useState('')
  const [location, setLocation] = useState('')
  const [experience, setExperience] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      navigate('/login')
      return
    }
    const parsed = JSON.parse(userData)
    setUser(parsed)
    loadProfile(parsed)
  }, [navigate])

  const loadProfile = async (currentUser: any) => {
    try {
      const userApi = withUser(currentUser.email)
      const res = await userApi.get('/profile/me')
      if (res.data) {
        setFirstName(res.data.firstName || '')
        setLastName(res.data.lastName || '')
        setBio(res.data.profile?.bio || '')
        setSkills(res.data.profile?.skills?.join(', ') || '')
        setLocation(res.data.profile?.location || '')
        setExperience(res.data.profile?.experience || '')
      }
    } catch (err) {
      console.error('Failed to load profile:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const userApi = withUser(user.email)
      await userApi.post('/profile', {
        firstName,
        lastName,
        userType: user.userType,
        profile: {
          bio,
          skills: skills.split(',').map(s => s.trim()).filter(Boolean),
          location,
          experience
        }
      })

      const updatedUser = { ...user, firstName, lastName }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setMessage('Profile updated successfully!')
    } catch (err) {
      setMessage('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  if (!user) return <div className="p-8 text-center text-gray-500">Loading...</div>

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

      {message && (
        <div className={`px-4 py-3 rounded-lg text-sm mb-6 ${message.includes('success') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Tell us about yourself..." />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Skills (comma separated)</label>
          <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="React, TypeScript, Node.js" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Experience</label>
          <textarea value={experience} onChange={(e) => setExperience(e.target.value)} rows={3}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe your work experience..." />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="City, Country" />
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-300 transition text-sm">
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  )
}

export default Profile
