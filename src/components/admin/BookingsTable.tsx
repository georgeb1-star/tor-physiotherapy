'use client'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDateTime, formatPrice } from '@/lib/utils'

type Booking = {
  id: string
  slotDatetime: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  notes?: string
  patient: { name: string; email: string; phone?: string }
  service: { name: string; pricePence: number }
}

const STATUS_OPTIONS = ['pending', 'confirmed', 'cancelled', 'completed'] as const

export function BookingsTable({ initialBookings }: { initialBookings: Booking[] }) {
  const [bookings, setBookings] = useState(initialBookings)
  const [updating, setUpdating] = useState<string | null>(null)

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id)
    const res = await fetch(`/api/admin/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      const updated = await res.json()
      setBookings((bs) => bs.map((b) => (b.id === id ? updated : b)))
    }
    setUpdating(null)
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-600">Patient</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">Service</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">Date & Time</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {bookings.map((booking) => (
            <tr key={booking.id} className="hover:bg-gray-50">
              <td className="py-3 px-4">
                <p className="font-medium text-gray-900">{booking.patient.name}</p>
                <p className="text-gray-500 text-xs">{booking.patient.email}</p>
                {booking.patient.phone && <p className="text-gray-400 text-xs">{booking.patient.phone}</p>}
              </td>
              <td className="py-3 px-4">
                <p className="font-medium text-gray-900">{booking.service.name}</p>
                <p className="text-gray-500 text-xs">{formatPrice(booking.service.pricePence)}</p>
              </td>
              <td className="py-3 px-4 text-gray-700">{formatDateTime(booking.slotDatetime)}</td>
              <td className="py-3 px-4">
                <Badge status={booking.status} />
              </td>
              <td className="py-3 px-4">
                <select
                  className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-100"
                  value={booking.status}
                  disabled={updating === booking.id}
                  onChange={(e) => updateStatus(booking.id, e.target.value)}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
          {bookings.length === 0 && (
            <tr>
              <td colSpan={5} className="py-10 text-center text-gray-400">No bookings yet</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
