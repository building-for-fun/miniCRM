import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

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
  const { id } = await params
  const body = await request.json()
  
  const oldLead = await prisma.lead.findUnique({ where: { id } })
  if (!oldLead) {
    return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
  }

  const lead = await prisma.lead.update({
    where: { id },
    data: body,
    include: { contact: true, organization: true }
  })

  if (body.status && body.status !== oldLead.status) {
    await prisma.activity.create({
      data: {
        channel: 'Status',
        description: `Stage updated from "${oldLead.status}" to "${body.status}"`,
        outcome: 'Pipeline advancement',
        leadId: lead.id,
        contactId: lead.contactId,
        organizationId: lead.organizationId
      }
    })
  }

  return NextResponse.json(lead)
}