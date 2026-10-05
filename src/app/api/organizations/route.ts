import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { mutationError } from '@/lib/http'

export async function GET() {
  const organizations = await prisma.organization.findMany({
    include: {
      _count: {
        select: { contacts: true, leads: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(organizations)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const organization = await prisma.organization.create({
      data: {
        name: body.name,
        industry: body.industry,
        size: body.size,
        website: body.website
      }
    })
    return NextResponse.json(organization, { status: 201 })
  } catch (error) {
    return mutationError(error, 'Failed to create organization')
  }
}