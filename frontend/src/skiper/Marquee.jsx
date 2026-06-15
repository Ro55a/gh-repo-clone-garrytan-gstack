import { cn } from '../lib/utils'

export default function Marquee({
  children,
  className = '',
  reverse = false,
  pauseOnHover = false,
  vertical = false,
  repeat = 4,
}) {
  return (
    <div
      className={cn(
        'group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]',
        vertical ? 'flex-col' : 'flex-row',
        className
      )}
    >
      {Array.from({ length: repeat }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'flex shrink-0 justify-around [gap:var(--gap)]',
            vertical ? 'animate-marquee-vertical flex-col' : 'animate-marquee flex-row',
            reverse ? '[animation-direction:reverse]' : '',
            pauseOnHover ? 'group-hover:[animation-play-state:paused]' : ''
          )}
        >
          {children}
        </div>
      ))}
    </div>
  )
}
