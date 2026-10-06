import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { PrismaClient } from '@prisma/client'

interface ImportOrganization {
  id: string
  name: string
  industry: string | null
  size: string | null
  website: string | null
  createdAt: string
  updatedAt: string
  contacts: ImportContact[]
}

interface ImportContact {
  id: string
  name: string
  email: string
  phone: string | null
  role: string | null
  organizationId: string | null
  createdAt: string
  updatedAt: string
  leads: ImportLead[]
}

interface ImportLead {
  id: string
  title: string
  status: string
  source: string | null
  priority: string
  nextAction: string | null
  notes: string | null
  organizationId: string | null
  contactId: string | null
  createdAt: string
  updatedAt: string
  activities: ImportActivity[]
  tasks: ImportTask[]
}

interface ImportActivity {
  id: string
  channel: string
  description: string
  outcome: string | null
  timestamp: string
  leadId: string | null
  contactId: string | null
  organizationId: string | null
}

interface ImportTask {
  id: string
  title: string
  dueDate: string
  priority: string
  completed: boolean
  leadId: string | null
  contactId: string | null
  organizationId: string | null
}

interface ImportData {
  organizations: ImportOrganization[]
  contacts: ImportContact[]
  leads: ImportLead[]
  activities: ImportActivity[]
  tasks: ImportTask[]
}

function generateNewId(): string {
  return crypto.randomUUID()
}

function buildContactData(contact: ImportContact, orgId?: string): PrismaClient['contact']['create']['args']['data'] {
  return {
    id: crypto.randomUUID(),
    name: contact.name,
    email: contact.email,
    phone: contact.phone,
    role: contact.role,
    organizationId: contact.organizationId ?? (orgId ?? crypto.randomUUID()),
  }
}

function buildLeadData(lead: ImportLead, orgId?: string, contactId?: string): PrismaClient['lead']['create']['args']['data'] {
  const data: PrismaClient['lead']['create']['args']['data'] = {
    id: crypto.randomUUID(),
    title: lead.title,
    status: lead.status,
    source: lead.source,
    priority: lead.priority,
    nextAction: lead.nextAction,
    notes: lead.notes,
  }
  if (orgId) data.organizationId = orgId
  if (contactId) data.contactId = contactId
  return data
}

function buildActivityData(activity: ImportActivity, orgId?: string, contactId?: string): PrismaClient['activity']['create']['args']['data'] {
  const data: PrismaClient['activity']['create']['args']['data'] = {
    id: crypto.randomUUID(),
    channel: activity.channel,
    description: activity.description,
    outcome: activity.outcome,
    timestamp: new Date(activity.timestamp),
  }
  if (orgId) data.organizationId = orgId
  if (contactId) data.contactId = contactId
  if (orgId) data.leadId = crypto.randomUUID()
  return data
}

function buildTaskData(task: ImportTask, orgId?: string, contactId?: string): PrismaClient['task']['create']['args']['data'] {
  const data: PrismaClient['task']['create']['args']['data'] = {
    id: crypto.randomUUID(),
    title: task.title,
    dueDate: task.dueDate,
    priority: task.priority,
    completed: task.completed,
  }
  if (orgId) data.organizationId = orgId
  if (contactId) data.contactId = contactId
  if (orgId) data.leadId = crypto.randomUUID()
  return data
}

async function importOrganizations(
  orgs: ImportData['organizations'],
  existingOrgIds: Map<string, string>,
  existingContactIds: Map<string, string>,
  existingLeadIds: Map<string, string>
) {
  for (const org of orgs) {
    const newId = generateNewId()
    await prisma.organization.create({
      data: {
        id: newId,
        name: org.name,
        industry: org.industry,
        size: org.size,
        website: org.website,
      }
    })

    for (const contact of org.contacts) {
      const newContactId = generateNewId()
      await prisma.contact.create({
        data: buildContactData(contact, newId)
      })
      existingContactIds.set(contact.id, newContactId)

      for (const lead of contact.leads) {
        const newLeadId = generateNewId()
        await prisma.lead.create({
          data: buildLeadData(lead, newId, newContactId)
        })
        existingLeadIds.set(lead.id, newLeadId)

        for (const activity of lead.activities) {
          await prisma.activity.create({
            data: buildActivityData(activity, newId, newContactId)
          })
        }

        for (const task of lead.tasks) {
          await prisma.task.create({
            data: buildTaskData(task, newId, newContactId)
          })
        }
      }
    }
  }
}

