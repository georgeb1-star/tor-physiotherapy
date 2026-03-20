import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const schedule = await prisma.weeklySchedule.findMany({
    orderBy: { dayOfWeek: 'asc' },
  })

  return NextResponse.json(schedule)
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const entries: Array<{
    id?: string
    dayOfWeek: number
    startTime: string
    endTime: string
    slotDurationMinutes: number
    isActive: boolean
  }> = await request.json()

  // Replace entire schedule
  await prisma.weeklySchedule.deleteMany()
  await prisma.weeklySchedule.createMany({ data: entries.map(({ id, ...rest }) => rest) })

  const updated = await prisma.weeklySchedule.findMany({ orderBy: { dayOfWeek: 'asc' } })
  return NextResponse.json(updated)
}
