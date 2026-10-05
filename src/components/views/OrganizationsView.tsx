'use client'

import { useCrm } from '@/context/CrmContext'
import { escapeHtml } from '@/lib/crm-data'
import type { ModalId } from '../Modals'

export default function OrganizationsView({ onOpenModal }: { onOpenModal: (id: ModalId) => void }) {
  const { state } = useCrm()

  return (
    <>
      <div className="view-header">
        <div>
          <h1 className="view-title">Organizations</h1>
          <p className="view-subtitle">Companies and institutional accounts.</p>
        </div>
        <button className="btn btn-primary" onClick={() => onOpenModal('addOrgModal')}>
          + Add Organization
        </button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Organization Name</th>
              <th>Industry</th>
              <th>Size</th>
              <th>Website</th>
              <th>Associated Contacts</th>
              <th>Active Leads</th>
            </tr>
          </thead>
          <tbody>
            {state.organizations.map(o => {
              const contactCount = state.contacts.filter(c => c.organizationId === o.id).length
              const leadCount = state.leads.filter(l => l.organizationId === o.id).length
              return (
                <tr key={o.id}>
                  <td style={{ fontWeight: 600 }}>{escapeHtml(o.name)}</td>
                  <td>{escapeHtml(o.industry || '—')}</td>
                  <td>{escapeHtml(o.size || '—')}</td>
                  <td>
                    <a
                      href={o.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}
                    >
                      {escapeHtml(o.website)}
                    </a>
                  </td>
                  <td>{contactCount} contacts</td>
                  <td>
                    <span className="badge badge-qualified">{leadCount} leads</span>
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
