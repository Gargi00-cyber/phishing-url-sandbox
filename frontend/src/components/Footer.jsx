import { motion } from 'framer-motion'

function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="relative z-10 border-t border-purple-500/20 bg-slate-900/60 backdrop-blur-md mt-auto"
    >
      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <p className="text-white font-semibold text-sm">
            Phish<span className="text-pink-400">Sandbox</span>
          </p>
          <p className="text-slate-400 text-xs mt-1">
            Detonate suspicious URLs safely. Built for learning, not liability.
          </p>
        </div>

        <div className="flex gap-6 text-sm">
          
            <a href="https://github.com/Gargi00-cyber/phishing-url-sandbox"
            target="_blank"
            rel="noreferrer"
            className="text-slate-300 hover:text-pink-400 transition-colors"
          >
            GitHub
          </a>
          
            <a href="https://github.com/Gargi00-cyber/phishing-url-sandbox#readme"
  target="_blank"
  rel="noreferrer"
  className="text-slate-300 hover:text-pink-400 transition-colors"
>
  Docs
</a>
        </div>
      </div>

      <p className="text-center text-slate-500 text-xs pb-4">
       {new Date().getFullYear()} PhishSandbox. All rights reserved.
      </p>
    </motion.footer>
  )
}

export default Footer