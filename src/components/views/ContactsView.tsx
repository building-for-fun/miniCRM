'use client'

import { useCrm } from '@/context/CrmContext'
import { escapeHtml } from '@/lib/crm-data'
import type { ModalId } from '../Modals'

export default function ContactsView({ onOpenModal }: { onOpenModal: (id: ModalId) => void }) {
  const { state, getOrg } = useCrm()

  return (
    <>
      <div className="view-header">
        <div>
          <h1 className="view-title">Contacts</h1>
          <p className="view-subtitle">Directory of individuals linked across leads and organizations.</p>
        </div>
        <button className="btn btn-primary" onClick={() => onOpenModal('addContactModal')}>
          + Add Contact
        </button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role / Title</th>
              <th>Organization</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Active Leads</th>
            </tr>
          </thead>
          <tbody>
            {state.contacts.map(c => {
              const org = getOrg(c.organizationId)
              const leadCount = state.leads.filter(l => l.contactId === c.id).length
              return (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600 }}>{escapeHtml(c.name)}</td>
                  <td>{escapeHtml(c.role || '—')}</td>
                  <td>{escapeHtml(org.name)}</td>
                  <td>
                    <a href={`mailto:${c.email}`} style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>
                      {escapeHtml(c.email)}
                    </a>
                  </td>
                  <td>{escapeHtml(c.phone || '—')}</td>
                  <td>
                    <span className="badge badge-engaged">{leadCount} leads</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
