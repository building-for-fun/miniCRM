import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { runSeed } from '@/lib/fixtures'

export async function POST() {
  try {
    const counts = await runSeed(prisma)
    return NextResponse.json({ ok: true, counts })
  } catch (error) {
    console.error('Failed to reset sample data:', error)
    return NextResponse.json({ error: 'Failed to reset sample data' }, { status: 500 })
  }
}
