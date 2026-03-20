import { NextResponse } from 'next/server'
import { getAvailableSlots } from '@/lib/slots'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date')
  const serviceId = searchParams.get('serviceId')

  if (!date || !serviceId) {
    return NextResponse.json({ error: 'date and serviceId are required' }, { status: 400 })
  }

  const service = await prisma.service.findUnique({ where: { id: serviceId, isActive: true } })
  if (!service) {
    return NextResponse.json({ error: 'Service not found' }, { status: 404 })
  }

  const slots = await getAvailableSlots(date, serviceId)
  return NextResponse.json({ slots })
}
