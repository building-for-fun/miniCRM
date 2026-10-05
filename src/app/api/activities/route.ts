import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { mutationError } from '@/lib/http'

export async function GET() {
  const activities = await prisma.activity.findMany({
    include: {
      lead: true,
      contact: true,
      organization: true
    },
    orderBy: { timestamp: 'desc' }
  })
  return NextResponse.json(activities)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const lead = await prisma.lead.findUnique({ where: { id: body.leadId } })

    const activity = await prisma.activity.create({
      data: {
        channel: body.channel,
        description: body.description,
        outcome: body.outcome,
        leadId: body.leadId,
        contactId: lead?.contactId || body.contactId,
        organizationId: lead?.organizationId || body.organizationId
      },
      include: { lead: true, contact: true, organization: true }
    })
    return NextResponse.json(activity, { status: 201 })
  } catch (error) {
    return mutationError(error, 'Failed to create activity')
  }
}