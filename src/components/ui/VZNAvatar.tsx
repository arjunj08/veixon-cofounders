import { cn } from '@/lib/utils'

type VZNAvatarProps = {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  mood?: 'neutral' | 'warning' | 'critical'
  className?: string
}

const sizes = {
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-20 w-20',
  xl: 'h-40 w-40',
}

export default function VZNAvatar({ size = 'md', mood = 'neutral', className }: VZNAvatarProps) {
  const stroke = mood === 'critical' ? 'var(--red)' : mood === 'warning' ? 'var(--amber)' : 'var(--purple)'

  return (
    <div className={cn('vzn-pulse shrink-0', sizes[size], className)} aria-label="VZN avatar">
      <svg viewBox="0 0 160 160" className="h-full w-full overflow-visible">
        <polygon points="80 8 145 45 145 115 80 152 15 115 15 45" fill="none" stroke={stroke} strokeWidth="3" />
        <polygon points="80 30 126 56 126 104 80 130 34 104 34 56" fill="none" stroke={stroke} strokeOpacity="0.6" strokeWidth="2" />
        <polygon points="80 52 106 66 106 94 80 108 54 94 54 66" fill="none" stroke={stroke} strokeOpacity="0.3" strokeWidth="2" />
        <line x1="55" x2="105" y1="70" y2="70" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
        <line x1="48" x2="112" y1="82" y2="82" stroke={stroke} strokeOpacity="0.75" strokeWidth="3" strokeLinecap="round" />
        <line x1="60" x2="100" y1="94" y2="94" stroke={stroke} strokeOpacity="0.5" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  )
}

export { VZNAvatar }
