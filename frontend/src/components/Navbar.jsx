import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const NAV_LINKS = [
  { label: 'Scan', to: '/' },
  { label: 'About', to: '/about' },
]

function Navbar() {
  const location = useLocation()

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-slate-900/60 border-b border-purple-500/20"
    >
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-bold text-white text-lg tracking-tight">
            Phish<span className="text-pink-400">Sandbox</span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const active = location.pathname === link.to
            return (
              <Link key={link.to} to={link.to} className="relative px-4 py-2">
                <span
                  className={`relative z-10 text-sm font-medium transition-colors ${
                    active ? 'text-white' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {link.label}
                </span>
                {active && (
                  <motion.div
                    layoutId="navbar-active-pill"
                    className="absolute inset-0 bg-gradient-to-r from-pink-500/30 to-purple-500/30 rounded-full"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
          
            <a href="https://github.com/Gargi00-cyber/phishing-url-sandbox"
            target="_blank"
            rel="noreferrer"
            className="ml-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-purple-600 rounded-full hover:shadow-lg hover:shadow-purple-500/30 transition-shadow"
          >
            GitHub
          </a>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar