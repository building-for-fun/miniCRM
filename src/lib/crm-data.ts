export type LeadStatus = 'New' | 'Contacted' | 'Engaged' | 'Qualified' | 'Opportunity' | 'Won' | 'Lost'
export type Priority = 'High' | 'Medium' | 'Low'

export interface Organization {
  id: string
  name: string
  industry?: string
  size?: string
  website?: string
}

export interface Contact {
  id: string
  organizationId: string
  name: string
  email: string
  phone?: string
  role?: string
}

export interface Lead {
  id: string
  title: string
  contactId: string
  organizationId: string
  status: LeadStatus
  source: string
  priority: Priority
  nextAction?: string
  createdAt: string
  notes?: string
}

export interface Activity {
  id: string
  leadId: string
  contactId: string
  organizationId: string
  channel: string
  description: string
  outcome?: string
  timestamp: string
}

export interface Task {
  id: string
  leadId: string
  contactId: string
  organizationId: string
  title: string
  dueDate: string
  priority: Priority
  completed: boolean
}

export interface CrmState {
  organizations: Organization[]
  contacts: Contact[]
  leads: Lead[]
  activities: Activity[]
  tasks: Task[]
}

export const STORAGE_KEY = 'MINI_CRM_PROTOTYPE_STATE_V1'

