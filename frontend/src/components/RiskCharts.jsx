import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts'

const PIE_COLORS = ['#f472b6', '#a78bfa', '#60a5fa', '#fbbf24']

// Explanations shown on hover — keyed by the "name" field in your data
const FACTOR_EXPLANATIONS = {
  'Domain Age': 'Very new domains are a strong phishing signal — attackers register throwaway domains hours before a campaign.',
  'Redirect Count': 'Multiple redirects are used to hide the final destination from URL scanners and users.',
  'Suspicious Keywords': 'Words like "verify", "login", or "urgent" mimicking real brands are common in phishing pages.',
  'SSL/Cert Issues': 'Missing, self-signed, or freshly-issued certificates suggest a hastily set-up malicious site.',
}

const COMPARISON_EXPLANATIONS = {
  'Domain Age (days)': 'How old the domain is, in days. Phishing domains are usually days old, not years.',
  'Redirects': 'Number of redirect hops before reaching the final page. More hops = more evasion attempts.',
  'Ext. Scripts': 'Number of external/third-party scripts loaded. Phishing kits often pull scripts from many sources.',
}

function CustomPieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="bg-slate-900 border border-purple-500/40 rounded-lg p-3 max-w-[220px] shadow-xl">
      <p className="text-white font-semibold text-sm">{d.name} — {d.value}%</p>
      <p className="text-slate-400 text-xs mt-1">{FACTOR_EXPLANATIONS[d.name]}</p>
    </div>
  )
}

function CustomBarTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-slate-900 border border-purple-500/40 rounded-lg p-3 max-w-[220px] shadow-xl">
      <p className="text-white font-semibold text-sm">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="text-xs mt-1" style={{ color: p.fill }}>
          {p.name}: {p.value}
        </p>
      ))}
      <p className="text-slate-400 text-xs mt-1">{COMPARISON_EXPLANATIONS[label]}</p>
    </div>
  )
}

function renderPercentLabel({ percent }) {
  return `${(percent * 100).toFixed(0)}%`
}

function RiskCharts({ riskBreakdown, comparisonData }) {
  const [activeIndex, setActiveIndex] = useState(null)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-slate-800/50 border border-purple-500/20 rounded-2xl p-6 w-full max-w-2xl"
    >
      <h2 className="text-white font-semibold mb-4">Risk Breakdown</h2>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <p className="text-slate-400 text-sm mb-2 text-center">
            Contribution by factor
          </p>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={riskBreakdown}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={75}
                paddingAngle={3}
                label={renderPercentLabel}
                labelLine={false}
                fontSize={11}
                animationDuration={900}
                onMouseEnter={(_, i) => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {riskBreakdown.map((_, i) => (
                  <Cell
                    key={i}
                    fill={PIE_COLORS[i % PIE_COLORS.length]}
                    stroke="#1e1b2e"
                    strokeWidth={2}
                    style={{
                      filter: activeIndex === i ? 'brightness(1.15)' : 'none',
                      transform: activeIndex === i ? 'scale(1.06)' : 'scale(1)',
                      transformOrigin: 'center',
                      transition: 'transform 200ms ease, filter 200ms ease',
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, color: '#cbd5e1' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div>
          <p className="text-slate-400 text-sm mb-2 text-center">
            This scan vs. typical safe site
          </p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip content={<CustomBarTooltip />} cursor={{ fill: '#ffffff0d' }} />
              <Bar
                dataKey="thisScan"
                name="This URL"
                fill="#f472b6"
                radius={[4, 4, 0, 0]}
                animationDuration={900}
              />
              <Bar
                dataKey="typical"
                name="Typical safe site"
                fill="#60a5fa"
                radius={[4, 4, 0, 0]}
                animationDuration={900}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  )
}

export default RiskCharts