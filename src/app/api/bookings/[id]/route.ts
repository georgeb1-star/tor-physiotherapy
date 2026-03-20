import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = (session.user as any).id
  const { id } = await params
  const { status } = await request.json()

  const booking = await prisma.booking.findUnique({ where: { id } })
  if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Patients can only cancel their own bookings
  if (booking.patientId !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  if (status !== 'cancelled') {
    return NextResponse.json({ error: 'Patients can only cancel bookings' }, { status: 400 })
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: { status: 'cancelled' },
    include: { service: true },
  })

  return NextResponse.json(updated)
}
