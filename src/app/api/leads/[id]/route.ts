import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { mutationError } from '@/lib/http'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      contact: true,
      organization: true,
      activities: {
        include: { contact: true },
        orderBy: { timestamp: 'desc' }
      },
      tasks: { orderBy: { createdAt: 'desc' } }
    }
  })
  
  if (!lead) {
    return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
  }
  
  return NextResponse.json(lead)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const oldLead = await prisma.lead.findUnique({ where: { id } })
    if (!oldLead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    const data: {
      title?: string
      status?: string
      source?: string
      priority?: string
      nextAction?: string
      notes?: string
    } = {}
    for (const field of ['title', 'status', 'source', 'priority', 'nextAction', 'notes'] as const) {
      if (field in body) data[field] = body[field]
    }

    const lead = await prisma.lead.update({
      where: { id },
      data,
      include: { contact: true, organization: true }
    })

    if (typeof data.status === 'string' && data.status !== oldLead.status) {
      await prisma.activity.create({
        data: {
          channel: 'Status',
          description: `Stage updated from "${oldLead.status}" to "${data.status}"`,
          outcome: 'Pipeline advancement',
          leadId: lead.id,
          contactId: lead.contactId,
          organizationId: lead.organizationId
        }
      })
    }

    return NextResponse.json(lead)
  } catch (error) {
    return mutationError(error, 'Failed to update lead')
  }
}