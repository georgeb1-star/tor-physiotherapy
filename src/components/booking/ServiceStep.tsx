'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import { Clock, ArrowRight } from 'lucide-react'

type Service = {
  id: string
  name: string
  durationMinutes: number
  pricePence: number
  description: string
}

export function ServiceStep({ onNext }: { onNext: (service: Service) => void }) {
  const [services, setServices] = useState<Service[]>([])
  const [selected, setSelected] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/services')
      .then((r) => r.json())
      .then(setServices)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-200 border-t-[#1A4D35]" />
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-black text-[#1A4D35] uppercase tracking-tight mb-1">Select a service</h2>
      <p className="text-sm text-gray-500 mb-6">Choose the treatment you'd like to book</p>

      <div className="space-y-3 mb-8">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => setSelected(service)}
            className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
              selected?.id === service.id
                ? 'border-[#1A4D35] bg-[#EBF5EF]'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{service.name}</p>
                <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{service.durationMinutes} min</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-gray-900 text-lg">{formatPrice(service.pricePence)}</p>
                {selected?.id === service.id && (
                  <span className="text-xs text-[#1A4D35] font-bold">Selected</span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      <Button disabled={!selected} onClick={() => selected && onNext(selected)} className="w-full" size="lg">
        Continue <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  )
}
