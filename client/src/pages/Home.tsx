import { Link } from 'react-router-dom'

function Home() {
  const categories = [
    { name: 'Web Development', icon: '💻', count: '2,340+' },
    { name: 'Mobile Apps', icon: '📱', count: '1,890+' },
    { name: 'UI/UX Design', icon: '🎨', count: '1,560+' },
    { name: 'Writing', icon: '✍️', count: '980+' },
    { name: 'Marketing', icon: '📈', count: '720+' },
    { name: 'Data Entry', icon: '📊', count: '450+' },
  ]

  const steps = [
    { step: '01', title: 'Create Account', desc: 'Sign up as a freelancer or client in under a minute.' },
    { step: '02', title: 'Find a Match', desc: 'Browse projects or search for skilled freelancers.' },
    { step: '03', title: 'Collaborate', desc: 'Work together with messaging, time tracking, and milestones.' },
    { step: '04', title: 'Get Paid', desc: 'Secure payments through our integrated payment system.' },
  ]

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-28">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Find freelance work or hire talent for any project
            </h1>
            <p className="text-blue-100 text-lg mb-8 leading-relaxed">
              FreelanceHub connects businesses with skilled professionals. 
              Post a project, get proposals, and start working together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register" className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition text-center">
                Get Started Free
              </Link>
              <Link to="/search" className="border-2 border-white/30 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition text-center">
                Browse Projects
              </Link>
            </div>
            <div className="flex gap-8 mt-10 text-sm">
              <div>
                <p className="text-2xl font-bold">10K+</p>
                <p className="text-blue-200">Freelancers</p>
              </div>
              <div>
                <p className="text-2xl font-bold">5K+</p>
                <p className="text-blue-200">Projects</p>
              </div>
              <div>
                <p className="text-2xl font-bold">$2M+</p>
                <p className="text-blue-200">Paid Out</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How It Works</h2>
            <p className="text-gray-500 max-w-lg mx-auto">Get started in just a few steps</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 bg-blue-100 text-blue-600 font-bold text-lg rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Popular Categories</h2>
            <p className="text-gray-500 max-w-lg mx-auto">Browse projects in the most active categories</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/search?category=${encodeURIComponent(cat.name)}`}
                className="group border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition text-center"
              >
                <div className="text-3xl mb-3">{cat.icon}</div>
                <h3 className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition">{cat.name}</h3>
                <p className="text-xs text-gray-400 mt-1">{cat.count} projects</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Why FreelanceHub?</h2>
            <p className="text-gray-500 max-w-lg mx-auto">Everything you need to succeed</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl mb-4">🔒</div>
              <h3 className="font-semibold text-gray-900 mb-2">Secure Payments</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Protected payments with Stripe. Funds are released only when work is approved.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl mb-4">💬</div>
              <h3 className="font-semibold text-gray-900 mb-2">Built-in Messaging</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Chat directly with clients or freelancers. Share files and keep everything organized.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-2xl mb-4">⏱️</div>
              <h3 className="font-semibold text-gray-900 mb-2">Time Tracking</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Built-in timer to track hours worked. Transparent billing for hourly projects.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-blue-100 mb-8">Join thousands of freelancers and businesses on FreelanceHub</p>
          <Link to="/register" className="inline-block bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
