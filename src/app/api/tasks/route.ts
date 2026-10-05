import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const filter = searchParams.get('filter') || 'OPEN'

  const where: any = {}
  if (filter === 'OPEN') where.completed = false
  else if (filter === 'COMPLETED') where.completed = true

  const tasks = await prisma.task.findMany({
    where,
    include: {
      lead: true,
      contact: true,
      organization: true
    },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(tasks)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const lead = await prisma.lead.findUnique({ where: { id: body.leadId } })
  
  const task = await prisma.task.create({
    data: {
      title: body.title,
      dueDate: body.dueDate,
      priority: body.priority || 'MEDIUM',
      completed: false,
      leadId: body.leadId,
      contactId: lead?.contactId || body.contactId,
      organizationId: lead?.organizationId || body.organizationId
    },
    include: { lead: true, contact: true, organization: true }
  })
  return NextResponse.json(task, { status: 201 })
}

export async function PATCH(request: NextRequest) {
  const body = await request.json()
  const { id, completed } = body
  
  const task = await prisma.task.update({
    where: { id },
    data: { completed },
    include: { lead: true, contact: true, organization: true }
  })

  if (completed) {
    await prisma.activity.create({
      data: {
        channel: 'Task',
        description: `Completed task: "${task.title}"`,
        outcome: 'Action finished',
        leadId: task.leadId,
        contactId: task.contactId,
        organizationId: task.organizationId
      }
    })
  }

  return NextResponse.json(task)
}