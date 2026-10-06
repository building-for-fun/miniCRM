'use client'

import { useCrm } from '@/context/CrmContext'
import { escapeHtml } from '@/lib/crm-data'
import type { ModalId } from '../Modals'

function KPICards({ onNavigate }: { onNavigate: (v: string) => void }) {
  const { state, currentLeadStageFilter, setCurrentLeadStageFilter } = useCrm()
  const totalLeads = state.leads.length
  const activeLeads = state.leads.filter(l => l.status !== 'Won' && l.status !== 'Lost').length
  const contactsCount = state.contacts.length
  const orgsCount = state.organizations.length
  const openTasksCount = state.tasks.filter(t => !t.completed).length

  return (
    <div className="kpi-grid">
      <div className="kpi-card" style={{ cursor: 'pointer' }} onClick={() => onNavigate('leads')}>
        <div className="kpi-header">
          <span>Total Leads</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>
        <div className="kpi-value">{totalLeads}</div>
        {totalLeads > 0 && <div className="kpi-comparison">+14% this month</div>}
      </div>

      <div
        className="kpi-card"
        style={{ cursor: 'pointer' }}
        onClick={() => setCurrentLeadStageFilter(currentLeadStageFilter === 'ACTIVE' ? 'ALL' : 'ACTIVE')}
      >
        <div className="kpi-header">
          <span>Active Leads</span>
          <span className="badge badge-engaged">In Progress</span>
        </div>
        <div className="kpi-value">{activeLeads}</div>
        {activeLeads > 0 && <div className="kpi-comparison">+8% vs last week</div>}
      </div>

      <div className="kpi-card" style={{ cursor: 'pointer' }} onClick={() => onNavigate('contacts')}>
        <div className="kpi-header">
          <span>Contacts</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <div className="kpi-value">{contactsCount}</div>
        {contactsCount > 0 && <div className="kpi-comparison neutral">+5 added recently</div>}
      </div>

      <div className="kpi-card" style={{ cursor: 'pointer' }} onClick={() => onNavigate('organizations')}>
        <div className="kpi-header">
          <span>Organizations</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
          </svg>
        </div>
        <div className="kpi-value">{orgsCount}</div>
        {orgsCount > 0 && <div className="kpi-comparison neutral">Enterprise &amp; Mid-tier</div>}
      </div>

      <div className="kpi-card" style={{ cursor: 'pointer' }} onClick={() => onNavigate('tasks')}>
        <div className="kpi-header">
          <span>Open Tasks</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 11l3 3L22 4" />
          </svg>
        </div>
        <div className="kpi-value">{openTasksCount}</div>
        {openTasksCount > 0 && (
          <div className={`kpi-comparison ${openTasksCount > 5 ? 'neutral' : ''}`}>Due this week</div>
        )}
      </div>
    </div>
  )
}

function PipelineBar() {
  const { state, currentLeadStageFilter, setCurrentLeadStageFilter } = useCrm()
  const stages = ['New', 'Contacted', 'Engaged', 'Qualified', 'Opportunity', 'Won']
  const counts: Record<string, number> = {}
  stages.forEach(s => (counts[s] = 0))
  let lostCount = 0

  state.leads.forEach(l => {
    if (l.status in counts) counts[l.status]++
    if (l.status === 'Lost') lostCount++
  })

  const toggleStage = (stage: string) => {
    setCurrentLeadStageFilter(currentLeadStageFilter === stage ? 'ALL' : stage)
  }

  return (
    <div className="pipeline-section">
      <div className="pipeline-header">
        <div className="section-title">Lead Pipeline</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          {currentLeadStageFilter === 'ALL'
            ? 'All active pipeline stages'
            : currentLeadStageFilter === 'ACTIVE'
              ? 'Filtering: Active stages'
              : `Filtering by stage: ${currentLeadStageFilter} (Click again to clear)`}
        </div>
      </div>
      <div className="pipeline-bar-wrapper">
        {stages.map(stage => (
          <div
            key={stage}
            className={`pipeline-step${currentLeadStageFilter === stage ? ' active' : ''}`}
            onClick={() => toggleStage(stage)}
          >
            <div className="pipeline-step-top">
              <span className="step-name">{stage}</span>
            </div>
            <div className="step-count">{counts[stage]}</div>
            <div className="step-indicator" style={{ backgroundColor: `var(--status-${stage.toLowerCase()})` }} />
          </div>
        ))}
        <div
          className={`pipeline-step step-lost${currentLeadStageFilter === 'Lost' ? ' active' : ''}`}
          onClick={() => toggleStage('Lost')}
        >
          <div className="pipeline-step-top">
            <span className="step-name" style={{ color: 'var(--status-lost)' }}>
              Lost
            </span>
          </div>
          <div className="step-count">{lostCount}</div>
          <div className="step-indicator" style={{ backgroundColor: 'var(--status-lost)' }} />
        </div>
      </div>
    </div>
  )
}

