'use client'

import { useState, useRef, useEffect } from 'react'
import { useCrm, type ExportedData } from '@/context/CrmContext'
import { escapeHtml } from '@/lib/crm-data'
import DashboardView from './views/DashboardView'
import LeadsView from './views/LeadsView'
import ContactsView from './views/ContactsView'
import OrganizationsView from './views/OrganizationsView'
import ActivitiesView from './views/ActivitiesView'
import TasksView from './views/TasksView'
import SettingsView from './views/SettingsView'
import LeadDrawer from './LeadDrawer'
import { Modals, type ModalId } from './Modals'

const NAV_ITEMS = [
  { section: 'Core' },
  { id: 'dashboard', label: 'Dashboard', icon: 'grid' },
  { id: 'leads', label: 'Leads', icon: 'star', badge: 'leads' },
  { id: 'contacts', label: 'Contacts', icon: 'users', badge: 'contacts' },
  { id: 'organizations', label: 'Organizations', icon: 'building' },
  { id: 'activities', label: 'Activities', icon: 'activity' },
  { id: 'tasks', label: 'Tasks', icon: 'check', badge: 'tasks' },
  { section: 'System' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
] as const

function NavIcon({ name }: { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </>
    ),
    star: (
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    ),
    users: (
      <>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    building: (
      <>
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
        <path d="M9 22v-4h6v4" />
        <path d="M8 6h.01" />
        <path d="M16 6h.01" />
        <path d="M8 10h.01" />
        <path d="M16 10h.01" />
        <path d="M8 14h.01" />
        <path d="M16 14h.01" />
      </>
    ),
    activity: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />,
    check: (
      <>
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </>
    ),
  }
  return (
    <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      {paths[name]}
    </svg>
  )
}

function Sidebar({ collapsed, mobileOpen, onToggleCollapse, onNavigate }: { collapsed: boolean; mobileOpen: boolean; onToggleCollapse: () => void; onNavigate: (v: string) => void }) {
  const { state, currentView } = useCrm()
  const openTasks = state.tasks.filter(t => !t.completed).length

  const badges: Record<string, number> = {
    leads: state.leads.length,
    contacts: state.contacts.length,
    tasks: openTasks,
  }

  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}${mobileOpen ? ' mobile-open' : ''}`} id="sidebar">
      <div className="sidebar-header">
        <a
          href="#"
          className="brand"
          onClick={e => {
            e.preventDefault()
            onNavigate('dashboard')
          }}
        >
          <div className="brand-icon">M</div>
          <span className="brand-name">Mini CRM</span>
        </a>
        <button className="sidebar-collapse-btn" title="Toggle Sidebar" onClick={onToggleCollapse}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {collapsed ? <polyline points="9 18 15 12 9 6" /> : <polyline points="15 18 9 12 15 6" />}
          </svg>
        </button>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item, i) => {
          if ('section' in item) {
            return (
              <div key={`section-${i}`} className="nav-label">
                {item.section}
              </div>
            )
          }
          return (
            <button
              key={item.id}
              className={`nav-item${currentView === item.id ? ' active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              <NavIcon name={item.icon} />
              <span>{item.label}</span>
              {'badge' in item && item.badge && <span className="nav-badge">{badges[item.badge]}</span>}
            </button>
          )
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="profile-pill">
          <div className="avatar-sm">JD</div>
          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            <div style={{ fontWeight: 600, fontSize: 12, color: 'var(--text-main)' }}>Alex Mercer</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Workspace Admin</div>
          </div>
        </div>
      </div>
    </aside>
  )
}

