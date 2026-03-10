import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

function Home() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) setUser(JSON.parse(userData))
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(searchQuery.trim() ? `/search?q=${encodeURIComponent(searchQuery.trim())}` : '/search')
  }

  const steps = [
    { title: 'Post Project', desc: 'Post your requirements and let qualified freelancers send you proposals within hours.', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { title: 'Connect', desc: 'Review proposals, compare freelancers, and hire the best match for your project.', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
    { title: 'Collaborate & Pay', desc: 'Track milestones, communicate in real-time, and release secure payments on completion.', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  ]

  const categories = [
    { name: 'Web Development', count: '2,340+', icon: '💻' },
    { name: 'Mobile Apps', count: '1,890+', icon: '📱' },
    { name: 'UI/UX Design', count: '1,560+', icon: '🎨' },
    { name: 'Writing', count: '980+', icon: '✍️' },
    { name: 'Marketing', count: '720+', icon: '📈' },
    { name: 'Data Science', count: '650+', icon: '📊' },
  ]

  const S = (props: { d: string }) => (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth={1.4} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d={props.d} />
    </svg>
  )

  return (
    <div>

      {/* ═══ HERO — compact, content-dense ═══ */}
      <section style={{ background: 'linear-gradient(180deg, #272727 0%, #1e1e1e 100%)', borderBottom: '1px solid #333' }}>
        <div className="container-app" style={{ paddingTop: 60, paddingBottom: 60 }}>
          <div className="text-center" style={{ maxWidth: 700, margin: '0 auto' }}>
            <h1 className="font-bold text-white" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.15, marginBottom: 16 }}>
              Find Your Perfect Match
            </h1>
            <p style={{ fontSize: 'clamp(0.95rem, 1.5vw, 1.15rem)', color: '#999', marginBottom: 32, lineHeight: 1.6 }}>
              Connect with skilled freelancers or discover amazing projects
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center" style={{ gap: 14, marginBottom: 32 }}>
              {user ? (
                <>
                  {user.userType === 'freelancer' ? (
                    <Link to="/search" className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg font-semibold text-white transition hover:bg-[#3a3a3a]" style={{ height: 48, padding: '0 28px', fontSize: 14, background: '#2d2d2d', border: '1px solid #555' }}>
                      Browse Projects
                    </Link>
                  ) : (
                    <Link to="/create-project" className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg font-semibold text-white transition hover:bg-[#3a3a3a]" style={{ height: 48, padding: '0 28px', fontSize: 14, background: '#2d2d2d', border: '1px solid #555' }}>
                      Post a Project
                    </Link>
                  )}
                  <Link to="/dashboard" className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg font-semibold transition hover:bg-[#d4d4d4]" style={{ height: 48, padding: '0 28px', fontSize: 14, background: '#e5e5e5', color: '#1a1a1a', border: '1px solid #bbb' }}>
                    Go to Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register?role=freelancer" className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg font-semibold text-white transition hover:bg-[#3a3a3a]" style={{ height: 48, padding: '0 28px', fontSize: 14, background: '#2d2d2d', border: '1px solid #555' }}>
                    Get Started as Freelancer
                  </Link>
                  <Link to="/register?role=client" className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg font-semibold transition hover:bg-[#d4d4d4]" style={{ height: 48, padding: '0 28px', fontSize: 14, background: '#e5e5e5', color: '#1a1a1a', border: '1px solid #bbb' }}>
                    Hire Talent
                  </Link>
                </>
              )}
            </div>

            <form onSubmit={handleSearch}>
              <div className="flex overflow-hidden rounded-xl" style={{ height: 50, background: '#252525', border: '1px solid #444' }}>
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search projects or skills..." className="flex-1 bg-transparent text-white placeholder-[#666] focus:outline-none min-w-0" style={{ padding: '0 18px', fontSize: 14 }} />
                <button type="submit" className="shrink-0 font-semibold text-white transition hover:bg-[#555]" style={{ padding: '0 24px', fontSize: 14, background: '#444' }}>Search</button>
              </div>
            </form>
          </div>

          {/* Stats row */}
          <div className="flex items-center justify-center flex-wrap" style={{ gap: 40, marginTop: 40 }}>
            {[['10,000+', 'Freelancers'], ['5,000+', 'Projects Completed'], ['$2M+', 'Paid to Freelancers'], ['4.9/5', 'Average Rating']].map(([val, label]) => (
              <div key={label} className="text-center">
                <div className="font-bold text-white" style={{ fontSize: 22 }}>{val}</div>
                <div style={{ fontSize: 13, color: '#777', marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section style={{ background: '#1a1a1a', padding: '70px 0' }}>
        <div className="container-app">
          <h2 className="font-bold text-white text-center" style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.75rem)', marginBottom: 44 }}>How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 20 }}>
            {steps.map((s, i) => (
              <div key={i} className="rounded-2xl flex flex-col items-center text-center" style={{ background: '#252525', border: '1px solid #404040', padding: '36px 28px' }}>
                <div className="rounded-2xl flex items-center justify-center text-white" style={{ width: 64, height: 64, marginBottom: 20, background: '#1a1a1a', border: '1px solid #404040' }}>
                  <S d={s.icon} />
                </div>
                <h3 className="text-white" style={{ fontSize: 17, fontWeight: 600, marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontSize: 13.5, lineHeight: 1.7, color: '#999' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ POPULAR CATEGORIES ═══ */}
      <section style={{ background: '#1e1e1e', borderTop: '1px solid #333', borderBottom: '1px solid #333', padding: '70px 0' }}>
        <div className="container-app">
          <h2 className="font-bold text-white text-center" style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.75rem)', marginBottom: 44 }}>Popular Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6" style={{ gap: 16 }}>
            {categories.map((cat) => (
              <div key={cat.name} className="rounded-xl text-center" style={{ background: '#252525', border: '1px solid #404040', padding: '24px 12px' }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{cat.icon}</div>
                <div className="text-white font-medium" style={{ fontSize: 13.5, marginBottom: 4 }}>{cat.name}</div>
                <div style={{ fontSize: 12, color: '#777' }}>{cat.count} projects</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHY FREELANCEHUB ═══ */}
      <section style={{ background: '#1e1e1e', borderTop: '1px solid #333', padding: '70px 0' }}>
        <div className="container-app">
          <h2 className="font-bold text-white text-center" style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.75rem)', marginBottom: 44 }}>Why FreelanceHub?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 20 }}>
            {[
              { icon: '🔒', title: 'Secure Payments', desc: 'Protected payments with Stripe integration. Funds are released only when work is approved by the client.' },
              { icon: '💬', title: 'Built-in Messaging', desc: 'Chat directly with clients or freelancers. Share files, discuss requirements, and keep everything organized.' },
              { icon: '⏱️', title: 'Time Tracking', desc: 'Built-in timer to track hours worked. Transparent billing for hourly projects with detailed reports.' },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl" style={{ background: '#252525', border: '1px solid #404040', padding: '32px 28px' }}>
                <div style={{ fontSize: 32, marginBottom: 16 }}>{f.icon}</div>
                <h3 className="text-white" style={{ fontSize: 16, fontWeight: 600, marginBottom: 10 }}>{f.title}</h3>
                <p style={{ fontSize: 13.5, lineHeight: 1.7, color: '#999' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA — only for guests ═══ */}
      {!user && (
        <section style={{ background: 'linear-gradient(135deg, #5eead4 0%, #2dd4bf 100%)', padding: '64px 0' }}>
          <div className="container-app text-center">
            <h2 className="font-bold" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: '#0f172a', marginBottom: 12 }}>Ready to get started?</h2>
            <p style={{ fontSize: 15, color: '#1e293b', marginBottom: 28, maxWidth: 500, margin: '0 auto 28px' }}>Join thousands of freelancers and businesses already using FreelanceHub.</p>
            <Link to="/register" className="inline-flex items-center justify-center rounded-xl font-semibold text-white transition hover:bg-[#1a1a1a]" style={{ height: 50, padding: '0 32px', fontSize: 15, background: '#0f172a' }}>
              Create Free Account
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}

export default Home
