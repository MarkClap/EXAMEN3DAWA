import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

interface MedicamentoRequest {
  id?: number
  nombre: string
  descripcion?: string
  precio: number
  stock: number
  fechaVencimiento: string
  laboratorio: string
  tipoMedicamentoId: number
}

// GET - Obtener todos los medicamentos O uno específico por ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      // Obtener medicamento específico por ID
      const medicamentoId = parseInt(id)
      
      if (isNaN(medicamentoId)) {
        return NextResponse.json(
          { error: 'ID inválido' },
          { status: 400 }
        )
      }

      const medicamento = await prisma.medicamento.findUnique({
        where: { id: medicamentoId },
        include: {
          tipoMedicamento: true,
        },
      })

      if (!medicamento) {
        return NextResponse.json(
          { error: 'Medicamento no encontrado' },
          { status: 404 }
        )
      }

      return NextResponse.json(medicamento)
    } else {
      // Obtener todos los medicamentos
      const medicamentos = await prisma.medicamento.findMany({
        include: {
          tipoMedicamento: true,
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
      
      return NextResponse.json(medicamentos)
    }
  } catch (error) {
    console.error('Error al obtener medicamentos:', error)
    return NextResponse.json(
      { error: 'Error al obtener medicamentos' },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo medicamento
export async function POST(request: NextRequest) {
  try {
    const body: MedicamentoRequest = await request.json()
    const { 
      nombre, 
      descripcion, 
      precio, 
      stock, 
      fechaVencimiento, 
      laboratorio, 
      tipoMedicamentoId 
    } = body

    // Validaciones básicas
    const errors: string[] = []
    
    if (!nombre || nombre.trim() === '') {
      errors.push('El nombre es requerido')
    }
    
    if (!precio || precio <= 0) {
      errors.push('El precio debe ser mayor a 0')
    }
    
    if (stock === undefined || stock < 0) {
      errors.push('El stock no puede ser negativo')
    }
    
    if (!fechaVencimiento) {
      errors.push('La fecha de vencimiento es requerida')
    } else {
      const fechaVenc = new Date(fechaVencimiento)
      const hoy = new Date()
      if (fechaVenc <= hoy) {
        errors.push('La fecha de vencimiento debe ser posterior a hoy')
      }
    }
    
    if (!laboratorio || laboratorio.trim() === '') {
      errors.push('El laboratorio es requerido')
    }
    
    if (!tipoMedicamentoId) {
      errors.push('El tipo de medicamento es requerido')
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Errores de validación', details: errors },
        { status: 400 }
      )
    }

    // Verificar que existe el tipo de medicamento
    const tipoExiste = await prisma.tipoMedicamento.findUnique({
      where: { id: parseInt(tipoMedicamentoId.toString()) }
    })

    if (!tipoExiste) {
      return NextResponse.json(
        { error: 'El tipo de medicamento especificado no existe' },
        { status: 400 }
      )
    }

    const nuevoMedicamento = await prisma.medicamento.create({
      data: {
        nombre: nombre.trim(),
        descripcion: descripcion?.trim() || null,
        precio: parseFloat(precio.toString()),
        stock: parseInt(stock.toString()),
        fechaVencimiento: new Date(fechaVencimiento),
        laboratorio: laboratorio.trim(),
        tipoMedicamentoId: parseInt(tipoMedicamentoId.toString()),
      },
      include: {
        tipoMedicamento: true,
      },
    })

    return NextResponse.json(nuevoMedicamento, { status: 201 })
  } catch (error) {
    console.error('Error al crear medicamento:', error)
    return NextResponse.json(
      { error: 'Error al crear medicamento' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar medicamento
export async function PUT(request: NextRequest) {
  try {
    const body: MedicamentoRequest = await request.json()
    const { 
      id,
      nombre, 
      descripcion, 
      precio, 
      stock, 
      fechaVencimiento, 
      laboratorio, 
      tipoMedicamentoId 
    } = body

    if (!id || isNaN(id)) {
      return NextResponse.json(
        { error: 'ID es requerido y debe ser válido' },
        { status: 400 }
      )
    }

    // Validaciones básicas
    const errors: string[] = []
    
    if (!nombre || nombre.trim() === '') {
      errors.push('El nombre es requerido')
    }
    
    if (!precio || precio <= 0) {
      errors.push('El precio debe ser mayor a 0')
    }
    
    if (stock === undefined || stock < 0) {
      errors.push('El stock no puede ser negativo')
    }
    
    if (!fechaVencimiento) {
      errors.push('La fecha de vencimiento es requerida')
    }
    
    if (!laboratorio || laboratorio.trim() === '') {
      errors.push('El laboratorio es requerido')
    }
    
    if (!tipoMedicamentoId) {
      errors.push('El tipo de medicamento es requerido')
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Errores de validación', details: errors },
        { status: 400 }
      )
    }

    // Verificar que existe el tipo de medicamento
    const tipoExiste = await prisma.tipoMedicamento.findUnique({
      where: { id: parseInt(tipoMedicamentoId.toString()) }
    })

    if (!tipoExiste) {
      return NextResponse.json(
        { error: 'El tipo de medicamento especificado no existe' },
        { status: 400 }
      )
    }

    const medicamentoActualizado = await prisma.medicamento.update({
      where: { id: parseInt(id.toString()) },
      data: {
        nombre: nombre.trim(),
        descripcion: descripcion?.trim() || null,
        precio: parseFloat(precio.toString()),
        stock: parseInt(stock.toString()),
        fechaVencimiento: new Date(fechaVencimiento),
        laboratorio: laboratorio.trim(),
        tipoMedicamentoId: parseInt(tipoMedicamentoId.toString()),
      },
      include: {
        tipoMedicamento: true,
      },
    })

    return NextResponse.json(medicamentoActualizado)
  } catch (error: any) {
    console.error('Error al actualizar medicamento:', error)
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Medicamento no encontrado' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Error al actualizar medicamento' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar medicamento
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'ID es requerido y debe ser válido' },
        { status: 400 }
      )
    }

    const medicamentoId = parseInt(id)

    await prisma.medicamento.delete({
      where: { id: medicamentoId },
    })

    return NextResponse.json(
      { message: 'Medicamento eliminado correctamente' },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error al eliminar medicamento:', error)
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Medicamento no encontrado' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Error al eliminar medicamento' },
      { status: 500 }
    )
  }
}