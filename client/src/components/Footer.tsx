import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">F</span>
              </div>
              <span className="text-lg font-bold text-white">
                Freelance<span className="text-blue-400">Hub</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              Connecting freelancers with clients worldwide. Find work or hire talent easily.
            </p>
          </div>

          {/* For Freelancers */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">For Freelancers</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/search" className="hover:text-white transition">Find Work</Link></li>
              <li><Link to="/register" className="hover:text-white transition">Create Account</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition">Dashboard</Link></li>
            </ul>
          </div>

          {/* For Clients */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">For Clients</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/find-freelancers" className="hover:text-white transition">Find Talent</Link></li>
              <li><Link to="/create-project" className="hover:text-white transition">Post a Project</Link></li>
              <li><Link to="/register" className="hover:text-white transition">Sign Up</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">About Us</a></li>
              <li><a href="#" className="hover:text-white transition">Contact</a></li>
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} FreelanceHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
