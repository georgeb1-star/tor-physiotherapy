import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object as Stripe.PaymentIntent
    await prisma.booking.updateMany({
      where: { stripePaymentIntentId: pi.id },
      data: { status: 'confirmed', stripePaymentStatus: 'succeeded' },
    })
  }

  if (event.type === 'payment_intent.payment_failed') {
    const pi = event.data.object as Stripe.PaymentIntent
    await prisma.booking.updateMany({
      where: { stripePaymentIntentId: pi.id },
      data: { status: 'cancelled', stripePaymentStatus: 'failed' },
    })
  }

  return NextResponse.json({ received: true })
}
