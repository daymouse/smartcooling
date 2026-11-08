import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

const badgeVariants = cva('inline-flex items-center justify-center rounded-full border px-4 py-1 text-sm', {
  variants: {
    tone: {
      neutral: 'border-neutral-300 bg-neutral-200 text-neutral-700',
      green: 'border-green-700/60 bg-green-600/50 text-green-950',
      amber: 'border-amber-600/60 bg-amber-400/50 text-amber-950',
      orange: 'border-orange-600/60 bg-orange-400/50 text-orange-950',
      red: 'border-red-700/60 bg-red-500/40 text-red-950',
    },
  },
  defaultVariants: { tone: 'neutral' },
})

export function Badge({ className, tone, ...props }: ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />
}
