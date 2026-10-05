import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const organizations = [
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
]

const contacts = [
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
]

const leads = [
  { id: "lead-1", title: "Enterprise Lab Automation Platform", contactId: "cnt-1", organizationId: "org-1", status: "CONTACTED", source: "LinkedIn", priority: "HIGH", nextAction: "Follow up on sample specs", createdAt: new Date("2026-10-01"), notes: "Met at LifeTech Summit. Evaluating vendor replacements by Q4." },
  { id: "lead-2", title: "Autonomous Warehouse Telemetry", contactId: "cnt-3", organizationId: "org-2", status: "QUALIFIED", source: "Referral", priority: "HIGH", nextAction: "Deliver SLA security audit", createdAt: new Date("2026-09-28"), notes: "Marcus wants to standardize telemetry on our protocol across 4 fulfillment hubs." },
  { id: "lead-3", title: "Multi-Cloud Cost Governance Suite", contactId: "cnt-4", organizationId: "org-3", status: "OPPORTUNITY", source: "Website", priority: "HIGH", nextAction: "Legal review of master contract", createdAt: new Date("2026-09-15"), notes: "Budget approved ($120k ARR). Procurement reviewing DPA." },
  { id: "lead-4", title: "Regulatory Data Sanitization Module", contactId: "cnt-5", organizationId: "org-4", status: "ENGAGED", source: "Referral", priority: "MEDIUM", nextAction: "Schedule security discovery call", createdAt: new Date("2026-10-02"), notes: "Looking for SOC2-compliant client portals." },
  { id: "lead-5", title: "Patient Intake Workflow Automation", contactId: "cnt-6", organizationId: "org-5", status: "NEW", source: "Email", priority: "MEDIUM", nextAction: "Send introductory product overview", createdAt: new Date("2026-10-04"), notes: "Inbound inquiry through whitepaper download." },
  { id: "lead-6", title: "Headless E-Commerce Integration", contactId: "cnt-7", organizationId: "org-6", status: "ENGAGED", source: "Website", priority: "MEDIUM", nextAction: "Review API rate limit requirements", createdAt: new Date("2026-09-29"), notes: "Starlight is expanding into EU markets next month." },
  { id: "lead-7", title: "Omnichannel Asset Syndication", contactId: "cnt-8", organizationId: "org-7", status: "WON", source: "LinkedIn", priority: "MEDIUM", nextAction: "Kickoff onboarding meeting", createdAt: new Date("2026-09-10"), notes: "Deal closed successfully on Oct 2nd." },
  { id: "lead-8", title: "Smart Factory Sensor Pipeline", contactId: "cnt-9", organizationId: "org-8", status: "QUALIFIED", source: "Event", priority: "HIGH", nextAction: "On-site architecture review", createdAt: new Date("2026-09-20"), notes: "Large scope: 12 production facilities worldwide." },
  { id: "lead-9", title: "Zero Trust Perimeter Pilot", contactId: "cnt-10", organizationId: "org-9", status: "OPPORTUNITY", source: "LinkedIn", priority: "HIGH", nextAction: "Final pricing negotiation", createdAt: new Date("2026-09-18"), notes: "Pilot testing scored 9.4/10 with engineering group." },
  { id: "lead-10", title: "Grid Telemetry Modernization", contactId: "cnt-11", organizationId: "org-10", status: "CONTACTED", source: "Manual", priority: "LOW", nextAction: "Re-engage after board meeting", createdAt: new Date("2026-09-26"), notes: "Budget cycles begin in November." },
  { id: "lead-11", title: "Cohort Retention Modeling Tool", contactId: "cnt-12", organizationId: "org-11", status: "NEW", source: "Website", priority: "LOW", nextAction: "Qualify inbound request", createdAt: new Date("2026-10-03"), notes: "Signed up for product sandbox tier." },
  { id: "lead-12", title: "Cold Chain Real-time Monitoring", contactId: "cnt-2", organizationId: "org-1", status: "LOST", source: "Email", priority: "LOW", nextAction: "Archive record", createdAt: new Date("2026-08-30"), notes: "Decided to build an internal in-house solution." },
  { id: "lead-13", title: "Logistics Fleet Fleet Routing API", contactId: "cnt-13", organizationId: "org-2", status: "ENGAGED", source: "Referral", priority: "MEDIUM", nextAction: "Send trial credentials", createdAt: new Date("2026-10-01"), notes: "Testing performance in mid-west sector." },
  { id: "lead-14", title: "Kubernetes Observability Plug-in", contactId: "cnt-14", organizationId: "org-3", status: "CONTACTED", source: "Event", priority: "MEDIUM", nextAction: "Schedule technical follow-up", createdAt: new Date("2026-09-25"), notes: "Met at KubeCon booth." },
  { id: "lead-15", title: "FinTech Transaction Encryption", contactId: "cnt-15", organizationId: "org-4", status: "QUALIFIED", source: "LinkedIn", priority: "HIGH", nextAction: "Prepare compliance checklist", createdAt: new Date("2026-09-22"), notes: "Auditors mandated hardware-level security module." },
  { id: "lead-16", title: "Creator Economy Ad Placement", contactId: "cnt-16", organizationId: "org-7", status: "NEW", source: "Website", priority: "LOW", nextAction: "Send capability statement", createdAt: new Date("2026-10-04"), notes: "Inquiry received via web contact form." },
  { id: "lead-17", title: "Electronic Health Records Sync", contactId: "cnt-6", organizationId: "org-5", status: "OPPORTUNITY", source: "Manual", priority: "HIGH", nextAction: "Executive sponsor review", createdAt: new Date("2026-09-12"), notes: "High priority HIPAA certified pipeline deal." },
  { id: "lead-18", title: "Store Inventory Prediction Engine", contactId: "cnt-7", organizationId: "org-6", status: "LOST", source: "Email", priority: "LOW", nextAction: "Revisit in Q2 2027", createdAt: new Date("2026-08-15"), notes: "Company paused new software expenditures till year end." },
  { id: "lead-19", title: "Telemetry Edge Gateway", contactId: "cnt-11", organizationId: "org-10", status: "WON", source: "Referral", priority: "HIGH", nextAction: "Deploy production licenses", createdAt: new Date("2026-09-05"), notes: "Annual agreement executed on Sept 28." },
  { id: "lead-20", title: "Threat Intelligence Feed Integration", contactId: "cnt-10", organizationId: "org-9", status: "CONTACTED", source: "LinkedIn", priority: "MEDIUM", nextAction: "Share API swagger documentation", createdAt: new Date("2026-10-02"), notes: "Evaluating data accuracy against incumbent provider." }
]

