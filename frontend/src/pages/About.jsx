import { useState } from 'react'
import { motion } from 'framer-motion'
import Layout from '../components/Layout'

const STACK = [
  {
    name: 'React + Vite',
    emoji: '⚡',
    url: 'https://vitejs.dev',
    role: 'Powers the entire interactive frontend you are looking at right now — every animation, chart, and page transition.',
  },
  {
    name: 'FastAPI',
    emoji: '🐍',
    url: 'https://fastapi.tiangolo.com',
    role: 'The backend brain — receives submitted URLs, validates them, and coordinates the whole detonation process.',
  },
  {
    name: 'Playwright',
    emoji: '🎭',
    url: 'https://playwright.dev',
    role: 'Runs the actual headless browser that opens the suspicious link, follows redirects, and takes the screenshot.',
  },
  {
    name: 'Redis + Queue',
    emoji: '📬',
    url: 'https://redis.io',
    role: 'Queues up scan jobs so multiple users can submit URLs at once without overwhelming the sandbox.',
  },
  {
    name: 'Supabase',
    emoji: '🗄️',
    url: 'https://supabase.com',
    role: 'Stores scan results, risk scores, and screenshots so every report has a permanent, shareable link.',
  },
]

const FUN_FACTS = [
  'Every scan runs in a throwaway sandbox — nothing malicious ever touches a real machine.',
  'The redirect chain gets mapped hop by hop, so sneaky multi-bounce phishing links get exposed.',
  'Domain age is one of the strongest signals — most phishing domains are younger than your last haircut.',
]

function About() {
  const [hovered, setHovered] = useState(null)

  return (
    <Layout>
      <div className="flex flex-col items-center gap-12 px-4 py-12 max-w-3xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-4 leading-normal pb-2">
            Hi, I'm Gargi Saini
          </h1>
          <p className="text-slate-300 max-w-xl mx-auto">
            PhishSandbox is a disposable, isolated environment that opens shady URLs so
            you don't have to. It follows every redirect, screenshots the final page,
            scores the risk, and hands you a report — all without a single byte
            touching your real machine.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="w-full bg-slate-800/50 border border-purple-500/20 rounded-2xl p-6"
        >
          <h2 className="text-white font-semibold mb-4 text-center">Built with</h2>
          <div className="grid sm:grid-cols-2 gap-3 mb-4">
            {STACK.map((item, i) => (
              <motion.a
                key={item.name}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                whileHover={{ scale: 1.04 }}
                className={`flex items-center gap-3 bg-slate-900/60 rounded-xl px-4 py-3 border cursor-pointer transition-colors ${
                  hovered === i ? 'border-pink-400/60' : 'border-slate-700'
                }`}
              >
                <span className="text-2xl">{item.emoji}</span>
                <div>
                  <p className="text-white text-sm font-medium">{item.name}</p>
                  <p className="text-slate-400 text-xs">Click to visit official site</p>
                </div>
              </motion.a>
            ))}
          </div>

          <motion.div
            key={hovered ?? 'default'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-slate-900/60 border border-pink-400/30 rounded-xl p-4 min-h-[60px] flex items-center"
          >
            <p className="text-slate-200 text-sm">
              {hovered !== null
                ? STACK[hovered].role
                : 'Hover over a tool above to see what it does in this project.'}
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full"
        >
          <h2 className="text-white font-semibold mb-4 text-center">Good to know</h2>
          <div className="flex flex-col gap-3">
            {FUN_FACTS.map((fact, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-xl px-5 py-4"
              >
                <p className="text-slate-200 text-sm">{fact}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </Layout>
  )
}

export default About