export type LeadStatus = 'New' | 'Contacted' | 'Engaged' | 'Qualified' | 'Opportunity' | 'Won' | 'Lost'
export type Priority = 'High' | 'Medium' | 'Low'

export interface Organization {
  id: string
  name: string
  industry?: string
  size?: string
  website?: string
}

export interface Contact {
  id: string
  organizationId: string
  name: string
  email: string
  phone?: string
  role?: string
}

export interface Lead {
  id: string
  title: string
  contactId: string
  organizationId: string
  status: LeadStatus
  source: string
  priority: Priority
  nextAction?: string
  createdAt: string
  notes?: string
}

export interface Activity {
  id: string
  leadId: string
  contactId: string
  organizationId: string
  channel: string
  description: string
  outcome?: string
  timestamp: string
}

export interface Task {
  id: string
  leadId: string
  contactId: string
  organizationId: string
  title: string
  dueDate: string
  priority: Priority
  completed: boolean
}

export interface CrmState {
  organizations: Organization[]
  contacts: Contact[]
  leads: Lead[]
  activities: Activity[]
  tasks: Task[]
}

export function escapeHtml(str?: string | null): string {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
