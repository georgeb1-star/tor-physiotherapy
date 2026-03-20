import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = (session.user as any).id
  const bookings = await prisma.booking.findMany({
    where: { patientId: userId },
    include: { service: true },
    orderBy: { slotDatetime: 'desc' },
  })

  return NextResponse.json(bookings)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = (session.user as any).id
  const { serviceId, slotDatetime, notes } = await request.json()

  if (!serviceId || !slotDatetime) {
    return NextResponse.json({ error: 'serviceId and slotDatetime are required' }, { status: 400 })
  }

  const service = await prisma.service.findUnique({ where: { id: serviceId, isActive: true } })
  if (!service) return NextResponse.json({ error: 'Service not found' }, { status: 404 })

  // Check slot is still available
  const conflict = await prisma.booking.findFirst({
    where: { slotDatetime: new Date(slotDatetime), status: { not: 'cancelled' } },
  })
  if (conflict) return NextResponse.json({ error: 'Slot no longer available' }, { status: 409 })

  // Create Stripe PaymentIntent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: service.pricePence,
    currency: 'gbp',
    metadata: { serviceId, slotDatetime, userId },
  })

  // Create booking in pending state
  const booking = await prisma.booking.create({
    data: {
      patientId: userId,
      serviceId,
      slotDatetime: new Date(slotDatetime),
      status: 'pending',
      stripePaymentIntentId: paymentIntent.id,
      notes,
    },
    include: { service: true },
  })

  return NextResponse.json({
    booking,
    clientSecret: paymentIntent.client_secret,
  }, { status: 201 })
}