const now = new Date()
const activities = [
  { id: "act-1", leadId: "lead-1", contactId: "cnt-1", organizationId: "org-1", channel: "LinkedIn", description: "Connection request sent and accepted", outcome: "Shared initial case study", timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000) },
  { id: "act-2", leadId: "lead-1", contactId: "cnt-1", organizationId: "org-1", channel: "Email", description: "Follow-up email with technical specifications", outcome: "Awaiting review", timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000) },
  { id: "act-3", leadId: "lead-2", contactId: "cnt-3", organizationId: "org-2", channel: "Meeting", description: "Architecture scoping session with engineering team", outcome: "Security audit requested", timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000) },
  { id: "act-4", leadId: "lead-3", contactId: "cnt-4", organizationId: "org-3", channel: "Email", description: "Contract draft sent for procurement review", outcome: "Legal reviewing terms", timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000) },
  { id: "act-5", leadId: "lead-4", contactId: "cnt-5", organizationId: "org-4", channel: "Call", description: "Introductory phone screen with Priya", outcome: "Agreed to follow-up call this week", timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000) },
  { id: "act-6", leadId: "lead-7", contactId: "cnt-8", organizationId: "org-7", channel: "Meeting", description: "Final contract signing session", outcome: "Won deal finalized", timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000) },
  { id: "act-7", leadId: "lead-9", contactId: "cnt-10", organizationId: "org-9", channel: "Meeting", description: "Pilot debrief call with InfoSec team", outcome: "Received 9.4/10 positive score", timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000) },
  { id: "act-8", leadId: "lead-8", contactId: "cnt-9", organizationId: "org-8", channel: "Call", description: "Pre-site visit alignment check", outcome: "Scheduled factory tour", timestamp: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000) },
  { id: "act-9", leadId: "lead-13", contactId: "cnt-13", organizationId: "org-2", channel: "Email", description: "Sandbox access provisioning notice", outcome: "Credentials delivered", timestamp: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000) },
  { id: "act-10", leadId: "lead-15", contactId: "cnt-15", organizationId: "org-4", channel: "Meeting", description: "Compliance review call", outcome: "Detailed SOC2 matrix provided", timestamp: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000) },
  { id: "act-11", leadId: "lead-6", contactId: "cnt-7", organizationId: "org-6", channel: "LinkedIn", description: "Discussed international headless rollout", outcome: "Shared API docs", timestamp: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000) },
  { id: "act-12", leadId: "lead-19", contactId: "cnt-11", organizationId: "org-10", channel: "Meeting", description: "Purchase order countersigned", outcome: "Deal closed - Won", timestamp: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000) },
  { id: "act-13", leadId: "lead-5", contactId: "cnt-6", organizationId: "org-5", channel: "Email", description: "Inbound whitepaper auto-acknowledgement", outcome: "Product brief delivered", timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000) },
  { id: "act-14", leadId: "lead-20", contactId: "cnt-10", organizationId: "org-9", channel: "Call", description: "Brief benchmark review", outcome: "Agreed to review technical feed", timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000) },
  { id: "act-15", leadId: "lead-2", contactId: "cnt-3", organizationId: "org-2", channel: "Note", description: "Noted that Marcus prefers Slack integration for notifications", outcome: "Updated client preferences", timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000) },
  { id: "act-16", leadId: "lead-14", contactId: "cnt-14", organizationId: "org-3", channel: "Email", description: "Sent conference recap & demo link", outcome: "No response yet", timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000) },
  { id: "act-17", leadId: "lead-10", contactId: "cnt-11", organizationId: "org-10", channel: "Call", description: "Checked Q4 project timeline status", outcome: "Board review pending", timestamp: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) },
  { id: "act-18", leadId: "lead-11", contactId: "cnt-12", organizationId: "org-11", channel: "Note", description: "Automated sign-up alert received", outcome: "Assigned for manual triage", timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000) },
  { id: "act-19", leadId: "lead-16", contactId: "cnt-16", organizationId: "org-7", channel: "Email", description: "Inbound contact form confirmation", outcome: "Awaiting availability", timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000) },
  { id: "act-20", leadId: "lead-17", contactId: "cnt-6", organizationId: "org-5", channel: "Meeting", description: "Healthcare security advisory board session", outcome: "Positive endorsement received", timestamp: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000) }
]

