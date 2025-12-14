import { Routes, Route } from 'react-router-dom'
import Home from './Home'
import Portfolio from './Portfolio'
import Resume from './Resume'
import Contact from './Contact'
import About from './About'
import Webcraft from './pages/Webcraft'
import Personal from './pages/Personal'
import UX from './pages/UX'
import AI from './pages/AI'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/webcraft" element={<Webcraft />} />
        <Route path="/personal" element={<Personal />} />
        <Route path="/ux" element={<UX />} />
        <Route path="/ai" element={<AI />} />
      <Route path="/resume" element={<Resume />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  )
}

export default App