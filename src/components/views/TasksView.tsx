'use client'

import { useCrm } from '@/context/CrmContext'
import { escapeHtml } from '@/lib/crm-data'
import type { ModalId } from '../Modals'

export default function TasksView({ onOpenModal }: { onOpenModal: (id: ModalId) => void }) {
  const { state, currentTaskFilter, setCurrentTaskFilter, toggleTaskStatus, getOrg, getContact } = useCrm()

  let tasks = [...state.tasks]
  if (currentTaskFilter === 'OPEN') {
    tasks = tasks.filter(t => !t.completed)
  } else if (currentTaskFilter === 'COMPLETED') {
    tasks = tasks.filter(t => t.completed)
  }

  const tabs = [
    { key: 'OPEN', label: 'Pending Tasks' },
    { key: 'COMPLETED', label: 'Completed' },
    { key: 'ALL', label: 'All' },
  ] as const

  return (
    <>
      <div className="view-header">
        <div>
          <h1 className="view-title">Tasks</h1>
          <p className="view-subtitle">Action items and scheduled follow-ups.</p>
        </div>
        <button className="btn btn-primary" onClick={() => onOpenModal('createTaskModal')}>
          + Create Task
        </button>
      </div>

      <div className="filter-bar">
        <div className="tab-group">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`tab-btn${currentTaskFilter === tab.key ? ' active' : ''}`}
              onClick={() => setCurrentTaskFilter(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 12 }}>
        <div className="task-list">
          {tasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-title">No tasks found</div>
              <div className="empty-desc">Create a new task to keep track of key milestones.</div>
            </div>
          ) : (
            tasks.map(t => {
              const org = getOrg(t.organizationId)
              const contact = getContact(t.contactId)
              return (
                <div key={t.id} className={`task-item${t.completed ? ' completed' : ''}`}>
                  <input
                    type="checkbox"
                    className="task-checkbox"
                    checked={t.completed}
                    onChange={() => toggleTaskStatus(t.id)}
                  />
                  <div className="task-content">
                    <div className="task-title">{escapeHtml(t.title)}</div>
                    <div className="task-meta">
                      <span>Org: {escapeHtml(org.name)}</span>
                      <span>•</span>
                      <span>Contact: {escapeHtml(contact.name)}</span>
                      <span>•</span>
                      <span>Due: {t.dueDate}</span>
                      <span>•</span>
                      <span className="priority-indicator">
                        <span className={`priority-dot priority-${t.priority.toLowerCase()}`} />
                        {t.priority}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </>
  )
}
