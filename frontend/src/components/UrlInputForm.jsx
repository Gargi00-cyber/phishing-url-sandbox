import { useState } from 'react'
import { motion } from 'framer-motion'

function UrlInputForm({ onSubmit }) {
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!url.trim()) {
      setError('Please enter a URL to scan')
      return
    }
    setError('')
    onSubmit(url.trim())
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-xl"
    >
      <div className="flex flex-col sm:flex-row gap-3">
        <motion.input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste a suspicious URL, e.g. http://example.com"
          whileFocus={{ scale: 1.02 }}
          className="flex-1 px-5 py-3 rounded-xl bg-slate-800/60 border border-purple-500/30
                     text-white placeholder-slate-400 outline-none
                     focus:border-pink-400 focus:ring-2 focus:ring-pink-400/40
                     transition-colors"
        />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 rounded-xl font-semibold text-white
                     bg-gradient-to-r from-pink-500 to-purple-600
                     shadow-lg shadow-purple-500/30
                     hover:shadow-purple-500/50 transition-shadow"
        >
          Detonate 🧪
        </motion.button>
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 text-sm text-red-400"
        >
          {error}
        </motion.p>
      )}
    </motion.form>
  )
}

export default UrlInputForm