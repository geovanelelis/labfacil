import { FlaskConical, Menu, X } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const Header: React.FC = () => {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/laboratorios', label: 'Laboratórios' },
    { path: '/reservas', label: 'Reservas' },
  ]

  const handleNavClick = () => {
    setMobileMenuOpen(false)
  }

  return (
    <>
      <header className="bg-linear-to-r from-slate-700/40 via-slate-800/30 to-slate-900/40 backdrop-blur-md sticky top-0 z-40 border-b border-slate-600/20">
        <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <FlaskConical className="w-10 h-10 text-slate-300 group-hover:text-sky-500 transition-colors shadow-lg" />
              <div>
                <h1 className="text-xl font-bold text-white group-hover:text-sky-400 transition-colors duration-300">
                  LabFácil
                </h1>
                <p className="text-xs text-slate-300 group-hover:text-sky-100 font-medium transition-colors">
                  Gerenciador de Laboratórios
                </p>
              </div>
            </Link>

            {/* Navegação */}
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? 'text-slate-100 border-b-2 border-slate-300 pb-2'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            {/* Menu Mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-slate-300 p-2 hover:text-white transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Menu Mobile - Dropdown (fora do container para backdrop-blur funcionar) */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-20 left-0 right-0 border-t border-slate-600/30 bg-linear-to-r from-slate-700/40 via-slate-800/30 to-slate-900/40 backdrop-blur-md z-50">
          <nav className="flex flex-col">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={handleNavClick}
                  className={`px-6 py-5 text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'text-slate-100 bg-slate-700/40 border-l-4 border-slate-200'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/20'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </>
  )
}

export default Header
