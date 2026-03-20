'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { formatDateTime, formatPrice } from '@/lib/utils'
import { CheckCircle } from 'lucide-react'
import { BookingState } from './BookingWizard'

export function ConfirmationStep({ booking }: { booking: BookingState }) {
  return (
    <div className="text-center py-8">
      <div className="flex justify-center mb-4">
        <CheckCircle className="h-16 w-16 text-[#1A4D35]" />
      </div>
      <h2 className="text-2xl font-black text-[#1A4D35] uppercase tracking-tight mb-2">Booking confirmed!</h2>
      <p className="text-gray-500 mb-8">
        You'll receive a confirmation email shortly.
      </p>

      <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 text-left max-w-sm mx-auto mb-8 space-y-3">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Service</p>
          <p className="font-semibold text-gray-900">{booking.service?.name}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Date & Time</p>
          <p className="font-semibold text-gray-900">{booking.slotDatetime ? formatDateTime(booking.slotDatetime) : ''}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Amount paid</p>
          <p className="font-semibold text-gray-900">{booking.service ? formatPrice(booking.service.pricePence) : ''}</p>
        </div>
      </div>

      <div className="flex gap-3 justify-center">
        <Link href="/book">
          <Button variant="secondary">Book another</Button>
        </Link>
        <Link href="/dashboard">
          <Button>View my bookings</Button>
        </Link>
      </div>
    </div>
  )
}
