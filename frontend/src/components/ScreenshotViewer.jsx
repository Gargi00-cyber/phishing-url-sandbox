import { motion } from 'framer-motion'

function ScreenshotViewer({ imageUrl, finalUrl }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="bg-slate-800/50 border border-purple-500/20 rounded-2xl p-6 w-full max-w-2xl"
    >
      <h2 className="text-white font-semibold mb-1">Final Page Screenshot</h2>
      <p className="text-slate-400 text-sm mb-4 break-all">{finalUrl}</p>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        whileHover={{ scale: 1.01 }}
        className="rounded-xl overflow-hidden border border-slate-700 shadow-lg shadow-black/30"
      >
        {imageUrl ? (
          <img src={imageUrl} alt="Final page screenshot" className="w-full block" />
        ) : (
          <div className="w-full aspect-video bg-slate-900 flex items-center justify-center text-slate-500 text-sm">
            No screenshot available
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default ScreenshotViewer