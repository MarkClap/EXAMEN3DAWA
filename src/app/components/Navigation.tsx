'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()

  const isActive = (path: string): string => {
    return pathname === path 
      ? 'bg-teal-700 text-white shadow-lg border-b-2 border-teal-300' 
      : 'text-teal-100 hover:bg-teal-600 hover:text-white transition-all duration-200'
  }

  return (
    <nav className="bg-gradient-to-r from-teal-800 via-teal-700 to-cyan-800 shadow-xl border-b-2 border-teal-200">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center py-4">
          {/* Logo y Título */}
          <div className="flex items-center space-x-4">
            <div className="bg-white p-3 rounded-full shadow-lg">
              <svg className="w-8 h-8 text-teal-700" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div>
              <Link href="/" className="text-2xl font-bold text-white tracking-wide">
                FarmaSystem
              </Link>
              <p className="text-teal-200 text-sm font-medium">Sistema Médico Profesional</p>
            </div>
          </div>
          
          {/* Menú de Navegación */}
          <div className="flex space-x-2">
            <Link 
              href="/" 
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 ${isActive('/')}`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
              </svg>
              <span>Dashboard</span>
            </Link>
            <Link 
              href="/tipos-medicamento" 
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 ${isActive('/tipos-medicamento')}`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
              </svg>
              <span>Categorías</span>
            </Link>
            <Link 
              href="/medicamentos" 
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 ${isActive('/medicamentos')}`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
              </svg>
              <span>Medicamentos</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}