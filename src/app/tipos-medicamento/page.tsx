'use client'

import { useState, useEffect } from 'react'
import { TipoMedicamento, TipoMedicamentoFormData, LoadingState } from '../types/index'

export default function TiposMedicamentoPage() {
  const [tipos, setTipos] = useState<TipoMedicamento[]>([])
  const [{ loading, error }, setLoadingState] = useState<LoadingState>({ loading: true, error: '' })
  const [showForm, setShowForm] = useState<boolean>(false)
  const [editingTipo, setEditingTipo] = useState<TipoMedicamento | null>(null)
  const [formData, setFormData] = useState<TipoMedicamentoFormData>({
    nombre: '',
    descripcion: ''
  })

  // Cargar tipos de medicamento
  const fetchTipos = async (): Promise<void> => {
    try {
      setLoadingState({ loading: true, error: '' })
      const response = await fetch('/api/tipos-medicamento')
      if (!response.ok) throw new Error('Error al cargar tipos')
      const data: TipoMedicamento[] = await response.json()
      setTipos(data)
    } catch (err) {
      setLoadingState({ loading: false, error: 'Error al cargar los tipos de medicamento' })
      console.error(err)
    } finally {
      setLoadingState(prev => ({ ...prev, loading: false }))
    }
  }

  useEffect(() => {
    fetchTipos()
  }, [])

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setLoadingState(prev => ({ ...prev, error: '' }))

    try {
      const method = editingTipo ? 'PUT' : 'POST'
      const bodyData = editingTipo 
        ? { ...formData, id: editingTipo.id }
        : formData

      const response = await fetch('/api/tipos-medicamento', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al guardar')
      }

      await fetchTipos()
      setShowForm(false)
      setEditingTipo(null)
      setFormData({ nombre: '', descripcion: '' })
    } catch (err) {
      setLoadingState(prev => ({ ...prev, error: (err as Error).message }))
    }
  }

  // Eliminar tipo
  const handleDelete = async (id: number): Promise<void> => {
    if (!confirm('¿Estás seguro de eliminar este tipo de medicamento?')) return

    try {
      const response = await fetch(`/api/tipos-medicamento?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al eliminar')
      }

      await fetchTipos()
    } catch (err) {
      setLoadingState(prev => ({ ...prev, error: (err as Error).message }))
    }
  }

  // Editar tipo
  const handleEdit = (tipo: TipoMedicamento): void => {
    setEditingTipo(tipo)
    setFormData({
      nombre: tipo.nombre,
      descripcion: tipo.descripcion || ''
    })
    setShowForm(true)
  }

  // Cancelar formulario
  const handleCancel = (): void => {
    setShowForm(false)
    setEditingTipo(null)
    setFormData({ nombre: '', descripcion: '' })
    setLoadingState(prev => ({ ...prev, error: '' }))
  }

  // Manejar cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 p-3 rounded-xl shadow-lg">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-8 8H9.5v1.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5V11H5c-.83 0-1.5-.67-1.5-1.5S4.17 8 5 8h1.5V6.5C6.5 5.67 7.17 5 8 5s1.5.67 1.5 1.5V8H11c.83 0 1.5.67 1.5 1.5S11.83 11 11 11z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                Categorías Farmacológicas
              </h1>
              <p className="text-slate-600 font-medium">Gestión de clasificaciones terapéuticas</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
            </svg>
            Nueva Categoría
          </button>
        </div>

        {/* Alert de Error */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8 rounded-lg shadow-sm">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
              </svg>
              <p className="text-red-800 font-semibold">{error}</p>
            </div>
          </div>
        )}

        {/* Formulario */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-slate-200">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl mr-4">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 002 0V3a2 2 0 012 0v1a1 1 0 002 0V3a2 2 0 012 2v6h-3V8a1 1 0 10-2 0v3H4V5z" clipRule="evenodd"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">
                {editingTipo ? 'Modificar Categoría' : 'Nueva Categoría Farmacológica'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Nombre de la Categoría *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-slate-50 focus:bg-white"
                    placeholder="Ej: Analgésicos, Antibióticos..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Descripción Clínica
                  </label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-slate-50 focus:bg-white"
                    rows={3}
                    placeholder="Descripción terapéutica y uso clínico..."
                  />
                </div>
              </div>
              
              <div className="flex space-x-4 mt-8">
                <button 
                  type="submit" 
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  {editingTipo ? 'Actualizar Categoría' : 'Crear Categoría'}
                </button>
                <button 
                  type="button" 
                  onClick={handleCancel} 
                  className="inline-flex items-center px-6 py-3 bg-slate-500 hover:bg-slate-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tabla */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                <span className="text-slate-600 font-medium">Cargando categorías...</span>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-slate-100 to-slate-200 border-b border-slate-300">
                  <tr>
                    <th className="px-8 py-5 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">ID</th>
                    <th className="px-8 py-5 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Categoría</th>
                    <th className="px-8 py-5 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Descripción</th>
                    <th className="px-8 py-5 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Medicamentos</th>
                    <th className="px-8 py-5 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {tipos.map((tipo, index) => (
                    <tr key={tipo.id} className={`hover:bg-slate-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-25'}`}>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                          #{tipo.id}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="font-semibold text-slate-900 text-lg">{tipo.nombre}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-slate-600 max-w-md">
                          {tipo.descripcion || (
                            <span className="italic text-slate-400">Sin descripción</span>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-800">
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 002 0V3a2 2 0 012 0v1a1 1 0 002 0V3a2 2 0 012 2v6h-3V8a1 1 0 10-2 0v3H4V5z" clipRule="evenodd"/>
                          </svg>
                          {tipo.medicamentos?.length || 0} medicamentos
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleEdit(tipo)}
                            className="inline-flex items-center px-4 py-2 text-sm font-semibold text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                          >
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                            </svg>
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(tipo.id)}
                            className="inline-flex items-center px-4 py-2 text-sm font-semibold text-red-700 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
                          >
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
                            </svg>
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && tipos.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-slate-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-8 8H9.5v1.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5V11H5c-.83 0-1.5-.67-1.5-1.5S4.17 8 5 8h1.5V6.5C6.5 5.67 7.17 5 8 5s1.5.67 1.5 1.5V8H11c.83 0 1.5.67 1.5 1.5S11.83 11 11 11z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No hay categorías registradas</h3>
              <p className="text-slate-500 mb-6">Comience creando su primera categoría farmacológica</p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
                </svg>
                Crear Primera Categoría
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}