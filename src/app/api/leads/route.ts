import { NextRequest, NextResponse } from 'next/server'
import type { Prisma } from '@prisma/client'
import prisma from '@/lib/prisma'
import { mutationError } from '@/lib/http'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const search = searchParams.get('search')

  const where: Prisma.LeadWhereInput = {}
  if (status && status !== 'ALL') where.status = status
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { contact: { name: { contains: search } } },
      { organization: { name: { contains: search } } }
    ]
  }

  const leads = await prisma.lead.findMany({
    where,
    include: {
      contact: true,
      organization: true,
      _count: { select: { activities: true, tasks: true } }
    },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(leads)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const lead = await prisma.lead.create({
      data: {
        title: body.title,
        status: body.status || 'New',
        source: body.source,
        priority: body.priority || 'Medium',
        nextAction: body.nextAction,
        notes: body.notes,
        organizationId: body.organizationId,
        contactId: body.contactId
      },
      include: { contact: true, organization: true }
    })

    await prisma.activity.create({
      data: {
        channel: 'Lead',
        description: `New lead created: "${lead.title}"`,
        outcome: `Initial stage: ${lead.status}`,
        leadId: lead.id,
        contactId: lead.contactId,
        organizationId: lead.organizationId
      }
    })

    return NextResponse.json(lead, { status: 201 })
  } catch (error) {
    return mutationError(error, 'Failed to create lead')
  }
}