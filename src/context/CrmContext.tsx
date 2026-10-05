'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import {
  INITIAL_DATA,
  STORAGE_KEY,
  type CrmState,
  type Lead,
  type Contact,
  type Organization,
  type Activity,
  type Task,
  type LeadStatus,
} from '@/lib/crm-data'

interface CrmContextType {
  state: CrmState
  currentActiveLeadId: string | null
  currentLeadStageFilter: string
  currentTaskFilter: string
  currentView: string
  setCurrentView: (v: string) => void
  setCurrentActiveLeadId: (id: string | null) => void
  setCurrentLeadStageFilter: (f: string) => void
  setCurrentTaskFilter: (f: string) => void
  getOrg: (id: string) => Organization
  getContact: (id: string) => Contact
  getLead: (id: string) => Lead | undefined
  createLead: (data: Omit<Lead, 'id' | 'createdAt'>) => void
  createContact: (data: Omit<Contact, 'id'>) => void
  createOrg: (data: Omit<Organization, 'id'>) => void
  createActivity: (data: Omit<Activity, 'id' | 'timestamp'>) => void
  createTask: (data: Omit<Task, 'id' | 'completed'>) => void
  changeLeadStatus: (leadId: string, newStatus: LeadStatus) => void
  toggleTaskStatus: (taskId: string) => void
  resetToSampleData: () => void
  toasts: { id: number; message: string }[]
  showToast: (message: string) => void
}

const CrmContext = createContext<CrmContextType | null>(null)

function loadState(): CrmState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch {
    /* ignore */
  }
  return JSON.parse(JSON.stringify(INITIAL_DATA))
}

export function CrmProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CrmState>(() =>
    typeof window === 'undefined' ? JSON.parse(JSON.stringify(INITIAL_DATA)) : loadState()
  )
  const [currentActiveLeadId, setCurrentActiveLeadId] = useState<string | null>(null)
  const [currentLeadStageFilter, setCurrentLeadStageFilter] = useState('ALL')
  const [currentTaskFilter, setCurrentTaskFilter] = useState('OPEN')
  const [currentView, setCurrentView] = useState('dashboard')
  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([])

  const persist = useCallback((next: CrmState) => {
    setState(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      /* ignore */
    }
  }, [])

  const showToast = useCallback((message: string) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }, [])

  const getOrg = useCallback(
    (id: string) =>
      state.organizations.find(o => o.id === id) ||
      ({ id: '', name: 'Unknown Org', industry: '—', size: '—', website: '#' } as Organization),
    [state.organizations]
  )

  const getContact = useCallback(
    (id: string) =>
      state.contacts.find(c => c.id === id) ||
      ({ id: '', organizationId: '', name: 'Unknown Contact', email: '—', phone: '—', role: '—' } as Contact),
    [state.contacts]
  )

  const getLead = useCallback(
    (id: string) => state.leads.find(l => l.id === id),
    [state.leads]
  )

  const createLead = useCallback(
    (data: Omit<Lead, 'id' | 'createdAt'>) => {
      const newLead: Lead = {
        ...data,
        id: `lead-${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
      }
      const newActivity: Activity = {
        id: `act-${Date.now()}`,
        leadId: newLead.id,
        contactId: newLead.contactId,
        organizationId: newLead.organizationId,
        channel: 'Lead',
        description: `New lead created: "${newLead.title}"`,
        outcome: `Initial stage: ${newLead.status}`,
        timestamp: 'Just now',
      }
      persist({
        ...state,
        leads: [newLead, ...state.leads],
        activities: [newActivity, ...state.activities],
      })
      showToast('New lead created successfully')
    },
    [state, persist, showToast]
  )

  const createContact = useCallback(
    (data: Omit<Contact, 'id'>) => {
      persist({ ...state, contacts: [{ ...data, id: `cnt-${Date.now()}` }, ...state.contacts] })
      showToast('Contact added to directory')
    },
    [state, persist, showToast]
  )

  const createOrg = useCallback(
    (data: Omit<Organization, 'id'>) => {
      persist({ ...state, organizations: [{ ...data, id: `org-${Date.now()}` }, ...state.organizations] })
      showToast('Organization registered')
    },
    [state, persist, showToast]
  )

  const createActivity = useCallback(
    (data: Omit<Activity, 'id' | 'timestamp'>) => {
      persist({
        ...state,
        activities: [{ ...data, id: `act-${Date.now()}`, timestamp: 'Just now' }, ...state.activities],
      })
      showToast('Activity logged')
    },
    [state, persist, showToast]
  )

  const createTask = useCallback(
    (data: Omit<Task, 'id' | 'completed'>) => {
      persist({ ...state, tasks: [{ ...data, id: `tsk-${Date.now()}`, completed: false }, ...state.tasks] })
      showToast('Task created')
    },
    [state, persist, showToast]
  )

  const changeLeadStatus = useCallback(
    (leadId: string, newStatus: LeadStatus) => {
      const lead = state.leads.find(l => l.id === leadId)
      if (!lead) return
      const oldStatus = lead.status
      const newActivity: Activity = {
        id: `act-${Date.now()}`,
        leadId,
        contactId: lead.contactId,
        organizationId: lead.organizationId,
        channel: 'Status',
        description: `Stage updated from "${oldStatus}" to "${newStatus}"`,
        outcome: 'Pipeline advancement',
        timestamp: 'Just now',
      }
      persist({
        ...state,
        leads: state.leads.map(l => (l.id === leadId ? { ...l, status: newStatus } : l)),
        activities: [newActivity, ...state.activities],
      })
      showToast(`Lead moved to ${newStatus}`)
    },
    [state, persist, showToast]
  )

  const toggleTaskStatus = useCallback(
    (taskId: string) => {
      const task = state.tasks.find(t => t.id === taskId)
      if (!task) return
      const nowCompleted = !task.completed
      const newActivities = nowCompleted
        ? [
            {
              id: `act-${Date.now()}`,
              leadId: task.leadId,
              contactId: task.contactId,
              organizationId: task.organizationId,
              channel: 'Task',
              description: `Completed task: "${task.title}"`,
              outcome: 'Action finished',
              timestamp: 'Just now',
            } as Activity,
            ...state.activities,
          ]
        : state.activities
      persist({
        ...state,
        tasks: state.tasks.map(t => (t.id === taskId ? { ...t, completed: nowCompleted } : t)),
        activities: newActivities,
      })
      showToast(nowCompleted ? 'Task marked completed' : 'Task marked pending')
    },
    [state, persist, showToast]
  )

  const resetToSampleData = useCallback(() => {
    persist(JSON.parse(JSON.stringify(INITIAL_DATA)))
    showToast('Reset to sample CRM fixtures')
  }, [persist, showToast])

  return (
    <CrmContext.Provider
      value={{
        state,
        currentActiveLeadId,
        currentLeadStageFilter,
        currentTaskFilter,
        currentView,
        setCurrentView,
        setCurrentActiveLeadId,
        setCurrentLeadStageFilter,
        setCurrentTaskFilter,
        getOrg,
        getContact,
        getLead,
        createLead,
        createContact,
        createOrg,
        createActivity,
        createTask,
        changeLeadStatus,
        toggleTaskStatus,
        resetToSampleData,
        toasts,
        showToast,
      }}
    >
      {children}
    </CrmContext.Provider>
  )
}

export function useCrm() {
  const ctx = useContext(CrmContext)
  if (!ctx) throw new Error('useCrm must be used within CrmProvider')
  return ctx
}
