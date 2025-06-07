'use client'

import { useState, useEffect } from 'react'
import { Medicamento, TipoMedicamento, MedicamentoFormData, LoadingState } from '../types/index'

export default function MedicamentosPage() {
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([])
  const [tiposMedicamento, setTiposMedicamento] = useState<TipoMedicamento[]>([])
  const [{ loading, error }, setLoadingState] = useState<LoadingState>({ loading: true, error: '' })
  const [showForm, setShowForm] = useState<boolean>(false)
  const [editingMedicamento, setEditingMedicamento] = useState<Medicamento | null>(null)
  const [formData, setFormData] = useState<MedicamentoFormData>({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    fechaVencimiento: '',
    laboratorio: '',
    tipoMedicamentoId: ''
  })

  // Cargar datos
  const fetchData = async (): Promise<void> => {
    try {
      setLoadingState({ loading: true, error: '' })
      const [medicamentosRes, tiposRes] = await Promise.all([
        fetch('/api/medicamentos'),
        fetch('/api/tipos-medicamento')
      ])

      if (!medicamentosRes.ok || !tiposRes.ok) {
        throw new Error('Error al cargar datos')
      }

      const [medicamentosData, tiposData]: [Medicamento[], TipoMedicamento[]] = await Promise.all([
        medicamentosRes.json(),
        tiposRes.json()
      ])

      setMedicamentos(medicamentosData)
      setTiposMedicamento(tiposData)
    } catch (err) {
      setLoadingState({ loading: false, error: 'Error al cargar los datos' })
      console.error(err)
    } finally {
      setLoadingState(prev => ({ ...prev, loading: false }))
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setLoadingState(prev => ({ ...prev, error: '' }))

    try {
      const method = editingMedicamento ? 'PUT' : 'POST'
      const bodyData = {
        ...formData,
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock),
        tipoMedicamentoId: parseInt(formData.tipoMedicamentoId),
        ...(editingMedicamento && { id: editingMedicamento.id })
      }

      const response = await fetch('/api/medicamentos', {
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

      await fetchData()
      setShowForm(false)
      setEditingMedicamento(null)
      setFormData({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        fechaVencimiento: '',
        laboratorio: '',
        tipoMedicamentoId: ''
      })
    } catch (err) {
      setLoadingState(prev => ({ ...prev, error: (err as Error).message }))
    }
  }

  // Eliminar medicamento
  const handleDelete = async (id: number): Promise<void> => {
    if (!confirm('¿Estás seguro de eliminar este medicamento?')) return

    try {
      const response = await fetch(`/api/medicamentos?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al eliminar')
      }

      await fetchData()
    } catch (err) {
      setLoadingState(prev => ({ ...prev, error: (err as Error).message }))
    }
  }

  // Editar medicamento
  const handleEdit = (medicamento: Medicamento): void => {
    setEditingMedicamento(medicamento)
    setFormData({
      nombre: medicamento.nombre,
      descripcion: medicamento.descripcion || '',
      precio: medicamento.precio.toString(),
      stock: medicamento.stock.toString(),
      fechaVencimiento: new Date(medicamento.fechaVencimiento).toISOString().split('T')[0],
      laboratorio: medicamento.laboratorio,
      tipoMedicamentoId: medicamento.tipoMedicamentoId.toString()
    })
    setShowForm(true)
  }

  // Cancelar formulario
  const handleCancel = (): void => {
    setShowForm(false)
    setEditingMedicamento(null)
    setFormData({
      nombre: '',
      descripcion: '',
      precio: '',
      stock: '',
      fechaVencimiento: '',
      laboratorio: '',
      tipoMedicamentoId: ''
    })
    setLoadingState(prev => ({ ...prev, error: '' }))
  }

  // Manejar cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Formatear fecha
  const formatDate = (dateString: string | Date): string => {
    return new Date(dateString).toLocaleDateString('es-ES')
  }

  // Formatear precio
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(price)
  }

  // Obtener clase CSS para el stock
  const getStockStatus = (stock: number) => {
    if (stock > 20) return { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'En Stock' }
    if (stock > 5) return { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Bajo Stock' }
    return { bg: 'bg-red-100', text: 'text-red-800', label: 'Stock Crítico' }
  }

  // Verificar si está próximo a vencer
  const isNearExpiry = (dateString: string | Date): boolean => {
    const expiryDate = new Date(dateString)
    const today = new Date()
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
    return expiryDate <= thirtyDaysFromNow
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 py-8">
      <div className="max-w-8xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-emerald-600 to-teal-600 p-3 rounded-xl shadow-lg">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                Inventario Farmacéutico
              </h1>
              <p className="text-slate-600 font-medium">Control de medicamentos y existencias</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
            </svg>
            Nuevo Medicamento
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
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-3 rounded-xl mr-4">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 002 0V3a2 2 0 012 0v1a1 1 0 002 0V3a2 2 0 012 2v6h-3V8a1 1 0 10-2 0v3H4V5z" clipRule="evenodd"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">
                {editingMedicamento ? 'Modificar Medicamento' : 'Nuevo Medicamento'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Nombre del Medicamento *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-slate-50 focus:bg-white"
                    placeholder="Ej: Paracetamol 500mg"
                    required
                  />
                </div>
                
                {/* Precio */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Precio (PEN) *
                  </label>
                  <input
                    type="number"
                    name="precio"
                    step="0.01"
                    min="0"
                    value={formData.precio}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-slate-50 focus:bg-white"
                    placeholder="0.00"
                    required
                  />
                </div>
                
                {/* Stock */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Stock Disponible *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    min="0"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-slate-50 focus:bg-white"
                    placeholder="Unidades"
                    required
                  />
                </div>
                
                {/* Fecha de Vencimiento */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Fecha de Vencimiento *
                  </label>
                  <input
                    type="date"
                    name="fechaVencimiento"
                    value={formData.fechaVencimiento}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-slate-50 focus:bg-white"
                    required
                  />
                </div>
                
                {/* Laboratorio */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Laboratorio *
                  </label>
                  <input
                    type="text"
                    name="laboratorio"
                    value={formData.laboratorio}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-slate-50 focus:bg-white"
                    placeholder="Ej: Pfizer, Roche..."
                    required
                  />
                </div>
                
                {/* Tipo de Medicamento */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Categoría Farmacológica *
                  </label>
                  <select
                    name="tipoMedicamentoId"
                    value={formData.tipoMedicamentoId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-slate-50 focus:bg-white"
                    required
                  >
                    <option value="">Seleccionar categoría...</option>
                    {tiposMedicamento.map((tipo) => (
                      <option key={tipo.id} value={tipo.id}>
                        {tipo.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Descripción */}
                <div className="lg:col-span-3">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Descripción Clínica
                  </label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-slate-50 focus:bg-white"
                    rows={3}
                    placeholder="Indicaciones, contraindicaciones, uso clínico..."
                  />
                </div>
              </div>
              
              <div className="flex space-x-4 mt-8">
                <button 
                  type="submit" 
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  {editingMedicamento ? 'Actualizar Medicamento' : 'Registrar Medicamento'}
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
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                <span className="text-slate-600 font-medium">Cargando inventario...</span>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-slate-100 to-slate-200 border-b border-slate-300">
                  <tr>
                    <th className="px-6 py-5 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-5 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Medicamento</th>
                    <th className="px-6 py-5 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Categoría</th>
                    <th className="px-6 py-5 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Precio</th>
                    <th className="px-6 py-5 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-5 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Vencimiento</th>
                    <th className="px-6 py-5 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Laboratorio</th>
                    <th className="px-6 py-5 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {medicamentos.map((medicamento, index) => {
                    const stockStatus = getStockStatus(medicamento.stock)
                    const nearExpiry = isNearExpiry(medicamento.fechaVencimiento)
                    
                    return (
                      <tr key={medicamento.id} className={`hover:bg-slate-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-25'}`}>
                        <td className="px-6 py-6 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-800">
                            #{medicamento.id}
                          </span>
                        </td>
                        <td className="px-6 py-6">
                          <div>
                            <div className="font-semibold text-slate-900 text-lg">{medicamento.nombre}</div>
                            {medicamento.descripcion && (
                              <div className="text-sm text-slate-500 truncate max-w-xs mt-1">
                                {medicamento.descripcion}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800">
                            {medicamento.tipoMedicamento?.nombre}
                          </span>
                        </td>
                        <td className="px-6 py-6">
                          <div className="text-lg font-bold text-slate-900">
                            {formatPrice(medicamento.precio)}
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <span className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-semibold ${stockStatus.bg} ${stockStatus.text}`}>
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z"/>
                            </svg>
                            {medicamento.stock} - {stockStatus.label}
                          </span>
                        </td>
                        <td className="px-6 py-6">
                          <div className={`font-medium ${nearExpiry ? 'text-red-600' : 'text-slate-900'}`}>
                            {formatDate(medicamento.fechaVencimiento)}
                            {nearExpiry && (
                              <div className="text-xs text-red-500 mt-1">
                                ⚠️ Próximo a vencer
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="text-slate-700 font-medium">{medicamento.laboratorio}</div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleEdit(medicamento)}
                              className="inline-flex items-center px-4 py-2 text-sm font-semibold text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                            >
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                              </svg>
                              Editar
                            </button>
                            <button
                              onClick={() => handleDelete(medicamento.id)}
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
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {!loading && medicamentos.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-slate-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No hay medicamentos registrados</h3>
              <p className="text-slate-500 mb-6">Comience registrando su primer medicamento en el inventario</p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
                </svg>
                Registrar Primer Medicamento
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}