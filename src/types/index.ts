export type LeadStatus = 'NEW' | 'CONTACTED' | 'ENGAGED' | 'QUALIFIED' | 'OPPORTUNITY' | 'WON' | 'LOST'
export type Priority = 'HIGH' | 'MEDIUM' | 'LOW'

export interface Organization {
  id: string
  name: string
  industry: string | null
  size: string | null
  website: string | null
  createdAt: string
  updatedAt: string
  _count?: {
    contacts: number
    leads: number
  }
}

export interface Contact {
  id: string
  name: string
  email: string
  phone: string | null
  role: string | null
  organizationId: string
  organization?: Organization
  createdAt: string
  updatedAt: string
  _count?: {
    leads: number
  }
}

export interface Lead {
  id: string
  title: string
  status: LeadStatus
  source: string | null
  priority: Priority
  nextAction: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
  organizationId: string
  contactId: string
  organization?: Organization
  contact?: Contact
  _count?: {
    activities: number
    tasks: number
  }
  activities?: Activity[]
  tasks?: Task[]
}

export interface Activity {
  id: string
  channel: string
  description: string
  outcome: string | null
  timestamp: string
  leadId: string
  contactId: string
  organizationId: string
  lead?: Lead
  contact?: Contact
  organization?: Organization
}

export interface Task {
  id: string
  title: string
  dueDate: string
  priority: Priority
  completed: boolean
  createdAt: string
  updatedAt: string
  leadId: string
  contactId: string
  organizationId: string
  lead?: Lead
  contact?: Contact
  organization?: Organization
}

export const STATUS_COLORS: Record<LeadStatus, { bg: string; text: string }> = {
  NEW: { bg: '#f1f5f9', text: '#64748b' },
  CONTACTED: { bg: '#e0f2fe', text: '#0284c7' },
  ENGAGED: { bg: '#e0e7ff', text: '#6366f1' },
  QUALIFIED: { bg: '#fef3c7', text: '#d97706' },
  OPPORTUNITY: { bg: '#f3e8ff', text: '#9333ea' },
  WON: { bg: '#dcfce7', text: '#16a34a' },
  LOST: { bg: '#fee2e2', text: '#dc2626' }
}

export const PRIORITY_COLORS: Record<Priority, string> = {
  HIGH: '#dc2626',
  MEDIUM: '#d97706',
  LOW: '#64748b'
}