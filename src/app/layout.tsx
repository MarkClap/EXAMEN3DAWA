import './globals.css'
import Navigation from './components/Navigation'
import { Metadata } from 'next'
import React from 'react'


export const metadata: Metadata = {
  title: 'Sistema de Farmacia',
  description: 'Sistema de gestión de farmacia con medicamentos y tipos',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es">
      <body>
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}