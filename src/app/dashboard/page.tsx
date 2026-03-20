import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { formatDateTime, formatPrice } from '@/lib/utils'
import { CancelBookingButton } from '@/components/CancelBookingButton'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const userId = (session.user as any).id
  const bookings = await prisma.booking.findMany({
    where: { patientId: userId },
    include: { service: true },
    orderBy: { slotDatetime: 'desc' },
  })

  type BookingRow = typeof bookings[number]
  const upcoming = bookings.filter(
    (b: BookingRow) => new Date(b.slotDatetime) > new Date() && b.status !== 'cancelled'
  )
  const past = bookings.filter(
    (b: BookingRow) => new Date(b.slotDatetime) <= new Date() || b.status === 'cancelled'
  )

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My bookings</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back, {session.user?.name}</p>
      </div>

      {/* Upcoming */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming</h2>
        {upcoming.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 py-10 text-center">
            <p className="text-sm text-gray-400 mb-3">No upcoming bookings</p>
            <a href="/book" className="text-sm font-medium text-blue-700 hover:underline">Book an appointment →</a>
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.map((b) => (
              <div key={b.id} className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div>
                  <p className="font-semibold text-gray-900">{b.service.name}</p>
                  <p className="text-sm text-gray-500">{formatDateTime(b.slotDatetime.toISOString())}</p>
                  <p className="text-sm text-gray-500">{formatPrice(b.service.pricePence)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge status={b.status as any} />
                  {b.status !== 'cancelled' && (
                    <CancelBookingButton bookingId={b.id} />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Past */}
      {past.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Past &amp; cancelled</h2>
          <div className="space-y-3">
            {past.map((b) => (
              <div key={b.id} className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-4 opacity-70">
                <div>
                  <p className="font-semibold text-gray-700">{b.service.name}</p>
                  <p className="text-sm text-gray-400">{formatDateTime(b.slotDatetime.toISOString())}</p>
                  <p className="text-sm text-gray-400">{formatPrice(b.service.pricePence)}</p>
                </div>
                <Badge status={b.status as any} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
