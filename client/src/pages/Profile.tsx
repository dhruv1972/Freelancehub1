import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, withUser } from '../services/api'

function Profile() {
  const [user, setUser] = useState<any>(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [bio, setBio] = useState('')
  const [skills, setSkills] = useState('')
  const [location, setLocation] = useState('')
  const [experience, setExperience] = useState('')
  const [portfolio, setPortfolio] = useState<Array<{ title: string; description: string; link: string }>>([])
  const [resume, setResume] = useState('') // data URL for freelancer resume
  const [resumeFileName, setResumeFileName] = useState('')
  const [rating, setRating] = useState<number | null>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isEditing, setIsEditing] = useState(false)

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
      const res = await api.get(`/profile/${currentUser._id}`)
      if (res.data) {
        setFirstName(res.data.firstName || '')
        setLastName(res.data.lastName || '')
        setBio(res.data.profile?.bio || '')
        setSkills(res.data.profile?.skills?.join(', ') || '')
        setLocation(res.data.profile?.location || '')
        setExperience(res.data.profile?.experience || '')
        setResume(res.data.profile?.resume || '')
        setResumeFileName(res.data.profile?.resumeFileName || '')
        setPortfolio(res.data.profile?.portfolio || [])
        setRating(res.data.profile?.rating != null ? res.data.profile.rating : null)
        setIsEditing(false)
      }
      const revRes = await api.get(`/reviews/user/${currentUser._id}`).catch(() => ({ data: [] }))
      const list = Array.isArray(revRes.data) ? revRes.data : []
      if (currentUser.userType === 'freelancer') {
        setReviews(list.filter((r: any) => r.reviewType === 'client-to-freelancer'))
      } else {
        setReviews(list.filter((r: any) => r.reviewType === 'freelancer-to-client'))
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
      await api.put(`/profile/${user._id}`, {
        firstName,
        lastName,
        userType: user.userType,
        profile: {
          bio,
          skills: skills.split(',').map(s => s.trim()).filter(Boolean),
          location,
          experience,
          ...(user.userType === 'freelancer' && { resume, resumeFileName, portfolio })
        }
      })

      const updatedUser = { ...user, firstName, lastName }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setMessage('Profile updated successfully!')
      setIsEditing(false)
    } catch (err: any) {
      const serverError = err.response?.data?.error
      setMessage(serverError || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
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

  if (!user) return (
    <div className="page-content">
      <div style={{ padding: '80px 0', textAlign: 'center', color: '#999', fontSize: 15 }}>Loading your profile...</div>
    </div>
  )

  const fullName = `${firstName || user.firstName || ''} ${lastName || user.lastName || ''}`.trim() || user.email

  return (
    <div className="page-content" style={{ maxWidth: 720 }}>
      <header style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 8 }}>My Profile</h1>
          <p style={{ fontSize: 14, color: '#999' }}>
            {isEditing
              ? 'Update your details so clients can learn more about you.'
              : 'This is how your profile looks to others. You can edit it anytime.'}
          </p>
        </div>
        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="btn-primary"
            style={{ height: 40, padding: '0 18px', borderRadius: 10, fontSize: 14, fontWeight: 600 }}
          >
            Edit profile
          </button>
        )}
      </header>

      {message && (
        <div style={{
          padding: '12px 16px',
          borderRadius: 10,
          fontSize: 14,
          marginBottom: 24,
          background: message.includes('success') ? 'rgba(74,222,128,0.08)' : 'rgba(248,113,113,0.08)',
          color: message.includes('success') ? '#4ade80' : '#f87171',
          border: message.includes('success') ? '1px solid rgba(74,222,128,0.25)' : '1px solid rgba(248,113,113,0.25)',
        }} role="alert">
          {message}
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleSubmit} className="card" style={{ padding: 32 }}>
          <div className="grid md:grid-cols-2" style={{ gap: 20, marginBottom: 20 }}>
            <div>
              <label style={labelStyle}>First Name</label>
              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} style={inputStyle} required />
            </div>
            <div>
              <label style={labelStyle}>Last Name</label>
              <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} style={inputStyle} required />
            </div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Bio</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} style={textareaStyle} placeholder="Tell us about yourself..." />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Skills (comma separated)</label>
            <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)} style={inputStyle} placeholder="Separate skills with commas (e.g. React, Node.js)" />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Experience</label>
            <textarea value={experience} onChange={(e) => setExperience(e.target.value)} rows={3} style={textareaStyle} placeholder="Describe your work experience..." />
          </div>
          <div style={{ marginBottom: 28 }}>
            <label style={labelStyle}>Location</label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} style={inputStyle} placeholder="City, Country" />
          </div>
          {user.userType === 'freelancer' && (
            <>
              <div style={{ marginBottom: 28 }}>
                <label style={labelStyle}>Resume (PDF or Word, max 2MB)</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    if (file.size > 2 * 1024 * 1024) {
                      setMessage('Resume must be under 2MB')
                      return
                    }
                    const reader = new FileReader()
                    reader.onload = () => {
                      setResume(reader.result as string)
                      setResumeFileName(file.name)
                      setMessage('')
                    }
                    reader.readAsDataURL(file)
                  }}
                  style={{ ...inputStyle, padding: '10px 16px' }}
                />
                {resumeFileName && (
                  <p style={{ fontSize: 13, color: '#9ca3af', marginTop: 8 }}>Current: {resumeFileName}</p>
                )}
              </div>

              <div style={{ marginBottom: 28 }}>
                <label style={labelStyle}>Portfolio pieces</label>
                <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 8 }}>
                  Add links to your best work so clients can quickly see what you’ve built.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {portfolio.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 10,
                        border: '1px solid #333',
                        background: '#0b0b0b',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                      }}
                    >
                      <input
                        type="text"
                        placeholder="Title (e.g. E‑commerce web app)"
                        value={item.title}
                        onChange={(e) => {
                          const next = [...portfolio]
                          next[index] = { ...next[index], title: e.target.value }
                          setPortfolio(next)
                        }}
                        style={inputStyle}
                      />
                      <textarea
                        placeholder="Short description of this project..."
                        value={item.description}
                        onChange={(e) => {
                          const next = [...portfolio]
                          next[index] = { ...next[index], description: e.target.value }
                          setPortfolio(next)
                        }}
                        rows={3}
                        style={textareaStyle}
                      />
                      <input
                        type="url"
                        placeholder="Link (GitHub, live demo, Dribbble, etc.)"
                        value={item.link}
                        onChange={(e) => {
                          const next = [...portfolio]
                          next[index] = { ...next[index], link: e.target.value }
                          setPortfolio(next)
                        }}
                        style={inputStyle}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPortfolio(portfolio.filter((_, i) => i !== index))
                        }}
                        style={{
                          alignSelf: 'flex-start',
                          marginTop: 4,
                          fontSize: 12,
                          color: '#f97373',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setPortfolio([
                        ...portfolio,
                        { title: '', description: '', link: '' },
                      ])
                    }
                    style={{
                      alignSelf: 'flex-start',
                      padding: '6px 12px',
                      borderRadius: 999,
                      border: '1px dashed #4b5563',
                      background: '#020617',
                      color: '#e5e7eb',
                      fontSize: 13,
                      cursor: 'pointer',
                    }}
                  >
                    + Add portfolio piece
                  </button>
                </div>
              </div>
            </>
          )}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <button
              type="button"
              onClick={() => { setIsEditing(false); setMessage('') }}
              style={{
                height: 44,
                padding: '0 18px',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 500,
                border: '1px solid #333',
                background: '#1a1a1a',
                color: '#e5e5e5',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ height: 44, padding: '0 22px', borderRadius: 10, fontSize: 15, fontWeight: 600, opacity: loading ? 0.6 : 1 }}
            >
              {loading ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      ) : (
        <div className="card" style={{ padding: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '999px',
                background: '#1f2933',
                border: '1px solid #374151',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                fontWeight: 600,
                color: '#5eead4',
              }}
            >
              {(firstName || user.firstName || user.email || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 600, color: '#fff' }}>{fullName}</div>
              <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 4 }}>{user.email}</div>
            </div>
          </div>

          {bio && (
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Bio</div>
              <p style={{ fontSize: 14, color: '#e5e7eb', lineHeight: 1.6 }}>{bio}</p>
            </div>
          )}

          {skills && (
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Skills</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {skills.split(',').map(s => s.trim()).filter(Boolean).map(skill => (
                  <span
                    key={skill}
                    style={{
                      fontSize: 12,
                      padding: '4px 10px',
                      borderRadius: 999,
                      background: 'rgba(148,163,184,0.18)',
                      color: '#e5e7eb',
                      border: '1px solid rgba(148,163,184,0.4)',
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {experience && (
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Experience</div>
              <p style={{ fontSize: 14, color: '#e5e7eb', lineHeight: 1.6 }}>{experience}</p>
            </div>
          )}

          {location && (
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Location</div>
              <p style={{ fontSize: 14, color: '#e5e7eb' }}>{location}</p>
            </div>
          )}

          {user.userType === 'freelancer' && resume && (
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Resume</div>
              <a
                href={resume}
                download={resumeFileName || 'resume.pdf'}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 16px',
                  borderRadius: 10,
                  background: 'rgba(94,234,212,0.12)',
                  color: '#5eead4',
                  border: '1px solid rgba(94,234,212,0.3)',
                  fontSize: 14,
                  fontWeight: 500,
                  textDecoration: 'none',
                }}
              >
                Download resume {resumeFileName ? `(${resumeFileName})` : ''}
              </a>
            </div>
          )}

          {user.userType === 'freelancer' && (rating != null || reviews.length > 0) && (
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>My rating & reviews (from clients)</div>
              <div style={{ padding: '12px 14px', borderRadius: 10, background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', marginBottom: 12 }}>
                <p style={{ fontSize: 14, color: '#fbbf24', fontWeight: 600 }}>
                  ⭐ Overall rating: {(rating != null ? rating : reviews.length ? reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length : 0).toFixed(1)} / 5
                  {reviews.length > 0 && (
                    <span style={{ fontSize: 13, color: '#9ca3af', fontWeight: 400 }}> ({reviews.length} review{reviews.length === 1 ? '' : 's'})</span>
                  )}
                </p>
              </div>
              {reviews.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {reviews.map((r: any) => (
                    <div
                      key={r._id}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 10,
                        border: '1px solid #333',
                        background: '#0b0b0b',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 500, color: '#e5e7eb' }}>
                          {r.reviewerId?.firstName} {r.reviewerId?.lastName}
                        </span>
                        <span style={{ fontSize: 13, color: '#fbbf24' }}>⭐ {r.rating}/5</span>
                      </div>
                      {r.projectId?.title && (
                        <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Project: {r.projectId.title}</p>
                      )}
                      <p style={{ fontSize: 14, color: '#d1d5db', lineHeight: 1.5 }}>{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {user.userType === 'client' && (
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Feedback from freelancers</div>
              {reviews.length === 0 ? (
                <p style={{ fontSize: 14, color: '#9ca3af' }}>No feedback from freelancers yet. Complete payments for your projects and freelancers can leave you a review.</p>
              ) : (
                <>
                  <div style={{ padding: '12px 14px', borderRadius: 10, background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', marginBottom: 12 }}>
                    <p style={{ fontSize: 14, color: '#fbbf24', fontWeight: 600 }}>
                      ⭐ Overall: {(reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1)} / 5
                      <span style={{ fontSize: 13, color: '#9ca3af', fontWeight: 400 }}> ({reviews.length} review{reviews.length === 1 ? '' : 's'})</span>
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {reviews.map((r: any) => (
                      <div
                        key={r._id}
                        style={{
                          padding: '12px 14px',
                          borderRadius: 10,
                          border: '1px solid #333',
                          background: '#0b0b0b',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                          <span style={{ fontSize: 13, fontWeight: 500, color: '#e5e7eb' }}>
                            {r.reviewerId?.firstName} {r.reviewerId?.lastName}
                          </span>
                          <span style={{ fontSize: 13, color: '#fbbf24' }}>⭐ {r.rating}/5</span>
                        </div>
                        {r.projectId?.title && (
                          <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Project: {r.projectId.title}</p>
                        )}
                        <p style={{ fontSize: 14, color: '#d1d5db', lineHeight: 1.5 }}>{r.comment}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {user.userType === 'freelancer' && portfolio && portfolio.length > 0 && (
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
                Portfolio
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {portfolio.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 10,
                      border: '1px solid #1f2937',
                      background: '#020617',
                    }}
                  >
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#e5e7eb', marginBottom: 4 }}>
                      {item.title || 'Untitled project'}
                    </div>
                    {item.description && (
                      <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 4 }}>
                        {item.description}
                      </p>
                    )}
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        style={{ fontSize: 13, color: '#5eead4', textDecoration: 'underline' }}
                      >
                        View project
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {!bio && !skills && !experience && !location && !(user.userType === 'freelancer' && resume) && !(user.userType === 'freelancer' && portfolio && portfolio.length > 0) && !(user.userType === 'freelancer' && (rating != null || reviews.length > 0)) && (
            <p style={{ fontSize: 14, color: '#9ca3af' }}>
              Your profile is a bit empty. Click <span style={{ color: '#5eead4' }}>Edit profile</span> to add more details and stand out to clients.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default Profile
