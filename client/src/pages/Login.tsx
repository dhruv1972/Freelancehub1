import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../services/api'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/login', { email, password })
      localStorage.setItem('user', JSON.stringify(res.data.user))
      localStorage.setItem('token', res.data.token)
      navigate('/dashboard')
      window.location.reload()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 16px' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 28, textDecoration: 'none' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#252525', border: '1px solid #404040', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#5eead4', fontWeight: 700, fontSize: 18 }}>F</span>
            </div>
            <span style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>Freelance<span style={{ color: '#5eead4' }}>Hub</span></span>
          </Link>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Welcome back</h1>
          <p style={{ fontSize: 15, color: '#999' }}>Sign in to your FreelanceHub account</p>
        </div>

        {/* Card */}
        <div style={{ background: '#252525', border: '1px solid #404040', borderRadius: 16, padding: '36px 32px' }}>
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', borderRadius: 10, padding: '12px 16px', fontSize: 14, marginBottom: 24 }} role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label htmlFor="login-email" style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#ccc', marginBottom: 8 }}>Email address</label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                style={{ width: '100%', height: 48, padding: '0 16px', fontSize: 15, color: '#fff', background: '#1a1a1a', border: '1px solid #333', borderRadius: 10, outline: 'none' }}
                onFocus={(e) => { e.target.style.borderColor = '#5eead4'; e.target.style.boxShadow = '0 0 0 3px rgba(94,234,212,0.15)' }}
                onBlur={(e) => { e.target.style.borderColor = '#333'; e.target.style.boxShadow = 'none' }}
              />
            </div>

            <div style={{ marginBottom: 28 }}>
              <label htmlFor="login-password" style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#ccc', marginBottom: 8 }}>Password</label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                style={{ width: '100%', height: 48, padding: '0 16px', fontSize: 15, color: '#fff', background: '#1a1a1a', border: '1px solid #333', borderRadius: 10, outline: 'none' }}
                onFocus={(e) => { e.target.style.borderColor = '#5eead4'; e.target.style.boxShadow = '0 0 0 3px rgba(94,234,212,0.15)' }}
                onBlur={(e) => { e.target.style.borderColor = '#333'; e.target.style.boxShadow = 'none' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', height: 50, borderRadius: 10, fontSize: 15, fontWeight: 600 }}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>

        {/* Footer link */}
        <p style={{ textAlign: 'center', marginTop: 28, fontSize: 14, color: '#999' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#5eead4', fontWeight: 500, textDecoration: 'none' }}
            onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
            onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
          >Sign up for free</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
