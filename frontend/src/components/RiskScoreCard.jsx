import { motion } from 'framer-motion'

function getRiskLevel(score) {
  if (score >= 70) return { label: 'High Risk', color: 'from-red-500 to-orange-500', ring: '#ef4444' }
  if (score >= 40) return { label: 'Medium Risk', color: 'from-yellow-500 to-orange-400', ring: '#eab308' }
  return { label: 'Low Risk', color: 'from-green-400 to-emerald-500', ring: '#22c55e' }
}

function RiskScoreCard({ score, url }) {
  const risk = getRiskLevel(score)
  const circumference = 2 * Math.PI * 54
  const offset = circumference - (score / 100) * circumference

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-slate-800/50 border border-purple-500/20 rounded-2xl p-8
                 flex flex-col sm:flex-row items-center gap-8 w-full max-w-2xl"
    >
      <div className="relative w-32 h-32 shrink-0">
        <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" stroke="#334155" strokeWidth="10" fill="none" />
          <motion.circle
            cx="60" cy="60" r="54"
            stroke={risk.ring}
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-white">{score}</span>
          <span className="text-xs text-slate-400">/ 100</span>
        </div>
      </div>

      <div className="text-center sm:text-left">
        <span
          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold text-white
                      bg-gradient-to-r ${risk.color} mb-2`}
        >
          {risk.label}
        </span>
        <p className="text-slate-300 text-sm break-all">{url}</p>
      </div>
    </motion.div>
  )
}

export default RiskScoreCard