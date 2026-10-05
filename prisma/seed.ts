import { PrismaClient } from '@prisma/client'
import { runSeed } from '../src/lib/fixtures'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')
  const counts = await runSeed(prisma)
  console.log('Seeding completed!', counts)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
