import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '../services/api'

function Register() {
  const [searchParams] = useSearchParams()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [userType, setUserType] = useState('freelancer')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const role = searchParams.get('role')
    if (role === 'client' || role === 'freelancer') setUserType(role)
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) { setError('Passwords do not match.'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    try {
      const res = await api.post('/auth/register', { firstName, lastName, email, password, userType })
      localStorage.setItem('user', JSON.stringify(res.data.user))
      localStorage.setItem('token', res.data.token)
      navigate('/dashboard')
      window.location.reload()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = { width: '100%', height: 48, padding: '0 16px', fontSize: 15, color: '#f9fafb', background: '#111111', border: '1px solid #404040', borderRadius: 10, outline: 'none' }
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: 14, fontWeight: 500, color: '#ccc', marginBottom: 8 }
  const focus = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = '#5eead4'; e.target.style.boxShadow = '0 0 0 3px rgba(94,234,212,0.15)' }
  const blur = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = '#333'; e.target.style.boxShadow = 'none' }

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 16px' }}>
      <div style={{ width: '100%', maxWidth: 480 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 28, textDecoration: 'none' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#252525', border: '1px solid #404040', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#5eead4', fontWeight: 700, fontSize: 18 }}>F</span>
            </div>
            <span style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>Freelance<span style={{ color: '#5eead4' }}>Hub</span></span>
          </Link>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Create your account</h1>
          <p style={{ fontSize: 15, color: '#e5e5e5' }}>Join FreelanceHub — it takes less than a minute</p>
        </div>

        {/* Card */}
        <div style={{ background: '#252525', border: '1px solid #404040', borderRadius: 16, padding: '36px 32px' }}>
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', borderRadius: 10, padding: '12px 16px', fontSize: 14, marginBottom: 24 }} role="alert">
              {error}
            </div>
          )}

          {/* Role selector */}
          <p style={{ fontSize: 14, fontWeight: 500, color: '#ccc', marginBottom: 12 }}>I want to</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
            {(['freelancer', 'client'] as const).map(role => (
              <button
                key={role}
                type="button"
                onClick={() => setUserType(role)}
                style={{
                  padding: '16px 12px',
                  borderRadius: 12,
                  border: userType === role ? '2px solid #5eead4' : '2px solid #333',
                  background: userType === role ? 'rgba(94,234,212,0.08)' : '#1f1f1f',
                  color: userType === role ? '#5eead4' : '#e5e5e5',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                <span style={{ fontSize: 24, display: 'block', marginBottom: 6 }}>{role === 'freelancer' ? '💼' : '🏢'}</span>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{role === 'freelancer' ? 'Find work' : 'Hire talent'}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Name row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
              <div>
                <label htmlFor="reg-first" style={labelStyle}>First name</label>
                <input id="reg-first" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} style={inputStyle} placeholder="John" required onFocus={focus} onBlur={blur} />
              </div>
              <div>
                <label htmlFor="reg-last" style={labelStyle}>Last name</label>
                <input id="reg-last" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} style={inputStyle} placeholder="Doe" required onFocus={focus} onBlur={blur} />
              </div>
            </div>

            <div style={{ marginBottom: 18 }}>
              <label htmlFor="reg-email" style={labelStyle}>Email address</label>
              <input id="reg-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} placeholder="you@example.com" required onFocus={focus} onBlur={blur} />
            </div>

            <div style={{ marginBottom: 18 }}>
              <label htmlFor="reg-password" style={labelStyle}>Password</label>
              <input id="reg-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} placeholder="Minimum 6 characters" required onFocus={focus} onBlur={blur} />
            </div>

            <div style={{ marginBottom: 28 }}>
              <label htmlFor="reg-confirm" style={labelStyle}>Confirm password</label>
              <input id="reg-confirm" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={inputStyle} placeholder="Re-enter your password" required onFocus={focus} onBlur={blur} />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', height: 50, borderRadius: 10, fontSize: 15, fontWeight: 600 }}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        </div>

        {/* Footer link */}
        <p style={{ textAlign: 'center', marginTop: 28, fontSize: 14, color: '#e5e5e5' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#5eead4', fontWeight: 500, textDecoration: 'none' }}
            onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
            onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
          >Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
