'use client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { format, addDays, startOfDay, isBefore } from 'date-fns'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'

type Service = { id: string; name: string; durationMinutes: number; pricePence: number; description: string }

export function SlotPickerStep({
  service,
  onBack,
  onNext,
}: {
  service: Service
  onBack: () => void
  onNext: (slotDatetime: string) => void
}) {
  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(addDays(new Date(), 1)))
  const [slots, setSlots] = useState<string[]>([])
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [weekOffset, setWeekOffset] = useState(0)

  const today = startOfDay(new Date())
  const weekStart = addDays(today, weekOffset * 7)
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  useEffect(() => {
    setLoading(true)
    setSelectedSlot(null)
    const dateStr = format(selectedDate, 'yyyy-MM-dd')
    fetch(`/api/slots?date=${dateStr}&serviceId=${service.id}`)
      .then((r) => r.json())
      .then((data) => setSlots(data.slots ?? []))
      .finally(() => setLoading(false))
  }, [selectedDate, service.id])

  return (
    <div>
      <h2 className="text-xl font-black text-[#1A4D35] uppercase tracking-tight mb-1">Choose date &amp; time</h2>
      <p className="text-sm text-gray-500 mb-6">Select an available appointment slot</p>

      {/* Week nav */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => setWeekOffset((w) => w - 1)}
          disabled={weekOffset === 0}
          className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 disabled:opacity-30"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="text-sm font-medium text-gray-700">
          {format(weekStart, 'MMM d')} – {format(addDays(weekStart, 6), 'MMM d, yyyy')}
        </span>
        <button onClick={() => setWeekOffset((w) => w + 1)} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Day selector */}
      <div className="grid grid-cols-7 gap-1 mb-6">
        {weekDays.map((day) => {
          const isPast = isBefore(day, today)
          const isSelected = format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
          return (
            <button
              key={day.toISOString()}
              onClick={() => !isPast && setSelectedDate(day)}
              disabled={isPast}
              className={`flex flex-col items-center rounded-xl p-2 text-xs transition-colors disabled:opacity-30 ${
                isSelected
                  ? 'bg-[#1A4D35] text-white'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <span className="font-medium">{format(day, 'EEE')}</span>
              <span className={`text-lg font-bold ${isSelected ? '' : 'text-gray-900'}`}>{format(day, 'd')}</span>
            </button>
          )
        })}
      </div>

      {/* Time slots */}
      <div className="mb-8 min-h-[120px]">
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="h-6 w-6 animate-spin rounded-full border-4 border-green-200 border-t-[#1A4D35]" />
          </div>
        ) : slots.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 py-10 text-center">
            <p className="text-sm text-gray-500">No available slots on this day</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {slots.map((slot) => {
              const time = new Date(slot).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
              return (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`rounded-lg border-2 py-2.5 text-sm font-medium transition-colors ${
                    selectedSlot === slot
                      ? 'border-[#1A4D35] bg-[#EBF5EF] text-[#1A4D35]'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  {time}
                </button>
              )
            })}
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={onBack} className="flex-1">Back</Button>
        <Button disabled={!selectedSlot} onClick={() => selectedSlot && onNext(selectedSlot)} className="flex-1" size="lg">
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
