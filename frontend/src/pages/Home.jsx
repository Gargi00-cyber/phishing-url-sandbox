import { useNavigate } from 'react-router-dom'
import UrlInputForm from '../components/UrlInputForm'
import Layout from '../components/Layout'

function Home() {
  const navigate = useNavigate()

  const handleScanSubmit = (url) => {
    const tempId = Date.now().toString()
    navigate(`/results/${tempId}`, { state: { url } })
  }

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center gap-8 px-4 py-16 flex-1">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 text-center leading-normal pb-2">
          Phishing URL Sandbox
        </h1>
        <p className="text-slate-300 text-center max-w-md">
          Paste a suspicious link below — we'll detonate it safely and show you the risk.
        </p>
        <UrlInputForm onSubmit={handleScanSubmit} />
      </div>
    </Layout>
  )
}

export default Home