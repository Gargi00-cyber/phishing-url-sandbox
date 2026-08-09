import { useParams, useLocation } from 'react-router-dom'
import RiskScoreCard from '../components/RiskScoreCard'
import ScreenshotViewer from '../components/ScreenshotViewer'
import RiskCharts from '../components/RiskCharts'
import RedirectFlowchart from '../components/RedirectFlowchart'
import Layout from '../components/Layout'

function Results() {
  const { scanId } = useParams()
  const location = useLocation()
  const url = location.state?.url || 'unknown URL'

  const dummyScore = 72
  const dummyFinalUrl = 'http://fake-login-page-example.test/account/verify'

  const dummyRiskBreakdown = [
    { name: 'Domain Age', value: 35 },
    { name: 'Redirect Count', value: 25 },
    { name: 'Suspicious Keywords', value: 20 },
    { name: 'SSL/Cert Issues', value: 20 },
  ]

  const dummyComparisonData = [
    { name: 'Domain Age (days)', thisScan: 12, typical: 900 },
    { name: 'Redirects', thisScan: 6, typical: 1 },
    { name: 'Ext. Scripts', thisScan: 14, typical: 4 },
  ]

  const dummyHops = [
    { url: url, riskNote: 'Original submitted link' },
    { url: 'http://bit.ly/3xY9zLp', riskNote: 'URL shortener - hides real destination' },
    { url: 'http://secure-verify-acc0unt.tk', riskNote: 'Domain registered 3 days ago' },
    { url: dummyFinalUrl, riskNote: 'Final phishing landing page' },
  ]

  return (
    <Layout>
      <div className="flex flex-col items-center gap-8 px-4 py-8 w-full">
        <h1 className="text-3xl font-bold text-white">Scan Results</h1>
        <RiskScoreCard score={dummyScore} url={url} />
        <ScreenshotViewer imageUrl={null} finalUrl={dummyFinalUrl} />
        <RiskCharts riskBreakdown={dummyRiskBreakdown} comparisonData={dummyComparisonData} />
        <RedirectFlowchart hops={dummyHops} />
      </div>
    </Layout>
  )
}

export default Results