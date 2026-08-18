import { useState, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import RiskScoreCard from '../components/RiskScoreCard'
import ScreenshotViewer from '../components/ScreenshotViewer'
import RiskCharts from '../components/RiskCharts'
import RedirectFlowchart from '../components/RedirectFlowchart'
import LoadingScanner from '../components/LoadingScanner'
import Layout from '../components/Layout'
import { submitScan } from '../api/scanApi'

function Results() {
  useParams()
  const location = useLocation()
  const url = location.state?.url || ''

  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!url) {
      setError('No URL was provided to scan.')
      setLoading(false)
      return
    }

    let cancelled = false

    async function runScan() {
      try {
        const data = await submitScan(url)
        if (!cancelled) setResult(data)
      } catch (err) {
        if (!cancelled) {
          const detail = err.response?.data?.detail || 'The scan failed. Please try again.'
          setError(detail)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    runScan()
    return () => { cancelled = true }
  }, [url])

  return (
    <Layout>
      <div className="flex flex-col items-center gap-8 px-4 py-8 w-full">
        <h1 className="text-3xl font-bold text-white">Scan Results</h1>

        {loading && <LoadingScanner url={url} />}

        {!loading && error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 max-w-xl text-center">
            <p className="text-red-300 font-medium">{error}</p>
          </div>
        )}

        {!loading && result && (
          <>
            <RiskScoreCard score={result.risk_score} url={result.submitted_url} />
            <ScreenshotViewer
              imageUrl={`data:image/png;base64,${result.screenshot_base64}`}
              finalUrl={result.final_url}
            />
            <RiskCharts breakdown={result.risk_breakdown} />
            <RedirectFlowchart hops={result.hops} />
          </>
        )}
      </div>
    </Layout>
  )
}

export default Results