'use client'

import { useCrm } from '@/context/CrmContext'
import { escapeHtml } from '@/lib/crm-data'
import type { ModalId } from '../Modals'

export default function ActivitiesView({ onOpenModal }: { onOpenModal: (id: ModalId) => void }) {
  const { state, getLead, getContact, setCurrentActiveLeadId } = useCrm()

  return (
    <>
      <div className="view-header">
        <div>
          <h1 className="view-title">Activities</h1>
          <p className="view-subtitle">Audit log of all calls, emails, notes, meetings, and channel interactions.</p>
        </div>
        <button className="btn btn-primary" onClick={() => onOpenModal('logActivityModal')}>
          + Log Activity
        </button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Channel / Type</th>
              <th>Summary / Description</th>
              <th>Related Lead</th>
              <th>Contact</th>
              <th>Outcome</th>
            </tr>
          </thead>
          <tbody>
            {state.activities.map(a => {
              const lead = getLead(a.leadId) || { title: 'General' }
              const contact = getContact(a.contactId)
              return (
                <tr key={a.id}>
                  <td style={{ color: 'var(--text-muted)', fontSize: 11.5 }}>{a.timestamp}</td>
                  <td>
                    <span className="badge badge-new">{escapeHtml(a.channel)}</span>
                  </td>
                  <td style={{ fontWeight: 500 }}>{escapeHtml(a.description)}</td>
                  <td
                    style={{ color: 'var(--accent-primary)', cursor: 'pointer' }}
                    onClick={() => setCurrentActiveLeadId(a.leadId)}
                  >
                    {escapeHtml(lead.title)}
                  </td>
                  <td>{escapeHtml(contact.name)}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{escapeHtml(a.outcome || '—')}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
