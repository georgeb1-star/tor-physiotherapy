'use client'
import { useState } from 'react'
import { ServiceStep } from './ServiceStep'
import { SlotPickerStep } from './SlotPickerStep'
import { DetailsStep } from './DetailsStep'
import { PaymentStep } from './PaymentStep'
import { ConfirmationStep } from './ConfirmationStep'

export type BookingState = {
  service?: { id: string; name: string; durationMinutes: number; pricePence: number; description: string }
  slotDatetime?: string
  notes?: string
  bookingId?: string
  clientSecret?: string
}

const STEPS = ['Service', 'Date & Time', 'Details', 'Payment', 'Confirmation']

export function BookingWizard() {
  const [step, setStep] = useState(0)
  const [booking, setBooking] = useState<BookingState>({})

  const next = () => setStep((s) => s + 1)
  const back = () => setStep((s) => s - 1)
  const update = (data: Partial<BookingState>) => setBooking((b) => ({ ...b, ...data }))

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {STEPS.map((label, i) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                  i < step
                    ? 'bg-[#2D6B4A] text-white'
                    : i === step
                    ? 'bg-[#1A4D35] text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`text-xs hidden sm:block ${i === step ? 'text-[#1A4D35] font-bold' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
          ))}
        </div>
        <div className="relative h-1.5 rounded-full bg-gray-200">
          <div
            className="absolute h-1.5 rounded-full bg-[#1A4D35] transition-all"
            style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      {step === 0 && <ServiceStep onNext={(service) => { update({ service }); next() }} />}
      {step === 1 && (
        <SlotPickerStep
          service={booking.service!}
          onBack={back}
          onNext={(slotDatetime) => { update({ slotDatetime }); next() }}
        />
      )}
      {step === 2 && (
        <DetailsStep
          onBack={back}
          onNext={(notes) => { update({ notes }); next() }}
        />
      )}
      {step === 3 && (
        <PaymentStep
          booking={booking}
          onBack={back}
          onNext={(bookingId, clientSecret) => { update({ bookingId, clientSecret }); next() }}
        />
      )}
      {step === 4 && <ConfirmationStep booking={booking} />}
    </div>
  )
}
