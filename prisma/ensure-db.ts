import { PrismaClient } from '@prisma/client'
import { runSeed } from '../src/lib/fixtures'

const prisma = new PrismaClient()

async function main() {
  const [organizations, contacts, leads, activities, tasks] = await Promise.all([
    prisma.organization.count(),
    prisma.contact.count(),
    prisma.lead.count(),
    prisma.activity.count(),
    prisma.task.count(),
  ])
  const total = organizations + contacts + leads + activities + tasks
  if (total > 0) {
    console.log(`Database already has data (${total} rows), skipping seed.`)
    return
  }
  console.log('Empty database detected, seeding demo fixtures...')
  const counts = await runSeed(prisma)
  console.log('Seeded:', counts)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
