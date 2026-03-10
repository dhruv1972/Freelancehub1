import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  const [userType, setUserType] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setUserType(parsed.userType || null)
      } catch {
        setUserType(null)
      }
    } else {
      setUserType(null)
    }
  }, [])

  const showFreelancerLinks = !userType || userType === 'freelancer'
  const showClientLinks = !userType || userType === 'client'

  return (
    <footer className="mt-auto" style={{ background: '#1a1a1a', borderTop: '1px solid #333' }}>
      <div className="container-app" style={{ paddingTop: 48, paddingBottom: 32 }}>

        {/* Top row: columns */}
        <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: 32, marginBottom: 40 }}>
          {/* Brand */}
          <div>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#252525', border: '1px solid #404040', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#5eead4', fontWeight: 700, fontSize: 15 }}>F</span>
              </div>
              <span style={{ fontSize: 17, fontWeight: 700, color: '#fff' }}>Freelance<span style={{ color: '#5eead4' }}>Hub</span></span>
            </Link>
            <p style={{ fontSize: 13, color: '#777', lineHeight: 1.6, marginTop: 12 }}>
              Connecting freelancers with clients worldwide. Find work or hire talent — fast, secure, and simple.
            </p>
          </div>

          {/* For Freelancers */}
          {showFreelancerLinks && (
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 0.5 }}>For Freelancers</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Link to="/search" style={{ fontSize: 13, color: '#999', textDecoration: 'none' }} className="hover:text-white transition">Find Work</Link>
                <Link to="/register?role=freelancer" style={{ fontSize: 13, color: '#999', textDecoration: 'none' }} className="hover:text-white transition">Create Account</Link>
                <Link to="/dashboard" style={{ fontSize: 13, color: '#999', textDecoration: 'none' }} className="hover:text-white transition">Dashboard</Link>
              </div>
            </div>
          )}

          {/* For Clients */}
          {showClientLinks && (
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 0.5 }}>For Clients</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Link to="/find-freelancers" style={{ fontSize: 13, color: '#999', textDecoration: 'none' }} className="hover:text-white transition">Find Talent</Link>
                <Link to="/create-project" style={{ fontSize: 13, color: '#999', textDecoration: 'none' }} className="hover:text-white transition">Post a Project</Link>
                <Link to="/register?role=client" style={{ fontSize: 13, color: '#999', textDecoration: 'none' }} className="hover:text-white transition">Sign Up</Link>
              </div>
            </div>
          )}

          {/* Company */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 0.5 }}>Company</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a href="#" style={{ fontSize: 13, color: '#999', textDecoration: 'none' }} className="hover:text-white transition">About Us</a>
              <a href="#" style={{ fontSize: 13, color: '#999', textDecoration: 'none' }} className="hover:text-white transition">Contact</a>
              <a href="#" style={{ fontSize: 13, color: '#999', textDecoration: 'none' }} className="hover:text-white transition">Privacy Policy</a>
              <a href="#" style={{ fontSize: 13, color: '#999', textDecoration: 'none' }} className="hover:text-white transition">Terms of Service</a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid #333', paddingTop: 20, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <p style={{ fontSize: 13, color: '#666' }}>© 2024–{new Date().getFullYear()} FreelanceHub Inc. All rights reserved.</p>
          <div style={{ display: 'flex', gap: 20 }}>
            <a href="#" style={{ fontSize: 13, color: '#666', textDecoration: 'none' }} className="hover:text-white transition">Privacy</a>
            <a href="#" style={{ fontSize: 13, color: '#666', textDecoration: 'none' }} className="hover:text-white transition">Terms</a>
            <a href="#" style={{ fontSize: 13, color: '#666', textDecoration: 'none' }} className="hover:text-white transition">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
