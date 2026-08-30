import mascotHead from '../assets/mascot-head.png';
import mascotWave from '../assets/mascot-wave.png';
import mascotWavePlatform from '../assets/mascot-wave-platform.png';

interface MascotProps {
  size?: number;
  className?: string;
  variant?: 'head' | 'wave' | 'wave-platform';
}

const MASCOT_SRC = {
  head: mascotHead,
  wave: mascotWave,
  'wave-platform': mascotWavePlatform,
};

export function Mascot({ size = 40, className = '', variant = 'head' }: MascotProps) {
  return (
    <img
      src={MASCOT_SRC[variant]}
      alt=""
      style={{ width: size, height: size }}
      className={`object-contain ${className}`}
    />
  );
}

interface MascotTipProps {
  message: string;
  layout?: 'row' | 'column';
  variant?: 'head' | 'wave' | 'wave-platform';
  className?: string;
}

export function MascotTip({
  message,
  layout = 'row',
  variant = 'head',
  className = '',
}: MascotTipProps) {
  return (
    <div
      className={`flex items-center gap-3 ${layout === 'column' ? 'flex-col text-center' : ''} ${className}`}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-robot-cyan-100 dark:bg-robot-cyan-950">
        <Mascot size={variant === 'wave' ? 46 : 34} variant={variant} />
      </div>
      <div className="rounded-2xl bg-robot-cyan-50 px-3 py-2 text-sm text-robot-cyan-800 dark:bg-robot-cyan-950 dark:text-robot-cyan-200">
        {message}
      </div>
    </div>
  );
}