const tasks = [
  { id: "tsk-1", leadId: "lead-1", contactId: "cnt-1", organizationId: "org-1", title: "Follow up with Rahul Sharma on technical specs", dueDate: "Today", priority: "HIGH", completed: false },
  { id: "tsk-2", leadId: "lead-4", contactId: "cnt-5", organizationId: "org-4", title: "Send introduction email & security questionnaire", dueDate: "Today", priority: "MEDIUM", completed: false },
  { id: "tsk-3", leadId: "lead-2", contactId: "cnt-3", organizationId: "org-2", title: "Schedule discovery call with engineering leadership", dueDate: "Tomorrow", priority: "HIGH", completed: false },
  { id: "tsk-4", leadId: "lead-3", contactId: "cnt-4", organizationId: "org-3", title: "Review Master Services Agreement redlines", dueDate: "Tomorrow", priority: "HIGH", completed: false },
  { id: "tsk-5", leadId: "lead-6", contactId: "cnt-7", organizationId: "org-6", title: "Prepare API load benchmark report", dueDate: "In 2 days", priority: "MEDIUM", completed: false },
  { id: "tsk-6", leadId: "lead-8", contactId: "cnt-9", organizationId: "org-8", title: "Confirm factory visit travel itinerary", dueDate: "In 2 days", priority: "HIGH", completed: false },
  { id: "tsk-7", leadId: "lead-15", contactId: "cnt-15", organizationId: "org-4", title: "Send encrypted file share link", dueDate: "Today", priority: "MEDIUM", completed: true },
  { id: "tsk-8", leadId: "lead-17", contactId: "cnt-6", organizationId: "org-5", title: "Draft executive presentation deck", dueDate: "Next week", priority: "MEDIUM", completed: false },
  { id: "tsk-9", leadId: "lead-20", contactId: "cnt-10", organizationId: "org-9", title: "Generate sandbox threat API keys", dueDate: "Today", priority: "LOW", completed: false },
  { id: "tsk-10", leadId: "lead-7", contactId: "cnt-8", organizationId: "org-7", title: "Submit signed paperwork to finance", dueDate: "Yesterday", priority: "HIGH", completed: true }
]

async function main() {
  console.log('Seeding database...')

  // Clear existing data
  await prisma.task.deleteMany()
  await prisma.activity.deleteMany()
  await prisma.lead.deleteMany()
  await prisma.contact.deleteMany()
  await prisma.organization.deleteMany()

  // Create organizations
  console.log('Creating organizations...')
  for (const org of organizations) {
    await prisma.organization.create({ data: org })
  }

  // Create contacts
  console.log('Creating contacts...')
  for (const contact of contacts) {
    await prisma.contact.create({ data: contact })
  }

  // Create leads
  console.log('Creating leads...')
  for (const lead of leads) {
    await prisma.lead.create({ data: lead })
  }

  // Create activities
  console.log('Creating activities...')
  for (const activity of activities) {
    await prisma.activity.create({ data: activity })
  }

  // Create tasks
  console.log('Creating tasks...')
  for (const task of tasks) {
    await prisma.task.create({ data: task })
  }

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })