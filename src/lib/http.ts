import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'

function prismaStatus(code: string): number {
  if (code === 'P2002') return 409
  if (code === 'P2025') return 404
  return 400
}

function prismaMessage(error: Prisma.PrismaClientKnownRequestError): string {
  switch (error.code) {
    case 'P2002': {
      const target = error.meta?.target
      const fields = Array.isArray(target) ? target.join(', ') : 'a field'
      return `A record with this ${fields} already exists`
    }
    case 'P2003':
      return 'A related record does not exist'
    case 'P2025':
      return 'Record not found'
    default:
      return error.message
  }
}

export function mutationError(error: unknown, fallback: string) {
  console.error(fallback, error)
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return NextResponse.json(
      { error: prismaMessage(error) },
      { status: prismaStatus(error.code) }
    )
  }
  return NextResponse.json({ error: fallback }, { status: 500 })
}
