import { Routes, Route } from 'react-router-dom'
import MainWindow from './pages/MainWindow.jsx'
import PartnerEditWindow from './pages/PartnerEditWindow.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainWindow />} />
      <Route path="/partners/new" element={<PartnerEditWindow />} />
      <Route path="*" element={<MainWindow />} />
    </Routes>
  )
}

export default App
