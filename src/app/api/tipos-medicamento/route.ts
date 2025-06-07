import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

// GET - Obtener todos los tipos de medicamento O uno específico por ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      // Obtener tipo específico por ID
      const tipoId = parseInt(id)
      
      if (isNaN(tipoId)) {
        return NextResponse.json(
          { error: 'ID inválido' },
          { status: 400 }
        )
      }

      const tipoMedicamento = await prisma.tipoMedicamento.findUnique({
        where: { id: tipoId },
        include: {
          medicamentos: true,
        },
      })

      if (!tipoMedicamento) {
        return NextResponse.json(
          { error: 'Tipo de medicamento no encontrado' },
          { status: 404 }
        )
      }

      return NextResponse.json(tipoMedicamento)
    } else {
      // Obtener todos los tipos de medicamento
      const tiposMedicamento = await prisma.tipoMedicamento.findMany({
        include: {
          medicamentos: true,
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
      
      return NextResponse.json(tiposMedicamento)
    }
  } catch (error) {
    console.error('Error al obtener tipos de medicamento:', error)
    return NextResponse.json(
      { error: 'Error al obtener tipos de medicamento' },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo tipo de medicamento
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nombre, descripcion }: { nombre: string; descripcion?: string } = body

    // Validaciones básicas
    if (!nombre || nombre.trim() === '') {
      return NextResponse.json(
        { error: 'El nombre es requerido' },
        { status: 400 }
      )
    }

    const nuevoTipo = await prisma.tipoMedicamento.create({
      data: {
        nombre: nombre.trim(),
        descripcion: descripcion?.trim() || null,
      },
      include: {
        medicamentos: true,
      },
    })

    return NextResponse.json(nuevoTipo, { status: 201 })
  } catch (error: unknown) {
    console.error('Error al crear tipo de medicamento:', error)

    if (error && typeof error === 'object' && 'code' in error) {
      const err = error as { code?: string }

      if (err.code === 'P2002') {
        return NextResponse.json(
          { error: 'Ya existe un tipo de medicamento con ese nombre' },
          { status: 409 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Error al crear tipo de medicamento' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar tipo de medicamento
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, nombre, descripcion }: { id: number; nombre: string; descripcion?: string } = body

    if (!id || isNaN(id)) {
      return NextResponse.json(
        { error: 'ID es requerido y debe ser válido' },
        { status: 400 }
      )
    }

    if (!nombre || nombre.trim() === '') {
      return NextResponse.json(
        { error: 'El nombre es requerido' },
        { status: 400 }
      )
    }

    const tipoActualizado = await prisma.tipoMedicamento.update({
      where: { id: parseInt(id.toString()) },
      data: {
        nombre: nombre.trim(),
        descripcion: descripcion?.trim() || null,
      },
      include: {
        medicamentos: true,
      },
    })

    return NextResponse.json(tipoActualizado)
  } catch (error: unknown) {
    console.error('Error al actualizar tipo de medicamento:', error)

    if (error && typeof error === 'object' && 'code' in error) {
      const err = error as { code?: string }

      if (err.code === 'P2025') {
        return NextResponse.json(
          { error: 'Tipo de medicamento no encontrado' },
          { status: 404 }
        )
      }

      if (err.code === 'P2002') {
        return NextResponse.json(
          { error: 'Ya existe un tipo de medicamento con ese nombre' },
          { status: 409 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Error al actualizar tipo de medicamento' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar tipo de medicamento
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

    const tipoId = parseInt(id)

    // Verificar si existen medicamentos asociados
    const medicamentosAsociados = await prisma.medicamento.count({
      where: { tipoMedicamentoId: tipoId }
    })

    if (medicamentosAsociados > 0) {
      return NextResponse.json(
        { error: `No se puede eliminar el tipo porque tiene ${medicamentosAsociados} medicamento(s) asociado(s)` },
        { status: 400 }
      )
    }

    await prisma.tipoMedicamento.delete({
      where: { id: tipoId },
    })

    return NextResponse.json(
      { message: 'Tipo de medicamento eliminado correctamente' },
      { status: 200 }
    )
    } catch (error: unknown) {
    console.error('Error al eliminar tipo de medicamento:', error)

    if (error && typeof error === 'object' && 'code' in error) {
      const err = error as { code?: string }

      if (err.code === 'P2025') {
        return NextResponse.json(
          { error: 'Tipo de medicamento no encontrado' },
          { status: 404 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Error al eliminar tipo de medicamento' },
      { status: 500 }
    )
  }
}