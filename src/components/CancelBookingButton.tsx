'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export function CancelBookingButton({ bookingId }: { bookingId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const cancel = async () => {
    if (!confirm('Are you sure you want to cancel this booking?')) return
    setLoading(true)
    await fetch(`/api/bookings/${bookingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'cancelled' }),
    })
    setLoading(false)
    router.refresh()
  }

  return (
    <Button variant="danger" size="sm" onClick={cancel} loading={loading}>
      Cancel
    </Button>
  )
}
