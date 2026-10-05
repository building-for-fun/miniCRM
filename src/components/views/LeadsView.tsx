'use client'

import { useState } from 'react'
import { useCrm } from '@/context/CrmContext'
import { escapeHtml } from '@/lib/crm-data'
import type { ModalId } from '../Modals'

const STAGES = ['ALL', 'New', 'Contacted', 'Engaged', 'Qualified', 'Opportunity', 'Won', 'Lost'] as const

export default function LeadsView({ onOpenModal }: { onOpenModal: (id: ModalId) => void }) {
  const { state, getOrg, getContact, setCurrentActiveLeadId } = useCrm()
  const [activeStage, setActiveStage] = useState<string>('ALL')
  const [search, setSearch] = useState('')

  const searchVal = search.toLowerCase().trim()
  let list = [...state.leads]
  if (activeStage !== 'ALL') {
    list = list.filter(l => l.status === activeStage)
  }
  if (searchVal) {
    list = list.filter(l => {
      const org = getOrg(l.organizationId)
      const cnt = getContact(l.contactId)
      return (
        l.title.toLowerCase().includes(searchVal) ||
        org.name.toLowerCase().includes(searchVal) ||
        cnt.name.toLowerCase().includes(searchVal)
      )
    })
  }

  return (
    <>
      <div className="view-header">
        <div>
          <h1 className="view-title">Leads</h1>
          <p className="view-subtitle">Manage prospect pipeline, qualification stages, and next actions.</p>
        </div>
        <button className="btn btn-primary" onClick={() => onOpenModal('addLeadModal')}>
          + Add Lead
        </button>
      </div>

      <div className="filter-bar">
        <div className="tab-group">
          {STAGES.map(stage => (
            <button
              key={stage}
              className={`tab-btn${activeStage === stage ? ' active' : ''}`}
              onClick={() => setActiveStage(stage)}
            >
              {stage === 'ALL' ? 'All Leads' : stage}
            </button>
          ))}
        </div>
        <input
          type="text"
          className="search-input"
          style={{ maxWidth: 240, paddingLeft: 12 }}
          placeholder="Filter current list..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Lead Title / Name</th>
              <th>Contact</th>
              <th>Organization</th>
              <th>Status</th>
              <th>Source</th>
              <th>Next Action</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className="empty-state">
                    <div className="empty-title">No leads found</div>
                    <div className="empty-desc">Try clearing your filters or create a new lead.</div>
                  </div>
                </td>
              </tr>
            ) : (
              list.map(l => {
                const org = getOrg(l.organizationId)
                const contact = getContact(l.contactId)
                return (
                  <tr key={l.id} onClick={() => setCurrentActiveLeadId(l.id)}>
                    <td style={{ fontWeight: 600 }}>{escapeHtml(l.title)}</td>
                    <td>{escapeHtml(contact.name)}</td>
                    <td>{escapeHtml(org.name)}</td>
                    <td>
                      <span className={`badge badge-${l.status.toLowerCase()}`}>{l.status}</span>
                    </td>
                    <td>{escapeHtml(l.source)}</td>
                    <td>{escapeHtml(l.nextAction || '—')}</td>
                    <td>
                      <span className="priority-indicator">
                        <span className={`priority-dot priority-${l.priority.toLowerCase()}`} />
                        {l.priority}
                      </span>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
