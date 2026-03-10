import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Search from './pages/Search'
import CreateProject from './pages/CreateProject'
import ProjectDetail from './pages/ProjectDetail'
import MyProposals from './pages/MyProposals'
import MyProjects from './pages/MyProjects'
import MyTime from './pages/MyTime'
import Messages from './pages/Messages'
import Admin from './pages/Admin'
import Notifications from './pages/Notifications'
import SearchFreelancers from './pages/SearchFreelancers'
import FreelancerProfile from './pages/FreelancerProfile'
import SavedJobs from './pages/SavedJobs'

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#1a1a1a] text-white">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:id" element={<FreelancerProfile />} />
          <Route path="/search" element={<Search />} />
          <Route path="/find-freelancers" element={<SearchFreelancers />} />
          <Route path="/create-project" element={<CreateProject />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/my-proposals" element={<MyProposals />} />
          <Route path="/saved-jobs" element={<SavedJobs />} />
          <Route path="/my-projects" element={<MyProjects />} />
          <Route path="/my-time" element={<MyTime />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
