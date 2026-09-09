import { Routes, Route } from 'react-router-dom'
import Home from './Home'
import Portfolio from './Portfolio'
import Websites from './Websites'
import Design from './Design'
import Studies from './Studies'
import Resume from './Resume'
import Contact from './Contact'
import About from './About'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/websites" element={<Websites />} />
      <Route path="/design" element={<Design />} />
      <Route path="/studies" element={<Studies />} />
      <Route path="/resume" element={<Resume />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  )
}

export default App