interface MascotProps {
  size?: number;
  className?: string;
}

// A simple original friendly-robot glyph — not a reproduction of any
// specific reference art, just a reusable brand mascot for tips/greetings.
export function Mascot({ size = 40, className = '' }: MascotProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <line x1="32" y1="4" x2="32" y2="13" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <circle cx="32" cy="4" r="3" fill="currentColor" />
      <rect x="9" y="13" width="46" height="38" rx="15" fill="white" stroke="currentColor" strokeWidth="3" />
      <circle cx="24" cy="32" r="5" fill="currentColor" />
      <circle cx="40" cy="32" r="5" fill="currentColor" />
      <path d="M23 41 Q32 47 41 41" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

interface MascotTipProps {
  message: string;
  layout?: 'row' | 'column';
  className?: string;
}

export function MascotTip({ message, layout = 'row', className = '' }: MascotTipProps) {
  return (
    <div
      className={`flex items-center gap-3 ${layout === 'column' ? 'flex-col text-center' : ''} ${className}`}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400">
        <Mascot size={30} />
      </div>
      <div className="rounded-2xl bg-violet-50 px-3 py-2 text-sm text-violet-800 dark:bg-violet-950 dark:text-violet-200">
        {message}
      </div>
    </div>
  );
}
