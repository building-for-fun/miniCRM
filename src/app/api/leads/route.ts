import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const search = searchParams.get('search')

  const where: any = {}
  if (status && status !== 'ALL') where.status = status
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { contact: { name: { contains: search, mode: 'insensitive' } } },
      { organization: { name: { contains: search, mode: 'insensitive' } } }
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
  const body = await request.json()
  const lead = await prisma.lead.create({
    data: {
      title: body.title,
      status: body.status || 'NEW',
      source: body.source,
      priority: body.priority || 'MEDIUM',
      nextAction: body.nextAction,
      notes: body.notes,
      organizationId: body.organizationId,
      contactId: body.contactId
    },
    include: { contact: true, organization: true }
  })

  // Log activity
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
}