'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  type CrmState,
  type Lead,
  type Contact,
  type Organization,
  type Activity,
  type Task,
  type LeadStatus,
} from '@/lib/crm-data'
import { crmApi } from '@/lib/api'

interface CrmContextType {
  state: CrmState
  isLoading: boolean
  loadError: string | null
  refetch: () => void
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

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback
}

export function CrmProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()

  const [currentActiveLeadId, setCurrentActiveLeadId] = useState<string | null>(null)
  const [currentLeadStageFilter, setCurrentLeadStageFilter] = useState('ALL')
  const [currentTaskFilter, setCurrentTaskFilter] = useState('OPEN')
  const [currentView, setCurrentView] = useState('dashboard')
  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([])

  const organizationsQuery = useQuery({ queryKey: ['organizations'], queryFn: crmApi.getOrganizations })
  const contactsQuery = useQuery({ queryKey: ['contacts'], queryFn: crmApi.getContacts })
  const leadsQuery = useQuery({ queryKey: ['leads'], queryFn: crmApi.getLeads })
  const activitiesQuery = useQuery({ queryKey: ['activities'], queryFn: crmApi.getActivities })
  const tasksQuery = useQuery({ queryKey: ['tasks'], queryFn: crmApi.getTasks })

  const state = useMemo<CrmState>(
    () => ({
      organizations: organizationsQuery.data ?? [],
      contacts: contactsQuery.data ?? [],
      leads: leadsQuery.data ?? [],
      activities: activitiesQuery.data ?? [],
      tasks: tasksQuery.data ?? [],
    }),
    [
      organizationsQuery.data,
      contactsQuery.data,
      leadsQuery.data,
      activitiesQuery.data,
      tasksQuery.data,
    ]
  )

  const isLoading =
    organizationsQuery.isPending ||
    contactsQuery.isPending ||
    leadsQuery.isPending ||
    activitiesQuery.isPending ||
    tasksQuery.isPending

  const firstError = [
    organizationsQuery.error,
    contactsQuery.error,
    leadsQuery.error,
    activitiesQuery.error,
    tasksQuery.error,
  ].find(Boolean)

  const loadError = firstError ? errorMessage(firstError, 'Failed to load CRM data') : null

  const refetch = useCallback(() => {
    void queryClient.invalidateQueries()
  }, [queryClient])

  const showToast = useCallback((message: string) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }, [])

  const notifyError = useCallback(
    (error: unknown, fallback: string) => showToast(errorMessage(error, fallback)),
    [showToast]
  )

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

  const createLeadMutation = useMutation({
    mutationFn: crmApi.createLead,
    onSuccess: () => {
      refetch()
      showToast('New lead created successfully')
    },
    onError: error => notifyError(error, 'Failed to create lead'),
  })

  const createContactMutation = useMutation({
    mutationFn: crmApi.createContact,
    onSuccess: () => {
      refetch()
      showToast('Contact added to directory')
    },
    onError: error => notifyError(error, 'Failed to add contact'),
  })

  const createOrgMutation = useMutation({
    mutationFn: crmApi.createOrganization,
    onSuccess: () => {
      refetch()
      showToast('Organization registered')
    },
    onError: error => notifyError(error, 'Failed to register organization'),
  })

  const createActivityMutation = useMutation({
    mutationFn: crmApi.createActivity,
    onSuccess: () => {
      refetch()
      showToast('Activity logged')
    },
    onError: error => notifyError(error, 'Failed to log activity'),
  })

  const createTaskMutation = useMutation({
    mutationFn: crmApi.createTask,
    onSuccess: () => {
      refetch()
      showToast('Task created')
    },
    onError: error => notifyError(error, 'Failed to create task'),
  })

  const changeLeadStatusMutation = useMutation({
    mutationFn: ({ leadId, status }: { leadId: string; status: LeadStatus }) =>
      crmApi.updateLeadStatus(leadId, status),
    onSuccess: (_lead, { status }) => {
      refetch()
      showToast(`Lead moved to ${status}`)
    },
    onError: error => notifyError(error, 'Failed to update lead status'),
  })

  const toggleTaskStatusMutation = useMutation({
    mutationFn: ({ taskId, completed }: { taskId: string; completed: boolean }) =>
      crmApi.updateTaskCompletion(taskId, completed),
    onSuccess: (_task, { completed }) => {
      refetch()
      showToast(completed ? 'Task marked completed' : 'Task marked pending')
    },
    onError: error => notifyError(error, 'Failed to update task'),
  })

  const resetToSampleDataMutation = useMutation({
    mutationFn: crmApi.resetSampleData,
    onSuccess: () => {
      refetch()
      showToast('Reset to sample CRM fixtures')
    },
    onError: error => notifyError(error, 'Failed to reset sample data'),
  })

  const createLead = useCallback(
    (data: Omit<Lead, 'id' | 'createdAt'>) => createLeadMutation.mutate(data),
    [createLeadMutation]
  )

  const createContact = useCallback(
    (data: Omit<Contact, 'id'>) => createContactMutation.mutate(data),
    [createContactMutation]
  )

  const createOrg = useCallback(
    (data: Omit<Organization, 'id'>) => createOrgMutation.mutate(data),
    [createOrgMutation]
  )

  const createActivity = useCallback(
    (data: Omit<Activity, 'id' | 'timestamp'>) => createActivityMutation.mutate(data),
    [createActivityMutation]
  )

  const createTask = useCallback(
    (data: Omit<Task, 'id' | 'completed'>) => createTaskMutation.mutate(data),
    [createTaskMutation]
  )

  const changeLeadStatus = useCallback(
    (leadId: string, newStatus: LeadStatus) =>
      changeLeadStatusMutation.mutate({ leadId, status: newStatus }),
    [changeLeadStatusMutation]
  )

  const toggleTaskStatus = useCallback(
    (taskId: string) => {
      const task = state.tasks.find(t => t.id === taskId)
      if (!task) return
      toggleTaskStatusMutation.mutate({ taskId, completed: !task.completed })
    },
    [state.tasks, toggleTaskStatusMutation]
  )

  const resetToSampleData = useCallback(
    () => resetToSampleDataMutation.mutate(),
    [resetToSampleDataMutation]
  )

  return (
    <CrmContext.Provider
      value={{
        state,
        isLoading,
        loadError,
        refetch,
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
