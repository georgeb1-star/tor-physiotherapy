import { prisma } from './prisma'
import { parse, addMinutes, format, isBefore, isEqual } from 'date-fns'

export async function getAvailableSlots(date: string, serviceId: string): Promise<string[]> {
  const targetDate = new Date(date)
  const dayOfWeek = targetDate.getDay()

  const schedule = await prisma.weeklySchedule.findFirst({
    where: { dayOfWeek, isActive: true },
  })
  if (!schedule) return []

  const slots: string[] = []
  const startDateTime = parse(schedule.startTime, 'HH:mm', targetDate)
  const endDateTime = parse(schedule.endTime, 'HH:mm', targetDate)

  let cursor = startDateTime
  while (isBefore(cursor, endDateTime) || isEqual(cursor, endDateTime)) {
    const next = addMinutes(cursor, schedule.slotDurationMinutes)
    if (isBefore(next, endDateTime) || isEqual(next, endDateTime)) {
      slots.push(cursor.toISOString())
    }
    cursor = next
  }

  // Filter out already-booked slots
  const [bookings, blockedSlots] = await Promise.all([
    prisma.booking.findMany({
      where: {
        slotDatetime: {
          gte: new Date(`${date}T00:00:00.000Z`),
          lt: new Date(`${date}T23:59:59.999Z`),
        },
        status: { not: 'cancelled' },
      },
      select: { slotDatetime: true },
    }),
    prisma.blockedSlot.findMany({
      where: {
        slotDatetime: {
          gte: new Date(`${date}T00:00:00.000Z`),
          lt: new Date(`${date}T23:59:59.999Z`),
        },
      },
      select: { slotDatetime: true },
    }),
  ])

  const bookedIsos = new Set([
    ...bookings.map((b: { slotDatetime: Date }) => b.slotDatetime.toISOString()),
    ...blockedSlots.map((b: { slotDatetime: Date }) => b.slotDatetime.toISOString()),
  ])

  return slots.filter((s) => !bookedIsos.has(s))
}
