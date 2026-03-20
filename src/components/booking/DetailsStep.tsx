'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowRight } from 'lucide-react'

export function DetailsStep({
  onBack,
  onNext,
}: {
  onBack: () => void
  onNext: (notes: string) => void
}) {
  const { data: session } = useSession()
  const [notes, setNotes] = useState('')

  return (
    <div>
      <h2 className="text-xl font-black text-[#1A4D35] uppercase tracking-tight mb-1">Your details</h2>
      <p className="text-sm text-gray-500 mb-6">Confirm your information and add any notes</p>

      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 mb-6">
        <p className="text-sm font-medium text-gray-700">Booking as</p>
        <p className="text-base font-semibold text-gray-900 mt-0.5">{session?.user?.name}</p>
        <p className="text-sm text-gray-500">{session?.user?.email}</p>
      </div>

      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 block mb-1.5">
          Additional notes <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none"
          rows={4}
          placeholder="E.g. area of injury, health conditions, anything useful for the therapist…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={onBack} className="flex-1">Back</Button>
        <Button onClick={() => onNext(notes)} className="flex-1" size="lg">
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
