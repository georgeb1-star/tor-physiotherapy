import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const bookings = await prisma.booking.findMany({
    include: {
      patient: { select: { id: true, name: true, email: true, phone: true } },
      service: true,
    },
    orderBy: { slotDatetime: 'asc' },
  })

  return NextResponse.json(bookings)
}
