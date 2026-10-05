import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { mutationError } from '@/lib/http'

export async function GET() {
  const contacts = await prisma.contact.findMany({
    include: {
      organization: true,
      _count: { select: { leads: true } }
    },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(contacts)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const contact = await prisma.contact.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        role: body.role,
        organizationId: body.organizationId
      },
      include: { organization: true }
    })
    return NextResponse.json(contact, { status: 201 })
  } catch (error) {
    return mutationError(error, 'Failed to create contact')
  }
}