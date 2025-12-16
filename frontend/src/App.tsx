import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import Laboratorios from './pages/Laboratorios'
import Reservas from './pages/Reservas'
import NovaReserva from './pages/NovaReserva'

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen">
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/laboratorios" element={<Laboratorios />} />
          <Route path="/reservas" element={<Reservas />} />
          <Route path="/nova-reserva" element={<NovaReserva />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
