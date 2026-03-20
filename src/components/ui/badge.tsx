import { cn } from '@/lib/utils'

type BadgeVariant = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'default'

const variants: Record<BadgeVariant, string> = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-[#EBF5EF] text-[#1A4D35]',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-gray-100 text-gray-700',
  default: 'bg-gray-100 text-gray-700',
}

export function Badge({ status, className }: { status: BadgeVariant; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize',
        variants[status] ?? variants.default,
        className
      )}
    >
      {status}
    </span>
  )
}