function GlobalSearch({ onNavigate }: { onNavigate: (v: string) => void }) {
  const { state, setCurrentActiveLeadId } = useCrm()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const q = query.toLowerCase().trim()
  const matchLeads = q ? state.leads.filter(l => l.title.toLowerCase().includes(q)).slice(0, 3) : []
  const matchContacts = q
    ? state.contacts.filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)).slice(0, 3)
    : []
  const matchOrgs = q
    ? state.organizations.filter(o => o.name.toLowerCase().includes(q) || (o.industry || '').toLowerCase().includes(q)).slice(0, 3)
    : []

  const hasResults = matchLeads.length > 0 || matchContacts.length > 0 || matchOrgs.length > 0

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function close() {
    setOpen(false)
    setQuery('')
  }

  return (
    <div className="global-search-container" ref={containerRef}>
      <svg className="search-icon-pos" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="text"
        className="search-input"
        placeholder="Search leads, contacts, organizations..."
        autoComplete="off"
        value={query}
        onChange={e => {
          setQuery(e.target.value)
          setOpen(true)
        }}
        onFocus={() => q && setOpen(true)}
      />
      {open && q && (
        <div className="search-results-panel" style={{ display: 'block' }}>
          {!hasResults && (
            <div style={{ padding: 10, fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
              No matching CRM entities found
            </div>
          )}
          {matchLeads.length > 0 && (
            <>
              <div className="search-category-title">Leads</div>
              {matchLeads.map(l => (
                <div
                  key={l.id}
                  className="search-result-item"
                  onClick={() => {
                    setCurrentActiveLeadId(l.id)
                    close()
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 500 }}>{escapeHtml(l.title)}</div>
                    <div className="search-result-meta">
                      {l.status} • {l.priority} Priority
                    </div>
                  </div>
                  <span className={`badge badge-${l.status.toLowerCase()}`}>{l.status}</span>
                </div>
              ))}
            </>
          )}
          {matchContacts.length > 0 && (
            <>
              <div className="search-category-title">Contacts</div>
              {matchContacts.map(c => (
                <div
                  key={c.id}
                  className="search-result-item"
                  onClick={() => {
                    onNavigate('contacts')
                    close()
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 500 }}>{escapeHtml(c.name)}</div>
                    <div className="search-result-meta">
                      {escapeHtml(c.role || 'Contact')} at {escapeHtml(state.organizations.find(o => o.id === c.organizationId)?.name || '')}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
          {matchOrgs.length > 0 && (
            <>
              <div className="search-category-title">Organizations</div>
              {matchOrgs.map(o => (
                <div
                  key={o.id}
                  className="search-result-item"
                  onClick={() => {
                    onNavigate('organizations')
                    close()
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 500 }}>{escapeHtml(o.name)}</div>
                    <div className="search-result-meta">{escapeHtml(o.industry)}</div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}

function Topbar({
  onNavigate,
  onOpenModal,
  onToggleMobile,
}: {
  onNavigate: (v: string) => void
  onOpenModal: (id: ModalId) => void
  onToggleMobile: () => void
}) {
  const { importData, resetToSampleData, showToast } = useCrm()
  const [addMenuOpen, setAddMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const handleImport = async (file: File) => {
    try {
      const text = await file.text()
      const data = JSON.parse(text) as ExportedData
      await importData(data)
      showToast('Data imported successfully')
    } catch (error) {
      showToast(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="icon-btn mobile-menu-trigger" style={{ display: undefined }} onClick={onToggleMobile}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <GlobalSearch onNavigate={onNavigate} />
      </div>

      <div className="topbar-right">
        <div className="dropdown">
          <button className="btn btn-primary" onClick={() => { setAddMenuOpen(v => !v); setUserMenuOpen(false) }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>+ Add</span>
          </button>
          {addMenuOpen && (
            <div className="dropdown-menu show">
              <button
                className="dropdown-item"
                onClick={() => {
                  onOpenModal('addLeadModal')
                  setAddMenuOpen(false)
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span>Add Lead</span>
              </button>
              <button
                className="dropdown-item"
                onClick={() => {
                  onOpenModal('addContactModal')
                  setAddMenuOpen(false)
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>Add Contact</span>
              </button>
              <button
                className="dropdown-item"
                onClick={() => {
                  onOpenModal('addOrgModal')
                  setAddMenuOpen(false)
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
                </svg>
                <span>Add Organization</span>
              </button>
              <div className="dropdown-divider" />
              <button
                className="dropdown-item"
                onClick={() => {
                  onOpenModal('logActivityModal')
                  setAddMenuOpen(false)
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
                <span>Log Activity</span>
              </button>
              <button
                className="dropdown-item"
                onClick={() => {
                  onOpenModal('createTaskModal')
                  setAddMenuOpen(false)
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
                <span>Create Task</span>
              </button>
            </div>
          )}
        </div>

        <button className="icon-btn" title="Notifications" onClick={() => showToast('No unread notifications')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>

        <div className="dropdown">
          <button className="icon-btn" onClick={() => { setUserMenuOpen(v => !v); setAddMenuOpen(false) }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
          {userMenuOpen && (
            <div className="dropdown-menu show">
              <div style={{ padding: '8px 10px', fontWeight: 600, fontSize: 12, color: 'var(--text-main)' }}>Alex Mercer</div>
              <div className="dropdown-divider" />
              <button
                className="dropdown-item"
                onClick={() => {
                  onNavigate('settings')
                  setUserMenuOpen(false)
                }}
              >
                Workspace Settings
              </button>
              <button
                className="dropdown-item"
                onClick={() => {
                  const input = document.createElement('input')
                  input.type = 'file'
                  input.accept = '.json'
                  input.onchange = e => {
                    const file = (e.target as HTMLInputElement).files[0]
                    if (file) handleImport(file)
                  }
                  input.click()
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>Import Data</span>
              </button>
              <div className="dropdown-divider" />
              <button
                className="dropdown-item"
                onClick={() => {
                  resetToSampleData()
                  setUserMenuOpen(false)
                }}
              >
                Reset Sample Data
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

function exportDataJson(state: unknown, showToast: (msg: string) => void) {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2))
  const downloadAnchor = document.createElement('a')
  downloadAnchor.setAttribute('href', dataStr)
  downloadAnchor.setAttribute('download', `mini_crm_export_${new Date().toISOString().slice(0, 10)}.json`)
  document.body.appendChild(downloadAnchor)
  downloadAnchor.click()
  downloadAnchor.remove()
  showToast('CRM export initiated')
}

export { exportDataJson }

export default function Dashboard() {
  const crm = useCrm()
  const { currentView, setCurrentView, state, toasts, isLoading, loadError, refetch } = crm
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeModal, setActiveModal] = useState<ModalId | null>(null)

  const navigate = (v: string) => {
    setCurrentView(v)
    setMobileOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openModal = (id: ModalId) => setActiveModal(id)
  const closeModal = () => setActiveModal(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        crm.setCurrentActiveLeadId(null)
        setActiveModal(null)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [crm])

  return (
    <div className="app-container">
      <Sidebar collapsed={collapsed} mobileOpen={mobileOpen} onToggleCollapse={() => setCollapsed(v => !v)} onNavigate={navigate} />

      <div className="main-wrapper">
        <Topbar onNavigate={navigate} onOpenModal={openModal} onToggleMobile={() => setMobileOpen(v => !v)} />

        <main className="content-area" id="mainContent">
          {isLoading && (
            <div className="empty-state" style={{ paddingTop: 80 }}>
              <div className="spinner" />
              <p className="empty-desc">Loading CRM data from the database…</p>
            </div>
          )}

          {!isLoading && loadError && (
            <div className="empty-state" style={{ paddingTop: 80 }}>
              <p className="empty-title">Could not load CRM data</p>
              <p className="empty-desc">{loadError}</p>
              <button className="btn btn-primary" onClick={refetch}>
                Retry
              </button>
            </div>
          )}

          {!isLoading && !loadError && (
            <>
              {currentView === 'dashboard' && (
                <DashboardView onNavigate={navigate} onOpenModal={openModal} />
              )}
              {currentView === 'leads' && <LeadsView onOpenModal={openModal} />}
              {currentView === 'contacts' && <ContactsView onOpenModal={openModal} />}
              {currentView === 'organizations' && <OrganizationsView onOpenModal={openModal} />}
              {currentView === 'activities' && <ActivitiesView onOpenModal={openModal} />}
              {currentView === 'tasks' && <TasksView onOpenModal={openModal} />}
              {currentView === 'settings' && <SettingsView />}
            </>
          )}
        </main>
      </div>

      <LeadDrawer />
      <Modals activeModal={activeModal} onClose={closeModal} />

      <div className="toast-container" id="toastContainer">
        {toasts.map(t => (
          <div key={t.id} className="toast">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
