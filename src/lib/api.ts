import type { Activity, Contact, Lead, Organization, Priority, Task } from './crm-data'

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    method: init?.method ?? 'GET',
    body: init?.body,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`
    try {
      const body = await res.json()
      if (typeof body?.error === 'string') message = body.error
    } catch {
      /* error body was not JSON */
    }
    throw new ApiError(message, res.status)
  }

  return res.json()
}

function post<T>(url: string, body: unknown): Promise<T> {
  return request<T>(url, { method: 'POST', body: JSON.stringify(body) })
}

function patch<T>(url: string, body: unknown): Promise<T> {
  return request<T>(url, { method: 'PATCH', body: JSON.stringify(body) })
}

interface RawOrganization {
  id: string
  name: string
  industry: string | null
  size: string | null
  website: string | null
}

interface RawContact {
  id: string
  organizationId: string
  name: string
  email: string
  phone: string | null
  role: string | null
}

interface RawLead {
  id: string
  title: string
  contactId: string
  organizationId: string
  status: string
  source: string | null
  priority: string
  nextAction: string | null
  createdAt: string
  notes: string | null
}

interface RawActivity {
  id: string
  leadId: string
  contactId: string
  organizationId: string
  channel: string
  description: string
  outcome: string | null
  timestamp: string
}

interface RawTask {
  id: string
  leadId: string
  contactId: string
  organizationId: string
  title: string
  dueDate: string
  priority: string
  completed: boolean
}

export function formatRelativeTime(value: string | Date): string {
  const then = new Date(value).getTime()
  const minutes = Math.max(0, Math.floor((Date.now() - then) / 60_000))
  if (minutes < 1) return 'Just now'
  const hours = Math.floor(minutes / 60)
  if (hours < 1) return `${minutes}m ago`
  const days = Math.floor(hours / 24)
  if (days < 1) return `${hours}h ago`
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  const weeks = Math.floor(days / 7)
  return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`
}

function toOrganization(raw: RawOrganization): Organization {
  return {
    id: raw.id,
    name: raw.name,
    industry: raw.industry ?? undefined,
    size: raw.size ?? undefined,
    website: raw.website ?? undefined,
  }
}

function toContact(raw: RawContact): Contact {
  return {
    id: raw.id,
    organizationId: raw.organizationId,
    name: raw.name,
    email: raw.email,
    phone: raw.phone ?? undefined,
    role: raw.role ?? undefined,
  }
}

function toLead(raw: RawLead): Lead {
  return {
    id: raw.id,
    title: raw.title,
    contactId: raw.contactId,
    organizationId: raw.organizationId,
    status: raw.status as Lead['status'],
    source: raw.source ?? '',
    priority: raw.priority as Priority,
    nextAction: raw.nextAction ?? undefined,
    createdAt: raw.createdAt.slice(0, 10),
    notes: raw.notes ?? undefined,
  }
}

function toActivity(raw: RawActivity): Activity {
  return {
    id: raw.id,
    leadId: raw.leadId,
    contactId: raw.contactId,
    organizationId: raw.organizationId,
    channel: raw.channel,
    description: raw.description,
    outcome: raw.outcome ?? undefined,
    timestamp: formatRelativeTime(raw.timestamp),
  }
}

function toTask(raw: RawTask): Task {
  return {
    id: raw.id,
    leadId: raw.leadId,
    contactId: raw.contactId,
    organizationId: raw.organizationId,
    title: raw.title,
    dueDate: raw.dueDate,
    priority: raw.priority as Priority,
    completed: raw.completed,
  }
}

export const crmApi = {
  getOrganizations: async (): Promise<Organization[]> =>
    (await request<RawOrganization[]>('/api/organizations')).map(toOrganization),

  getContacts: async (): Promise<Contact[]> =>
    (await request<RawContact[]>('/api/contacts')).map(toContact),

  getLeads: async (): Promise<Lead[]> =>
    (await request<RawLead[]>('/api/leads')).map(toLead),

  getActivities: async (): Promise<Activity[]> =>
    (await request<RawActivity[]>('/api/activities')).map(toActivity),

  getTasks: async (): Promise<Task[]> =>
    (await request<RawTask[]>('/api/tasks?filter=ALL')).map(toTask),

  createLead: async (input: Omit<Lead, 'id' | 'createdAt'>): Promise<Lead> =>
    toLead(await post<RawLead>('/api/leads', input)),

  createContact: async (input: Omit<Contact, 'id'>): Promise<Contact> =>
    toContact(await post<RawContact>('/api/contacts', input)),

  createOrganization: async (input: Omit<Organization, 'id'>): Promise<Organization> =>
    toOrganization(await post<RawOrganization>('/api/organizations', input)),

  createActivity: async (input: Omit<Activity, 'id' | 'timestamp'>): Promise<Activity> =>
    toActivity(await post<RawActivity>('/api/activities', input)),

  createTask: async (input: Omit<Task, 'id' | 'completed'>): Promise<Task> =>
    toTask(await post<RawTask>('/api/tasks', input)),

  updateLeadStatus: async (leadId: string, status: Lead['status']): Promise<Lead> =>
    toLead(await patch<RawLead>(`/api/leads/${leadId}`, { status })),

  updateTaskCompletion: async (taskId: string, completed: boolean): Promise<Task> =>
    toTask(await patch<RawTask>('/api/tasks', { id: taskId, completed })),

  resetSampleData: async (): Promise<{ ok: boolean }> =>
    post('/api/reset', {}),
}
