'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

type ScheduleEntry = {
  id?: string
  dayOfWeek: number
  startTime: string
  endTime: string
  slotDurationMinutes: number
  isActive: boolean
}

const DEFAULT_SCHEDULE: ScheduleEntry[] = DAY_NAMES.map((_, i) => ({
  dayOfWeek: i,
  startTime: '09:00',
  endTime: '17:00',
  slotDurationMinutes: 60,
  isActive: i >= 1 && i <= 5, // Mon-Fri
}))

export function ScheduleEditor({ initialSchedule }: { initialSchedule: ScheduleEntry[] }) {
  const [entries, setEntries] = useState<ScheduleEntry[]>(() => {
    const map = Object.fromEntries(initialSchedule.map((e) => [e.dayOfWeek, e]))
    return DAY_NAMES.map((_, i) => map[i] ?? { ...DEFAULT_SCHEDULE[i] })
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const update = (index: number, field: keyof ScheduleEntry, value: string | number | boolean) => {
    setEntries((prev) => prev.map((e, i) => (i === index ? { ...e, [field]: value } : e)))
    setSaved(false)
  }

  const save = async () => {
    setSaving(true)
    const res = await fetch('/api/admin/schedule', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entries),
    })
    setSaving(false)
    if (res.ok) setSaved(true)
  }

  return (
    <div>
      <div className="space-y-2 mb-6">
        {entries.map((entry, i) => (
          <div key={i} className={`flex items-center gap-3 rounded-lg border p-3 ${entry.isActive ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50 opacity-60'}`}>
            <div className="w-28">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={entry.isActive}
                  onChange={(e) => update(i, 'isActive', e.target.checked)}
                  className="rounded accent-blue-700"
                />
                <span className="text-sm font-medium text-gray-700">{DAY_NAMES[i]}</span>
              </label>
            </div>
            <div className="flex items-center gap-2 flex-1">
              <input
                type="time"
                value={entry.startTime}
                disabled={!entry.isActive}
                onChange={(e) => update(i, 'startTime', e.target.value)}
                className="rounded-lg border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
              />
              <span className="text-gray-400 text-sm">to</span>
              <input
                type="time"
                value={entry.endTime}
                disabled={!entry.isActive}
                onChange={(e) => update(i, 'endTime', e.target.value)}
                className="rounded-lg border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
              />
              <div className="flex items-center gap-1 ml-2">
                <label className="text-xs text-gray-500">Slot</label>
                <select
                  value={entry.slotDurationMinutes}
                  disabled={!entry.isActive}
                  onChange={(e) => update(i, 'slotDurationMinutes', Number(e.target.value))}
                  className="rounded-lg border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
                >
                  <option value={30}>30 min</option>
                  <option value={45}>45 min</option>
                  <option value={60}>60 min</option>
                  <option value={90}>90 min</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={save} loading={saving}>Save schedule</Button>
        {saved && <span className="text-sm text-green-600 font-medium">Saved!</span>}
      </div>
    </div>
  )
}
