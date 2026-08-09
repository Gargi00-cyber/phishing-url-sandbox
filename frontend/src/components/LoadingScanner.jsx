import { motion } from 'framer-motion'

function LoadingScanner({ url }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex flex-col items-center gap-6 py-10"
    >
      <div className="relative w-24 h-24">
        {/* Outer pulsing ring */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-full bg-pink-500/40"
        />
        {/* Spinning ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border-4 border-transparent
                     border-t-pink-400 border-r-purple-400"
        />
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center text-3xl">
          🧪
        </div>
      </div>

      <div className="text-center">
        <p className="text-white font-medium">Detonating in sandbox…</p>
        <p className="text-slate-400 text-sm mt-1 max-w-xs truncate">{url}</p>
      </div>

      {/* Animated progress dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
              ease: 'easeInOut',
            }}
            className="w-2 h-2 rounded-full bg-purple-400"
          />
        ))}
      </div>
    </motion.div>
  )
}

export default LoadingScanner