function DashboardTasks({ onOpenModal }: { onOpenModal: (id: ModalId) => void }) {
  const { state, toggleTaskStatus, getOrg } = useCrm()
  const tasks = state.tasks.slice(0, 5)

  return (
    <div className="card">
      <div className="card-header">
        <span className="section-title">Today&apos;s Tasks</span>
        <button className="btn btn-default btn-sm" onClick={() => onOpenModal('createTaskModal')}>
          + New Task
        </button>
      </div>
      <div className="card-body">
        <div className="task-list">
          {tasks.length === 0 ? (
            <div className="empty-state" style={{ padding: 20 }}>
              <div className="empty-title">{state.tasks.length === 0 ? 'No tasks yet' : 'All tasks completed!'}</div>
              <div className="empty-desc">
                {state.tasks.length === 0
                  ? 'Create a task to organize your next follow-up, or load demo data from Settings.'
                  : 'Create a new task to organize your next follow-up.'}
              </div>
            </div>
          ) : (
            tasks.map(task => {
              const org = getOrg(task.organizationId)
              return (
                <div key={task.id} className={`task-item${task.completed ? ' completed' : ''}`}>
                  <input
                    type="checkbox"
                    className="task-checkbox"
                    checked={task.completed}
                    onChange={() => toggleTaskStatus(task.id)}
                  />
                  <div className="task-content">
                    <div className="task-title">{escapeHtml(task.title)}</div>
                    <div className="task-meta">
                      <span>{escapeHtml(org.name)}</span>
                      <span>•</span>
                      <span>{task.dueDate}</span>
                      <span>•</span>
                      <span className="priority-indicator">
                        <span className={`priority-dot priority-${task.priority.toLowerCase()}`} />
                        {task.priority}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

function DashboardActivities({ onOpenModal }: { onOpenModal: (id: ModalId) => void }) {
  const { state, getOrg, getContact } = useCrm()
  const recent = state.activities.slice(0, 6)

  return (
    <div className="card">
      <div className="card-header">
        <span className="section-title">Recent Activity</span>
        <button className="btn btn-default btn-sm" onClick={() => onOpenModal('logActivityModal')}>
          + Log Activity
        </button>
      </div>
      <div className="card-body">
        <div className="timeline">
          {recent.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', padding: '10px 0' }}>No activities logged yet.</div>
          ) : (
            recent.map(act => {
              const org = getOrg(act.organizationId)
              const contact = getContact(act.contactId)
              return (
                <div key={act.id} className="timeline-item">
                  <div className="timeline-dot" />
                  <div className="timeline-text">
                    <strong>{escapeHtml(act.channel)}:</strong> {escapeHtml(act.description)}
                  </div>
                  <div className="timeline-meta">
                    <span>
                      {escapeHtml(contact.name)} ({escapeHtml(org.name)})
                    </span>
                    <span> • {act.timestamp}</span>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

function RecentLeadsTable() {
  const { state, currentLeadStageFilter, getOrg, getContact, setCurrentActiveLeadId } = useCrm()

  let filtered = [...state.leads]
  if (currentLeadStageFilter === 'ACTIVE') {
    filtered = filtered.filter(l => l.status !== 'Won' && l.status !== 'Lost')
  } else if (currentLeadStageFilter !== 'ALL') {
    filtered = filtered.filter(l => l.status === currentLeadStageFilter)
  }

  const feedback =
    currentLeadStageFilter === 'ACTIVE'
      ? '(Active Leads)'
      : currentLeadStageFilter !== 'ALL'
        ? `(Stage: ${currentLeadStageFilter})`
        : ''

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <span className="section-title">Recent Leads</span>
          <span style={{ fontSize: 11.5, color: 'var(--text-muted)', marginLeft: 8 }}>{feedback}</span>
        </div>
        <button className="btn btn-default btn-sm" onClick={() => {}}>
          View All Leads →
        </button>
      </div>
      <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
        <table className="table">
          <thead>
            <tr>
              <th>Lead</th>
              <th>Organization</th>
              <th>Status</th>
              <th>Source</th>
              <th>Last Activity</th>
              <th>Next Action</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className="empty-state">
                    <div className="empty-title">{state.leads.length === 0 ? 'No leads yet' : 'No leads in this stage'}</div>
                    <div className="empty-desc">
                      {state.leads.length === 0
                        ? 'Add your first lead, or load demo data from Settings → Reset to Demo Fixtures.'
                        : 'Adjust the pipeline filter above or add a new prospect.'}
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.slice(0, 8).map(lead => {
                const org = getOrg(lead.organizationId)
                const contact = getContact(lead.contactId)
                const lastAct = state.activities.find(a => a.leadId === lead.id) || { timestamp: 'Recently' }
                return (
                  <tr key={lead.id} onClick={() => setCurrentActiveLeadId(lead.id)}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{escapeHtml(lead.title)}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{escapeHtml(contact.name)}</div>
                    </td>
                    <td>{escapeHtml(org.name)}</td>
                    <td>
                      <span className={`badge badge-${lead.status.toLowerCase()}`}>{lead.status}</span>
                    </td>
                    <td>{escapeHtml(lead.source)}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{lastAct.timestamp}</td>
                    <td style={{ fontWeight: 500 }}>{escapeHtml(lead.nextAction || '—')}</td>
                    <td>
                      <span className="priority-indicator">
                        <span className={`priority-dot priority-${lead.priority.toLowerCase()}`} />
                        {lead.priority}
                      </span>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function DashboardView({
  onNavigate,
  onOpenModal,
}: {
  onNavigate: (v: string) => void
  onOpenModal: (id: ModalId) => void
}) {
  const crm = useCrm()
  return (
    <>
      <div className="view-header">
        <div>
          <h1 className="view-title">Dashboard</h1>
          <p className="view-subtitle">High-level overview of current pipeline and immediate actions.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-default btn-sm" onClick={crm.exportData}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Export JSON</span>
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => onOpenModal('addLeadModal')}>
            + Add Lead
          </button>
        </div>
      </div>

      <KPICards onNavigate={onNavigate} />
      <PipelineBar />

      <div className="dashboard-two-col">
        <DashboardTasks onOpenModal={onOpenModal} />
        <DashboardActivities onOpenModal={onOpenModal} />
      </div>

      <RecentLeadsTable />
    </>
  )
}