export const INITIAL_DATA: CrmState = {
  organizations: [
    { id: "org-1", name: "Acme Labs", industry: "Biotechnology", size: "51-200", website: "https://acmelabs.tech" },
    { id: "org-2", name: "Apex Dynamics", industry: "Robotics & Logistics", size: "201-1000", website: "https://apexdynamics.io" },
    { id: "org-3", name: "CloudScale Systems", industry: "Cloud Infrastructure", size: "51-200", website: "https://cloudscale.net" },
    { id: "org-4", name: "Horizon FinTech", industry: "Financial Services", size: "11-50", website: "https://horizonfin.com" },
    { id: "org-5", name: "Veritas Health", industry: "Healthcare IT", size: "1000+", website: "https://veritashealth.org" },
    { id: "org-6", name: "Starlight Retail", industry: "E-Commerce", size: "51-200", website: "https://starlight.store" },
    { id: "org-7", name: "Nexus Media", industry: "Digital Publishing", size: "11-50", website: "https://nexusmedia.agency" },
    { id: "org-8", name: "OmniCorp Global", industry: "Manufacturing", size: "1000+", website: "https://omnicorpglobal.com" },
    { id: "org-9", name: "BluePeak Security", industry: "Cybersecurity", size: "11-50", website: "https://bluepeaksec.com" },
    { id: "org-10", name: "GreenPulse Energy", industry: "Renewable Energy", size: "51-200", website: "https://greenpulse.eco" },
    { id: "org-11", name: "Kinetix Analytics", industry: "Business Intelligence", size: "11-50", website: "https://kinetixbi.io" }
  ],
  contacts: [
    { id: "cnt-1", organizationId: "org-1", name: "Rahul Sharma", email: "rahul.s@acmelabs.tech", phone: "+1 (555) 234-8901", role: "Head of Operations" },
    { id: "cnt-2", organizationId: "org-1", name: "Dr. Elena Rostova", email: "elena.r@acmelabs.tech", phone: "+1 (555) 234-8902", role: "Chief Science Officer" },
    { id: "cnt-3", organizationId: "org-2", name: "Marcus Vance", email: "m.vance@apexdynamics.io", phone: "+1 (555) 902-1144", role: "VP Engineering" },
    { id: "cnt-4", organizationId: "org-3", name: "Sarah Jenkins", email: "sjenkins@cloudscale.net", phone: "+1 (555) 441-2983", role: "Director of IT" },
    { id: "cnt-5", organizationId: "org-4", name: "Priya Mehta", email: "p.mehta@horizonfin.com", phone: "+1 (555) 872-3301", role: "Managing Director" },
    { id: "cnt-6", organizationId: "org-5", name: "David Kim", email: "dkim@veritashealth.org", phone: "+1 (555) 612-4490", role: "Chief Medical Officer" },
    { id: "cnt-7", organizationId: "org-6", name: "Chloe Dupont", email: "c.dupont@starlight.store", phone: "+1 (555) 789-0123", role: "Growth Lead" },
    { id: "cnt-8", organizationId: "org-7", name: "Devon Brooks", email: "devon@nexusmedia.agency", phone: "+1 (555) 321-4567", role: "Creative Director" },
    { id: "cnt-9", organizationId: "org-8", name: "Arthur Henderson", email: "a.henderson@omnicorpglobal.com", phone: "+1 (555) 654-7890", role: "Procurement Officer" },
    { id: "cnt-10", organizationId: "org-9", name: "Tara Lin", email: "tara.lin@bluepeaksec.com", phone: "+1 (555) 432-8765", role: "Security Architect" },
    { id: "cnt-11", organizationId: "org-10", name: "Siddharth Verma", email: "siddharth@greenpulse.eco", phone: "+1 (555) 876-5432", role: "Director of Projects" },
    { id: "cnt-12", organizationId: "org-11", name: "Kavita Rao", email: "kavita.rao@kinetixbi.io", phone: "+1 (555) 345-6789", role: "Product Manager" },
    { id: "cnt-13", organizationId: "org-2", name: "Jason Becker", email: "j.becker@apexdynamics.io", phone: "+1 (555) 781-9022", role: "Supply Chain Manager" },
    { id: "cnt-14", organizationId: "org-3", name: "Nadia O'Connor", email: "nadia@cloudscale.net", phone: "+1 (555) 662-8172", role: "DevOps Lead" },
    { id: "cnt-15", organizationId: "org-4", name: "Liam Gallagher", email: "lgallagher@horizonfin.com", phone: "+1 (555) 912-3847", role: "Compliance Analyst" },
    { id: "cnt-16", organizationId: "org-7", name: "Amara Woods", email: "amara@nexusmedia.agency", phone: "+1 (555) 543-9821", role: "Account Executive" }
  ],
  leads: [
    { id: "lead-1", title: "Enterprise Lab Automation Platform", contactId: "cnt-1", organizationId: "org-1", status: "Contacted", source: "LinkedIn", priority: "High", nextAction: "Follow up on sample specs", createdAt: "2026-10-01", notes: "Met at LifeTech Summit. Evaluating vendor replacements by Q4." },
    { id: "lead-2", title: "Autonomous Warehouse Telemetry", contactId: "cnt-3", organizationId: "org-2", status: "Qualified", source: "Referral", priority: "High", nextAction: "Deliver SLA security audit", createdAt: "2026-09-28", notes: "Marcus wants to standardize telemetry on our protocol across 4 fulfillment hubs." },
    { id: "lead-3", title: "Multi-Cloud Cost Governance Suite", contactId: "cnt-4", organizationId: "org-3", status: "Opportunity", source: "Website", priority: "High", nextAction: "Legal review of master contract", createdAt: "2026-09-15", notes: "Budget approved ($120k ARR). Procurement reviewing DPA." },
    { id: "lead-4", title: "Regulatory Data Sanitization Module", contactId: "cnt-5", organizationId: "org-4", status: "Engaged", source: "Referral", priority: "Medium", nextAction: "Schedule security discovery call", createdAt: "2026-10-02", notes: "Looking for SOC2-compliant client portals." },
    { id: "lead-5", title: "Patient Intake Workflow Automation", contactId: "cnt-6", organizationId: "org-5", status: "New", source: "Email", priority: "Medium", nextAction: "Send introductory product overview", createdAt: "2026-10-04", notes: "Inbound inquiry through whitepaper download." },
    { id: "lead-6", title: "Headless E-Commerce Integration", contactId: "cnt-7", organizationId: "org-6", status: "Engaged", source: "Website", priority: "Medium", nextAction: "Review API rate limit requirements", createdAt: "2026-09-29", notes: "Starlight is expanding into EU markets next month." },
    { id: "lead-7", title: "Omnichannel Asset Syndication", contactId: "cnt-8", organizationId: "org-7", status: "Won", source: "LinkedIn", priority: "Medium", nextAction: "Kickoff onboarding meeting", createdAt: "2026-09-10", notes: "Deal closed successfully on Oct 2nd." },
    { id: "lead-8", title: "Smart Factory Sensor Pipeline", contactId: "cnt-9", organizationId: "org-8", status: "Qualified", source: "Event", priority: "High", nextAction: "On-site architecture review", createdAt: "2026-09-20", notes: "Large scope: 12 production facilities worldwide." },
    { id: "lead-9", title: "Zero Trust Perimeter Pilot", contactId: "cnt-10", organizationId: "org-9", status: "Opportunity", source: "LinkedIn", priority: "High", nextAction: "Final pricing negotiation", createdAt: "2026-09-18", notes: "Pilot testing scored 9.4/10 with engineering group." },
    { id: "lead-10", title: "Grid Telemetry Modernization", contactId: "cnt-11", organizationId: "org-10", status: "Contacted", source: "Manual", priority: "Low", nextAction: "Re-engage after board meeting", createdAt: "2026-09-26", notes: "Budget cycles begin in November." },
    { id: "lead-11", title: "Cohort Retention Modeling Tool", contactId: "cnt-12", organizationId: "org-11", status: "New", source: "Website", priority: "Low", nextAction: "Qualify inbound request", createdAt: "2026-10-03", notes: "Signed up for product sandbox tier." },
    { id: "lead-12", title: "Cold Chain Real-time Monitoring", contactId: "cnt-2", organizationId: "org-1", status: "Lost", source: "Email", priority: "Low", nextAction: "Archive record", createdAt: "2026-08-30", notes: "Decided to build an internal in-house solution." },
    { id: "lead-13", title: "Logistics Fleet Routing API", contactId: "cnt-13", organizationId: "org-2", status: "Engaged", source: "Referral", priority: "Medium", nextAction: "Send trial credentials", createdAt: "2026-10-01", notes: "Testing performance in mid-west sector." },
    { id: "lead-14", title: "Kubernetes Observability Plug-in", contactId: "cnt-14", organizationId: "org-3", status: "Contacted", source: "Event", priority: "Medium", nextAction: "Schedule technical follow-up", createdAt: "2026-09-25", notes: "Met at KubeCon booth." },
    { id: "lead-15", title: "FinTech Transaction Encryption", contactId: "cnt-15", organizationId: "org-4", status: "Qualified", source: "LinkedIn", priority: "High", nextAction: "Prepare compliance checklist", createdAt: "2026-09-22", notes: "Auditors mandated hardware-level security module." },
    { id: "lead-16", title: "Creator Economy Ad Placement", contactId: "cnt-16", organizationId: "org-7", status: "New", source: "Website", priority: "Low", nextAction: "Send capability statement", createdAt: "2026-10-04", notes: "Inquiry received via web contact form." },
    { id: "lead-17", title: "Electronic Health Records Sync", contactId: "cnt-6", organizationId: "org-5", status: "Opportunity", source: "Manual", priority: "High", nextAction: "Executive sponsor review", createdAt: "2026-09-12", notes: "High priority HIPAA certified pipeline deal." },
    { id: "lead-18", title: "Store Inventory Prediction Engine", contactId: "cnt-7", organizationId: "org-6", status: "Lost", source: "Email", priority: "Low", nextAction: "Revisit in Q2 2027", createdAt: "2026-08-15", notes: "Company paused new software expenditures till year end." },
    { id: "lead-19", title: "Telemetry Edge Gateway", contactId: "cnt-11", organizationId: "org-10", status: "Won", source: "Referral", priority: "High", nextAction: "Deploy production licenses", createdAt: "2026-09-05", notes: "Annual agreement executed on Sept 28." },
    { id: "lead-20", title: "Threat Intelligence Feed Integration", contactId: "cnt-10", organizationId: "org-9", status: "Contacted", source: "LinkedIn", priority: "Medium", nextAction: "Share API swagger documentation", createdAt: "2026-10-02", notes: "Evaluating data accuracy against incumbent provider." }
  ],
  activities: [
    { id: "act-1", leadId: "lead-1", contactId: "cnt-1", organizationId: "org-1", channel: "LinkedIn", description: "Connection request sent and accepted", outcome: "Shared initial case study", timestamp: "2h ago" },
    { id: "act-2", leadId: "lead-1", contactId: "cnt-1", organizationId: "org-1", channel: "Email", description: "Follow-up email with technical specifications", outcome: "Awaiting review", timestamp: "3h ago" },
    { id: "act-3", leadId: "lead-2", contactId: "cnt-3", organizationId: "org-2", channel: "Meeting", description: "Architecture scoping session with engineering team", outcome: "Security audit requested", timestamp: "Yesterday" },
    { id: "act-4", leadId: "lead-3", contactId: "cnt-4", organizationId: "org-3", channel: "Email", description: "Contract draft sent for procurement review", outcome: "Legal reviewing terms", timestamp: "Yesterday" },
    { id: "act-5", leadId: "lead-4", contactId: "cnt-5", organizationId: "org-4", channel: "Call", description: "Introductory phone screen with Priya", outcome: "Agreed to follow-up call this week", timestamp: "2 days ago" },
    { id: "act-6", leadId: "lead-7", contactId: "cnt-8", organizationId: "org-7", channel: "Meeting", description: "Final contract signing session", outcome: "Won deal finalized", timestamp: "3 days ago" },
    { id: "act-7", leadId: "lead-9", contactId: "cnt-10", organizationId: "org-9", channel: "Meeting", description: "Pilot debrief call with InfoSec team", outcome: "Received 9.4/10 positive score", timestamp: "3 days ago" },
    { id: "act-8", leadId: "lead-8", contactId: "cnt-9", organizationId: "org-8", channel: "Call", description: "Pre-site visit alignment check", outcome: "Scheduled factory tour", timestamp: "4 days ago" },
    { id: "act-9", leadId: "lead-13", contactId: "cnt-13", organizationId: "org-2", channel: "Email", description: "Sandbox access provisioning notice", outcome: "Credentials delivered", timestamp: "4 days ago" },
    { id: "act-10", leadId: "lead-15", contactId: "cnt-15", organizationId: "org-4", channel: "Meeting", description: "Compliance review call", outcome: "Detailed SOC2 matrix provided", timestamp: "5 days ago" },
    { id: "act-11", leadId: "lead-6", contactId: "cnt-7", organizationId: "org-6", channel: "LinkedIn", description: "Discussed international headless rollout", outcome: "Shared API docs", timestamp: "5 days ago" },
    { id: "act-12", leadId: "lead-19", contactId: "cnt-11", organizationId: "org-10", channel: "Meeting", description: "Purchase order countersigned", outcome: "Deal closed - Won", timestamp: "6 days ago" },
    { id: "act-13", leadId: "lead-5", contactId: "cnt-6", organizationId: "org-5", channel: "Email", description: "Inbound whitepaper auto-acknowledgement", outcome: "Product brief delivered", timestamp: "1 day ago" },
    { id: "act-14", leadId: "lead-20", contactId: "cnt-10", organizationId: "org-9", channel: "Call", description: "Brief benchmark review", outcome: "Agreed to review technical feed", timestamp: "2 days ago" },
    { id: "act-15", leadId: "lead-2", contactId: "cnt-3", organizationId: "org-2", channel: "Note", description: "Noted that Marcus prefers Slack integration for notifications", outcome: "Updated client preferences", timestamp: "1 day ago" },
    { id: "act-16", leadId: "lead-14", contactId: "cnt-14", organizationId: "org-3", channel: "Email", description: "Sent conference recap & demo link", outcome: "No response yet", timestamp: "3 days ago" },
    { id: "act-17", leadId: "lead-10", contactId: "cnt-11", organizationId: "org-10", channel: "Call", description: "Checked Q4 project timeline status", outcome: "Board review pending", timestamp: "1 week ago" },
    { id: "act-18", leadId: "lead-11", contactId: "cnt-12", organizationId: "org-11", channel: "Note", description: "Automated sign-up alert received", outcome: "Assigned for manual triage", timestamp: "2 days ago" },
    { id: "act-19", leadId: "lead-16", contactId: "cnt-16", organizationId: "org-7", channel: "Email", description: "Inbound contact form confirmation", outcome: "Awaiting availability", timestamp: "1 day ago" },
    { id: "act-20", leadId: "lead-17", contactId: "cnt-6", organizationId: "org-5", channel: "Meeting", description: "Healthcare security advisory board session", outcome: "Positive endorsement received", timestamp: "4 days ago" }
  ],
  tasks: [
    { id: "tsk-1", leadId: "lead-1", contactId: "cnt-1", organizationId: "org-1", title: "Follow up with Rahul Sharma on technical specs", dueDate: "Today", priority: "High", completed: false },
    { id: "tsk-2", leadId: "lead-4", contactId: "cnt-5", organizationId: "org-4", title: "Send introduction email & security questionnaire", dueDate: "Today", priority: "Medium", completed: false },
    { id: "tsk-3", leadId: "lead-2", contactId: "cnt-3", organizationId: "org-2", title: "Schedule discovery call with engineering leadership", dueDate: "Tomorrow", priority: "High", completed: false },
    { id: "tsk-4", leadId: "lead-3", contactId: "cnt-4", organizationId: "org-3", title: "Review Master Services Agreement redlines", dueDate: "Tomorrow", priority: "High", completed: false },
    { id: "tsk-5", leadId: "lead-6", contactId: "cnt-7", organizationId: "org-6", title: "Prepare API load benchmark report", dueDate: "In 2 days", priority: "Medium", completed: false },
    { id: "tsk-6", leadId: "lead-8", contactId: "cnt-9", organizationId: "org-8", title: "Confirm factory visit travel itinerary", dueDate: "In 2 days", priority: "High", completed: false },
    { id: "tsk-7", leadId: "lead-15", contactId: "cnt-15", organizationId: "org-4", title: "Send encrypted file share link", dueDate: "Today", priority: "Medium", completed: true },
    { id: "tsk-8", leadId: "lead-17", contactId: "cnt-6", organizationId: "org-5", title: "Draft executive presentation deck", dueDate: "Next week", priority: "Medium", completed: false },
    { id: "tsk-9", leadId: "lead-20", contactId: "cnt-10", organizationId: "org-9", title: "Generate sandbox threat API keys", dueDate: "Today", priority: "Low", completed: false },
    { id: "tsk-10", leadId: "lead-7", contactId: "cnt-8", organizationId: "org-7", title: "Submit signed paperwork to finance", dueDate: "Yesterday", priority: "High", completed: true }
  ]
}

export function escapeHtml(str?: string | null): string {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
