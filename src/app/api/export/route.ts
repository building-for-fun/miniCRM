import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const [organizations, contacts, leads, activities, tasks] = await Promise.all([
      prisma.organization.findMany({
        include: {
          contacts: { include: { leads: { include: { activities: true, tasks: true } } } },
          leads: { include: { activities: true, tasks: true } },
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.contact.findMany({
        include: {
          organization: true,
          leads: true,
          activities: true,
          tasks: true,
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.lead.findMany({
        include: {
          organization: true,
          contact: true,
          activities: true,
          tasks: true,
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.activity.findMany({
        include: {
          lead: true,
          contact: true,
          organization: true,
        },
        orderBy: { timestamp: 'desc' }
      }),
      prisma.task.findMany({
        include: {
          lead: true,
          contact: true,
          organization: true,
        },
        orderBy: { createdAt: 'desc' }
      }),
    ])

    const data = {
      organizations,
      contacts,
      leads,
      activities,
      tasks,
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Export failed:', error)
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    )
  }
}