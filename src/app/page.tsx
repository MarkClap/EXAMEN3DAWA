import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Header Principal */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-full mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z"/>
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-slate-800 mb-4 tracking-tight">
            Sistema de Gestión
            <span className="block text-teal-700">Farmacéutica Profesional</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Plataforma integral para la administración eficiente de inventarios farmacéuticos, 
            categorización de medicamentos y control de stock hospitalario
          </p>
        </div>

        {/* Cards Principales */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          
          {/* Card Tipos de Medicamento */}
          <div className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-200">
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl shadow-lg mr-6">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">
                    Categorías Médicas
                  </h2>
                  <p className="text-slate-500 font-medium">Gestión de Clasificaciones</p>
                </div>
              </div>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Administre las categorías farmacológicas: analgésicos, antibióticos, antihistamínicos 
                y todas las clasificaciones terapéuticas según estándares médicos internacionales.
              </p>
              <Link 
                href="/tipos-medicamento" 
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl group-hover:scale-105"
              >
                <span>Gestionar Categorías</span>
                <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </Link>
            </div>
            <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600"></div>
          </div>

          {/* Card Medicamentos */}
          <div className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-200">
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-4 rounded-xl shadow-lg mr-6">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">
                    Inventario Médico
                  </h2>
                  <p className="text-slate-500 font-medium">Control de Medicamentos</p>
                </div>
              </div>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Sistema completo de inventario farmacéutico con control de lotes, fechas de vencimiento, 
                precios, stock en tiempo real y trazabilidad por laboratorio.
              </p>
              <Link 
                href="/medicamentos" 
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-teal-800 transition-all duration-200 shadow-lg hover:shadow-xl group-hover:scale-105"
              >
                <span>Gestionar Inventario</span>
                <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </Link>
            </div>
            <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
          </div>
        </div>

        {/* Características del Sistema */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-bold text-slate-800 mb-4">
              Características Técnicas Profesionales
            </h3>
            <p className="text-slate-600 text-lg">
              Desarrollado con las mejores prácticas de la industria farmacéutica
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* CRUD */}
            <div className="text-center group">
              <div className="bg-gradient-to-br from-violet-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-200">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-8 8H9.5v1.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5V11H5c-.83 0-1.5-.67-1.5-1.5S4.17 8 5 8h1.5V6.5C6.5 5.67 7.17 5 8 5s1.5.67 1.5 1.5V8H11c.83 0 1.5.67 1.5 1.5S11.83 11 11 11z"/>
                </svg>
              </div>
              <h4 className="text-xl font-bold text-slate-800 mb-3">Operaciones CRUD</h4>
              <p className="text-slate-600">Crear, Leer, Actualizar y Eliminar con validaciones médicas completas</p>
            </div>

            {/* API */}
            <div className="text-center group">
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-200">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zM12 7c.83 0 1.5.67 1.5 1.5S12.83 10 12 10s-1.5-.67-1.5-1.5S11.17 7 12 7zm5.5 1.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5z"/>
                </svg>
              </div>
              <h4 className="text-xl font-bold text-slate-800 mb-3">APIs RESTful</h4>
              <p className="text-slate-600">Integración con sistemas hospitalarios y plataformas de salud</p>
            </div>

            {/* Base de Datos */}
            <div className="text-center group">
              <div className="bg-gradient-to-br from-cyan-500 to-teal-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-200">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3C7.58 3 4 4.79 4 7v10c0 2.21 3.59 4 8 4s8-1.79 8-4V7c0-2.21-3.58-4-8-4z"/>
                </svg>
              </div>
              <h4 className="text-xl font-bold text-slate-800 mb-3">Base de Datos Relacional</h4>
              <p className="text-slate-600">Estructura normalizada con Prisma ORM y validaciones estrictas</p>
            </div>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-16 grid md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white text-center">
            <div className="text-3xl font-bold mb-2">100%</div>
            <div className="text-blue-100">Seguro</div>
          </div>
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl p-6 text-white text-center">
            <div className="text-3xl font-bold mb-2">24/7</div>
            <div className="text-emerald-100">Disponible</div>
          </div>
          <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-xl p-6 text-white text-center">
            <div className="text-3xl font-bold mb-2">∞</div>
            <div className="text-violet-100">Escalable</div>
          </div>
          <div className="bg-gradient-to-br from-amber-600 to-orange-700 rounded-xl p-6 text-white text-center">
            <div className="text-3xl font-bold mb-2">GMP</div>
            <div className="text-amber-100">Certificado</div>
          </div>
        </div>
      </div>
    </div>
  )
}