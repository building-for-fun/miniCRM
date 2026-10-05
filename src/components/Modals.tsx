'use client'

import { type FormEvent } from 'react'
import { useCrm } from '@/context/CrmContext'
import type { LeadStatus, Priority } from '@/lib/crm-data'

export type ModalId = 'addLeadModal' | 'addContactModal' | 'addOrgModal' | 'logActivityModal' | 'createTaskModal'

function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
}) {
  return (
    <div className="modal-backdrop show" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="icon-btn" onClick={onClose}>
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

function DependencyHint({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: 'var(--bg-subtle)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: '10px 12px',
        fontSize: 12,
        color: 'var(--text-muted)',
        lineHeight: 1.5,
      }}
    >
      {children}
    </div>
  )
}

const SEED_HINT = 'Load demo data from Settings → Reset to Demo Fixtures.'

function AddLeadModal({ onClose }: { onClose: () => void }) {
  const { state, createLead } = useCrm()

  const missing: string[] = []
  if (state.organizations.length === 0) missing.push('an organization')
  if (state.contacts.length === 0) missing.push('a contact')
  const canSubmit = missing.length === 0

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!canSubmit) return
    const fd = new FormData(e.currentTarget)
    createLead({
      title: fd.get('title') as string,
      organizationId: fd.get('organizationId') as string,
      contactId: fd.get('contactId') as string,
      source: fd.get('source') as string,
      status: fd.get('status') as LeadStatus,
      priority: fd.get('priority') as Priority,
      nextAction: (fd.get('nextAction') as string) || '',
      notes: (fd.get('notes') as string) || '',
    })
    onClose()
  }

  return (
    <ModalShell title="Add New Lead" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="modal-body">
          {!canSubmit && (
            <DependencyHint>
              Add {missing.join(' and ')} first before creating a lead. {SEED_HINT}
            </DependencyHint>
          )}
          <div className="form-group">
            <label className="form-label">Lead Title / Opportunity Name *</label>
            <input type="text" className="form-control" name="title" required placeholder="e.g. Enterprise Cloud Migration" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Organization *</label>
              <select className="form-control" name="organizationId" required>
                {state.organizations.map(o => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Contact Person *</label>
              <select className="form-control" name="contactId" required>
                {state.contacts.map(c => {
                  const org = state.organizations.find(o => o.id === c.organizationId)
                  return (
                    <option key={c.id} value={c.id}>
                      {c.name} ({org?.name})
                    </option>
                  )
                })}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Source</label>
              <select className="form-control" name="source">
                {['LinkedIn', 'Email', 'Referral', 'Website', 'Event', 'Manual', 'Other'].map(s => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-control" name="status">
                {['New', 'Contacted', 'Engaged', 'Qualified', 'Opportunity', 'Won', 'Lost'].map(s => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select className="form-control" name="priority" defaultValue="Medium">
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Next Action</label>
              <input type="text" className="form-control" name="nextAction" placeholder="e.g. Send technical whitepaper" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea className="form-control" name="notes" placeholder="Initial context or qualification notes..." />
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-default" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={!canSubmit}>
            Create Lead
          </button>
        </div>
      </form>
    </ModalShell>
  )
}

function AddContactModal({ onClose }: { onClose: () => void }) {
  const { state, createContact } = useCrm()
  const canSubmit = state.organizations.length > 0

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!canSubmit) return
    const fd = new FormData(e.currentTarget)
    createContact({
      name: fd.get('name') as string,
      organizationId: fd.get('organizationId') as string,
      role: (fd.get('role') as string) || '',
      email: fd.get('email') as string,
      phone: (fd.get('phone') as string) || '',
    })
    onClose()
  }

  return (
    <ModalShell title="Add Contact" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="modal-body">
          {!canSubmit && <DependencyHint>Add an organization first before adding a contact. {SEED_HINT}</DependencyHint>}
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input type="text" className="form-control" name="name" required placeholder="e.g. Maya Chen" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Organization *</label>
              <select className="form-control" name="organizationId" required>
                {state.organizations.map(o => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Job Title / Role</label>
              <input type="text" className="form-control" name="role" placeholder="e.g. VP of Operations" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input type="email" className="form-control" name="email" required placeholder="maya@company.com" />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input type="tel" className="form-control" name="phone" placeholder="+1 (555) 019-2834" />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-default" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={!canSubmit}>
            Save Contact
          </button>
        </div>
      </form>
    </ModalShell>
  )
}

function AddOrgModal({ onClose }: { onClose: () => void }) {
  const { createOrg } = useCrm()

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    createOrg({
      name: fd.get('name') as string,
      industry: (fd.get('industry') as string) || 'General',
      size: fd.get('size') as string,
      website: (fd.get('website') as string) || '#',
    })
    onClose()
  }

  return (
    <ModalShell title="Add Organization" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Organization Name *</label>
            <input type="text" className="form-control" name="name" required placeholder="e.g. Apex Dynamics" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Industry</label>
              <input type="text" className="form-control" name="industry" placeholder="e.g. FinTech / SaaS" />
            </div>
            <div className="form-group">
              <label className="form-label">Company Size</label>
              <select className="form-control" name="size" defaultValue="11-50">
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-1000">201-1000 employees</option>
                <option value="1000+">1000+ employees</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Website</label>
            <input type="text" className="form-control" name="website" placeholder="https://apexdynamics.io" />
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-default" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Create Organization
          </button>
        </div>
      </form>
    </ModalShell>
  )
}

function LogActivityModal({ onClose }: { onClose: () => void }) {
  const { state, createActivity } = useCrm()
  const canSubmit = state.leads.length > 0

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!canSubmit) return
    const fd = new FormData(e.currentTarget)
    const leadId = fd.get('leadId') as string
    const lead = state.leads.find(l => l.id === leadId)
    createActivity({
      leadId,
      contactId: lead?.contactId || state.contacts[0]?.id || '',
      organizationId: lead?.organizationId || state.organizations[0]?.id || '',
      channel: fd.get('channel') as string,
      description: fd.get('description') as string,
      outcome: (fd.get('outcome') as string) || '',
    })
    onClose()
  }

  return (
    <ModalShell title="Log Activity" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="modal-body">
          {!canSubmit && <DependencyHint>Add a lead first before logging an activity. {SEED_HINT}</DependencyHint>}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Channel *</label>
              <select className="form-control" name="channel">
                {['Email', 'Call', 'Meeting', 'LinkedIn', 'Note'].map(c => (
                  <option key={c} value={c}>
                    {c === 'Note' ? 'Internal Note' : c}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Related Lead *</label>
              <select className="form-control" name="leadId" required>
                {state.leads.map(l => (
                  <option key={l.id} value={l.id}>
                    {l.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Activity Summary *</label>
            <input
              type="text"
              className="form-control"
              name="description"
              required
              placeholder="e.g. Discovery demo call completed"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Outcome / Next Steps</label>
            <input
              type="text"
              className="form-control"
              name="outcome"
              placeholder="e.g. Decision maker requested pricing sheet"
            />
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-default" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={!canSubmit}>
            Log Activity
          </button>
        </div>
      </form>
    </ModalShell>
  )
}

function CreateTaskModal({ onClose }: { onClose: () => void }) {
  const { state, createTask } = useCrm()
  const canSubmit = state.leads.length > 0

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!canSubmit) return
    const fd = new FormData(e.currentTarget)
    const leadId = fd.get('leadId') as string
    const lead = state.leads.find(l => l.id === leadId)
    createTask({
      leadId,
      contactId: lead?.contactId || state.contacts[0]?.id || '',
      organizationId: lead?.organizationId || state.organizations[0]?.id || '',
      title: fd.get('title') as string,
      dueDate: fd.get('dueDate') as string,
      priority: fd.get('priority') as Priority,
    })
    onClose()
  }

  return (
    <ModalShell title="Create Task" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="modal-body">
          {!canSubmit && <DependencyHint>Add a lead first before creating a task. {SEED_HINT}</DependencyHint>}
          <div className="form-group">
            <label className="form-label">Task Title *</label>
            <input
              type="text"
              className="form-control"
              name="title"
              required
              placeholder="e.g. Prepare tailored proposal deck"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Related Lead *</label>
            <select className="form-control" name="leadId" required>
              {state.leads.map(l => (
                <option key={l.id} value={l.id}>
                  {l.title}
                </option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Due When</label>
              <select className="form-control" name="dueDate">
                {['Today', 'Tomorrow', 'In 2 days', 'Next week'].map(d => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select className="form-control" name="priority" defaultValue="Medium">
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-default" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={!canSubmit}>
            Save Task
          </button>
        </div>
      </form>
    </ModalShell>
  )
}

export function Modals({ activeModal, onClose }: { activeModal: ModalId | null; onClose: () => void }) {
  if (!activeModal) return null

  switch (activeModal) {
    case 'addLeadModal':
      return <AddLeadModal onClose={onClose} />
    case 'addContactModal':
      return <AddContactModal onClose={onClose} />
    case 'addOrgModal':
      return <AddOrgModal onClose={onClose} />
    case 'logActivityModal':
      return <LogActivityModal onClose={onClose} />
    case 'createTaskModal':
      return <CreateTaskModal onClose={onClose} />
    default:
      return null
  }
}
