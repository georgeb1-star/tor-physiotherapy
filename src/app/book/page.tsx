import { BookingWizard } from '@/components/booking/BookingWizard'

export default function BookPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Book an appointment</h1>
        <p className="text-sm text-gray-500 mt-1">Complete the steps below to secure your booking</p>
      </div>
      <BookingWizard />
    </div>
  )
}
