import { Link } from 'react-router-dom'

function Home() {
  return (
    <div>
      {/* Hero section */}
      <div className="bg-blue-600 text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl font-bold mb-4">
            Find Freelance Work or Hire Talent
          </h1>
          <p className="text-lg mb-8">
            Connect with skilled professionals for your projects
          </p>
          <Link 
            to="/register" 
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-2xl font-bold text-center mb-10">Why Choose Us</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-2">Easy to Use</h3>
            <p className="text-gray-600">
              Simple interface to find work or hire freelancers quickly
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-2">Secure Payments</h3>
            <p className="text-gray-600">
              Your payments are protected with our escrow system
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-2">Quality Talent</h3>
            <p className="text-gray-600">
              Access verified professionals from around the world
            </p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-gray-100 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">Popular Categories</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Web Development', 'Mobile Apps', 'Design', 'Writing', 'Marketing', 'Video', 'Music', 'Data Entry'].map((category) => (
              <div key={category} className="bg-white p-4 rounded text-center hover:shadow-md cursor-pointer">
                {category}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
