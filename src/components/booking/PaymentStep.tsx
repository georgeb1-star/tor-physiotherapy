'use client'
import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { formatPrice, formatDateTime } from '@/lib/utils'
import { BookingState } from './BookingWizard'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function CheckoutForm({
  bookingId,
  onBack,
  onSuccess,
}: {
  bookingId: string
  onBack: () => void
  onSuccess: () => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)
    setError(null)

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard?booked=1`,
      },
    })

    if (stripeError) {
      setError(stripeError.message ?? 'Payment failed. Please try again.')
      setLoading(false)
    }
    // On success, Stripe redirects to return_url
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement className="mb-6" />
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      <div className="flex gap-3">
        <Button type="button" variant="secondary" onClick={onBack} className="flex-1" disabled={loading}>
          Back
        </Button>
        <Button type="submit" disabled={!stripe || loading} loading={loading} className="flex-1" size="lg">
          Pay now
        </Button>
      </div>
    </form>
  )
}

export function PaymentStep({
  booking,
  onBack,
  onNext,
}: {
  booking: BookingState
  onBack: () => void
  onNext: (bookingId: string, clientSecret: string) => void
}) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [bookingId, setBookingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        serviceId: booking.service!.id,
        slotDatetime: booking.slotDatetime,
        notes: booking.notes,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error)
        } else {
          setClientSecret(data.clientSecret)
          setBookingId(data.booking.id)
        }
      })
      .catch(() => setError('Failed to create booking. Please try again.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-700" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-600 mb-4">{error}</p>
        <Button variant="secondary" onClick={onBack}>Go back</Button>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-1">Payment</h2>
      <p className="text-sm text-gray-500 mb-6">Complete your booking with a secure payment</p>

      {/* Summary */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 mb-6 space-y-1.5">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{booking.service!.name}</span>
          <span className="font-semibold">{formatPrice(booking.service!.pricePence)}</span>
        </div>
        <div className="text-sm text-gray-500">{formatDateTime(booking.slotDatetime!)}</div>
      </div>

      {clientSecret && bookingId && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm
            bookingId={bookingId}
            onBack={onBack}
            onSuccess={() => onNext(bookingId, clientSecret)}
          />
        </Elements>
      )}
    </div>
  )
}
