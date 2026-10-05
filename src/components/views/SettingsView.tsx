'use client'

import { useCrm } from '@/context/CrmContext'

export default function SettingsView({ onExport }: { onExport: () => void }) {
  const { resetToSampleData } = useCrm()

  return (
    <>
      <div className="view-header">
        <div>
          <h1 className="view-title">Workspace Settings</h1>
          <p className="view-subtitle">Prototype configurations, data model controls, and demo state reset.</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 640, marginTop: 10 }}>
        <div className="card-header">
          <span className="section-title">Data Storage &amp; Prototype Controls</span>
        </div>
        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{ color: 'var(--text-muted)', fontSize: 12.5 }}>
            This Mini CRM dashboard is backed by a relational database and served through the app&apos;s API. Changes
            to leads, tasks, and activities are written to the database and persist across sessions.
          </p>

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-default" onClick={onExport}>
              Export CRM State (JSON)
            </button>
            <button className="btn btn-default" style={{ color: 'var(--status-lost)' }} onClick={resetToSampleData}>
              Reset to Demo Fixtures
            </button>
          </div>

          <div style={{ background: 'var(--bg-subtle)', padding: 12, borderRadius: 'var(--radius-md)', fontSize: 12 }}>
            <strong>Entity Relationships:</strong>
            <ul style={{ marginLeft: 18, marginTop: 6, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              <li>
                <code>leads[]</code> reference <code>contactId</code> &amp; <code>organizationId</code>
              </li>
              <li>
                <code>activities[]</code> reference <code>leadId</code>, <code>contactId</code> &amp;{' '}
                <code>organizationId</code>
              </li>
              <li>
                <code>tasks[]</code> reference <code>leadId</code>, <code>contactId</code> &amp;{' '}
                <code>organizationId</code>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