async function importContacts(
  contacts: ImportData['contacts'],
  orgIdMap: Map<string, string>,
  existingContactIds: Map<string, string>,
  existingLeadIds: Map<string, string>
) {
  for (const contact of contacts) {
    const newContactId = generateNewId()
    await prisma.contact.create({
      data: buildContactData(contact)
    })
    existingContactIds.set(contact.id, newContactId)

    for (const lead of contact.leads) {
      const newLeadId = generateNewId()
      await prisma.lead.create({
        data: buildLeadData(lead, undefined, newContactId)
      })
      existingLeadIds.set(lead.id, newLeadId)

      for (const activity of lead.activities) {
        await prisma.activity.create({
          data: buildActivityData(activity)
        })
      }

      for (const task of lead.tasks) {
        await prisma.task.create({
          data: buildTaskData(task)
        })
      }
    }
  }
}

async function importLeads(
  leads: ImportData['leads'],
  orgIdMap: Map<string, string>,
  contactIdMap: Map<string, string>
) {
  for (const lead of leads) {
    const orgId = lead.organizationId ? orgIdMap.get(lead.organizationId) : undefined
    const contactId = lead.contactId ? contactIdMap.get(lead.contactId) : undefined

    await prisma.lead.create({
      data: buildLeadData(lead, orgId, contactId)
    })

    for (const activity of lead.activities) {
      await prisma.activity.create({
        data: buildActivityData(activity, orgId, contactId)
      })
    }

    for (const task of lead.tasks) {
      await prisma.task.create({
        data: buildTaskData(task, orgId, contactId)
      })
    }
  }
}

async function importActivities(
  activities: ImportData['activities'],
  orgIdMap: Map<string, string>,
  contactIdMap: Map<string, string>,
  leadIdMap: Map<string, string>
) {
  for (const activity of activities) {
    await prisma.activity.create({
      data: {
        id: crypto.randomUUID(),
        channel: activity.channel,
        description: activity.description,
        outcome: activity.outcome,
        timestamp: new Date(activity.timestamp),
        ...(activity.leadId && leadIdMap.has(activity.leadId) ? { leadId: leadIdMap.get(activity.leadId) } : {}),
        ...(activity.contactId && contactIdMap.has(activity.contactId) ? { contactId: contactIdMap.get(activity.contactId) } : {}),
        ...(activity.organizationId && orgIdMap.has(activity.organizationId) ? { organizationId: orgIdMap.get(activity.organizationId) } : {}),
      }
    })
  }
}

async function importTasks(
  tasks: ImportData['tasks'],
  orgIdMap: Map<string, string>,
  contactIdMap: Map<string, string>,
  leadIdMap: Map<string, string>
) {
  for (const task of tasks) {
    await prisma.task.create({
      data: {
        id: crypto.randomUUID(),
        title: task.title,
        dueDate: task.dueDate,
        priority: task.priority,
        completed: task.completed,
        ...(task.leadId && leadIdMap.has(task.leadId) ? { leadId: leadIdMap.get(task.leadId) } : {}),
        ...(task.contactId && contactIdMap.has(task.contactId) ? { contactId: contactIdMap.get(task.contactId) } : {}),
        ...(task.organizationId && orgIdMap.has(task.organizationId) ? { organizationId: orgIdMap.get(task.organizationId) } : {}),
      }
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as ImportData

    const existingOrgs = await prisma.organization.findMany({
      select: { id: true }
    })
    const existingContacts = await prisma.contact.findMany({
      select: { id: true, organizationId: true }
    })
    const existingLeads = await prisma.lead.findMany({
      select: { id: true, organizationId: true, contactId: true }
    })

    const existingOrgIds = new Map(existingOrgs.map(o => [o.id, o.id]))
    const existingContactIds = new Map(existingContacts.map(c => [c.id, c.id]))
    const existingLeadIds = new Map(existingLeads.map(l => [l.id, l.id]))

    const orgIdMap = new Map<string, string>()
    const contactIdMap = new Map<string, string>()
    const leadIdMap = new Map<string, string>()

    await importOrganizations(
      body.organizations,
      existingOrgIds,
      existingContactIds,
      existingLeadIds
    )

    const newOrgs = await prisma.organization.findMany({
      select: { id: true, name: true }
    })
    for (const org of newOrgs) {
      orgIdMap.set(org.name, org.id)
    }

    await importContacts(
      body.contacts,
      orgIdMap,
      existingContactIds,
      existingLeadIds
    )

    const newContacts = await prisma.contact.findMany({
      select: { id: true, name: true, organizationId: true }
    })
    for (const contact of newContacts) {
      contactIdMap.set(contact.name, contact.id)
    }

    await importLeads(
      body.leads,
      orgIdMap,
      contactIdMap
    )

    const newLeads = await prisma.lead.findMany({
      select: { id: true, title: true }
    })
    for (const lead of newLeads) {
      leadIdMap.set(lead.title, lead.id)
    }

    await importActivities(
      body.activities,
      orgIdMap,
      contactIdMap,
      leadIdMap
    )

    await importTasks(
      body.tasks,
      orgIdMap,
      contactIdMap,
      leadIdMap
    )

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Import failed:', error)
    return NextResponse.json(
      { error: 'Failed to import data' },
      { status: 500 }
    )
  }
}