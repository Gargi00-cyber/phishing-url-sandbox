import Navbar from './Navbar'
import Footer from './Footer'
import ParticleBackground from './ParticleBackground'

function Layout({ children }) {
  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-purple-900 via-slate-900 to-indigo-900 overflow-hidden">
      <ParticleBackground />
      <Navbar />
      <main className="relative z-10 flex-1 flex flex-col items-center pt-20">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout