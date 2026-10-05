'use client'

import { useState } from 'react'
import { useCrm } from '@/context/CrmContext'
import { escapeHtml, type LeadStatus } from '@/lib/crm-data'

const STATUSES: LeadStatus[] = ['New', 'Contacted', 'Engaged', 'Qualified', 'Opportunity', 'Won', 'Lost']

export default function LeadDrawer() {
  const {
    state,
    currentActiveLeadId,
    setCurrentActiveLeadId,
    getOrg,
    getContact,
    changeLeadStatus,
    createActivity,
    createTask,
  } = useCrm()

  const [statusMenuOpen, setStatusMenuOpen] = useState(false)
  const lead = currentActiveLeadId ? state.leads.find(l => l.id === currentActiveLeadId) : null

  if (!lead) return null

  const org = getOrg(lead.organizationId)
  const contact = getContact(lead.contactId)
  const leadActivities = state.activities.filter(a => a.leadId === lead.id)

  const close = () => setCurrentActiveLeadId(null)

  return (
    <>
      <div className="drawer-overlay active" onClick={close} />
      <aside className="drawer active">
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="section-title">{lead.title}</span>
            <span className={`badge badge-${lead.status.toLowerCase()}`}>{lead.status}</span>
          </div>
          <button className="icon-btn" onClick={close}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="drawer-body">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <div className="dropdown">
              <button
                className="btn btn-default btn-sm"
                onClick={e => {
                  e.stopPropagation()
                  setStatusMenuOpen(v => !v)
                }}
              >
                <span>Change Stage ▾</span>
              </button>
              {statusMenuOpen && (
                <div className="dropdown-menu show">
                  {STATUSES.map(s => (
                    <button
                      key={s}
                      className="dropdown-item"
                      onClick={() => {
                        changeLeadStatus(lead.id, s)
                        setStatusMenuOpen(false)
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              className="btn btn-default btn-sm"
              onClick={() => {
                createActivity({
                  leadId: lead.id,
                  contactId: lead.contactId,
                  organizationId: lead.organizationId,
                  channel: 'Note',
                  description: 'Manual activity note added from lead drawer',
                  outcome: '',
                })
              }}
            >
              + Add Activity
            </button>
            <button
              className="btn btn-default btn-sm"
              onClick={() => {
                createTask({
                  leadId: lead.id,
                  contactId: lead.contactId,
                  organizationId: lead.organizationId,
                  title: `Follow up: ${lead.title}`,
                  dueDate: 'Today',
                  priority: 'Medium',
                })
              }}
            >
              + Create Task
            </button>
          </div>

          <div className="property-grid">
            <div className="property-label">Organization</div>
            <div className="property-val">{escapeHtml(org.name)}</div>

            <div className="property-label">Primary Contact</div>
            <div className="property-val">{escapeHtml(contact.name)}</div>

            <div className="property-label">Email</div>
            <div className="property-val">{escapeHtml(contact.email)}</div>

            <div className="property-label">Phone</div>
            <div className="property-val">{escapeHtml(contact.phone || '—')}</div>

            <div className="property-label">Source</div>
            <div className="property-val">{escapeHtml(lead.source)}</div>

            <div className="property-label">Priority</div>
            <div className="property-val">
              <span className="priority-indicator">
                <span className={`priority-dot priority-${lead.priority.toLowerCase()}`} />
                {lead.priority}
              </span>
            </div>

            <div className="property-label">Next Action</div>
            <div className="property-val" style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>
              {escapeHtml(lead.nextAction || 'None specified')}
            </div>
          </div>

          <div>
            <div className="section-title" style={{ marginBottom: 6, fontSize: 12 }}>
              Notes / Context
            </div>
            <div
              style={{
                fontSize: 12.5,
                color: 'var(--text-muted)',
                background: 'var(--bg-subtle)',
                padding: 10,
                borderRadius: 'var(--radius-md)',
                whiteSpace: 'pre-wrap',
              }}
            >
              {lead.notes || 'No notes added.'}
            </div>
          </div>

          <div>
            <div className="section-title" style={{ marginBottom: 12, fontSize: 12.5 }}>
              Activity History
            </div>
            <div className="timeline">
              {leadActivities.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                  No activity logged yet for this lead.
                </div>
              ) : (
                leadActivities.map(act => (
                  <div key={act.id} className="timeline-item">
                    <div className="timeline-dot" />
                    <div className="timeline-text">
                      <strong>{escapeHtml(act.channel)}:</strong> {escapeHtml(act.description)}
                      {act.outcome && (
                        <div style={{ color: 'var(--text-muted)', fontSize: 11, marginTop: 2 }}>
                          Outcome: {escapeHtml(act.outcome)}
                        </div>
                      )}
                    </div>
                    <div className="timeline-meta">{act.timestamp}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="drawer-footer">
          <button className="btn btn-default btn-sm" onClick={close}>
            Close
          </button>
        </div>
      </aside>
    </>
  )
}
