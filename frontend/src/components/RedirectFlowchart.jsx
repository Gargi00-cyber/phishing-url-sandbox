import { useMemo } from 'react'
import { motion } from 'framer-motion'
import ReactFlow, {
  Background,
  Controls,
  MarkerType,
} from 'reactflow'
import 'reactflow/dist/style.css'

// hops: array of { url, riskNote } in order, e.g.
// [{ url: 'http://bit.ly/xyz', riskNote: 'URL shortener — hides destination' },
//  { url: 'http://sketchy-mid.com', riskNote: 'Newly registered domain' },
//  { url: 'http://final-fake-login.com', riskNote: 'Final phishing page' }]
function buildFlow(hops) {
  const nodes = hops.map((hop, i) => ({
    id: String(i),
    position: { x: i * 260, y: 0 },
    data: { label: (
      <div className="text-left">
        <p className="text-xs font-semibold text-white truncate max-w-[200px]">
          {i === 0 ? 'Start' : i === hops.length - 1 ? 'Final Page' : `Hop ${i}`}
        </p>
        <p className="text-[11px] text-slate-300 truncate max-w-[200px]">{hop.url}</p>
        <p className="text-[10px] text-pink-300 mt-1 max-w-[200px]">{hop.riskNote}</p>
      </div>
    )},
    style: {
      background: i === hops.length - 1 ? '#7f1d3b' : '#1e1b2e',
      border: i === hops.length - 1 ? '1px solid #f472b6' : '1px solid #7c3aed60',
      borderRadius: 10,
      padding: 10,
      width: 220,
    },
  }))

  const edges = hops.slice(0, -1).map((_, i) => ({
    id: `e${i}-${i + 1}`,
    source: String(i),
    target: String(i + 1),
    animated: true,
    style: { stroke: '#f472b6', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#f472b6' },
  }))

  return { nodes, edges }
}

function RedirectFlowchart({ hops }) {
  const { nodes, edges } = useMemo(() => buildFlow(hops), [hops])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.45 }}
      className="bg-slate-800/50 border border-purple-500/20 rounded-2xl p-6 w-full max-w-2xl"
    >
      <h2 className="text-white font-semibold mb-1">Redirect Chain</h2>
      <p className="text-slate-400 text-sm mb-4">
        {hops.length} hop{hops.length !== 1 ? 's' : ''} before reaching the final page
      </p>

      <div style={{ height: 220 }} className="rounded-xl overflow-hidden border border-slate-700">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#334155" gap={16} />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
    </motion.div>
  )
}

export default RedirectFlowchart