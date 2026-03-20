import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { BookingsTable } from '@/components/admin/BookingsTable'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Calendar } from 'lucide-react'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'admin') redirect('/login')

  const bookings = await prisma.booking.findMany({
    include: {
      patient: { select: { id: true, name: true, email: true, phone: true } },
      service: true,
    },
    orderBy: { slotDatetime: 'asc' },
  })

  const serialized = bookings.map((b) => ({
    ...b,
    slotDatetime: b.slotDatetime.toISOString(),
    createdAt: b.createdAt.toISOString(),
  }))

  const total = bookings.length
  const confirmed = bookings.filter((b: { status: string }) => b.status === 'confirmed').length
  const pending = bookings.filter((b: { status: string }) => b.status === 'pending').length

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Manage appointments and schedule</p>
        </div>
        <Link href="/admin/schedule">
          <Button variant="secondary" size="sm">
            <Calendar className="h-4 w-4 mr-1.5" /> Manage schedule
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total bookings', value: total, color: 'text-gray-900' },
          { label: 'Confirmed', value: confirmed, color: 'text-green-600' },
          { label: 'Pending payment', value: pending, color: 'text-yellow-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm">
            <p className={`text-3xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">All bookings</h2>
        </div>
        <BookingsTable initialBookings={serialized as any} />
      </div>
    </div>
  )
}
