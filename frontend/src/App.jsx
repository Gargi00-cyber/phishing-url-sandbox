import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Results from './pages/Results'
import About from './pages/About'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/results/:scanId" element={<Results />} />
      <Route path="/about" element={<About />} />
    </Routes>
  )
}

export default App