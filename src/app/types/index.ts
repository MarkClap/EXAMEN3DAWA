// Tipos para TipoMedicamento
export interface TipoMedicamento {
  id: number
  nombre: string
  descripcion: string | null
  createdAt: Date
  updatedAt: Date
  medicamentos?: Medicamento[]
}

export interface TipoMedicamentoCreate {
  nombre: string
  descripcion?: string
}

export interface TipoMedicamentoUpdate {
  nombre: string
  descripcion?: string
}

// Tipos para Medicamento
export interface Medicamento {
  id: number
  nombre: string
  descripcion: string | null
  precio: number
  stock: number
  fechaVencimiento: Date
  laboratorio: string
  tipoMedicamentoId: number
  createdAt: Date
  updatedAt: Date
  tipoMedicamento?: TipoMedicamento
}

export interface MedicamentoCreate {
  nombre: string
  descripcion?: string
  precio: number
  stock: number
  fechaVencimiento: string
  laboratorio: string
  tipoMedicamentoId: number
}

export interface MedicamentoUpdate {
  nombre: string
  descripcion?: string
  precio: number
  stock: number
  fechaVencimiento: string
  laboratorio: string
  tipoMedicamentoId: number
}

// Tipos para formularios
export interface TipoMedicamentoFormData {
  nombre: string
  descripcion: string
}

export interface MedicamentoFormData {
  nombre: string
  descripcion: string
  precio: string
  stock: string
  fechaVencimiento: string
  laboratorio: string
  tipoMedicamentoId: string
}

// Tipos para respuestas de API
export interface ApiResponse<T> {
  data?: T
  error?: string
  details?: string[]
}

// Tipos para estados de carga
export interface LoadingState {
  loading: boolean
  error: string
}