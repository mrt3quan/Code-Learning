import iconCpp from '../assets/icon-cpp-gamepad.png';
import iconPython from '../assets/icon-python-brain.png';
import type { Language } from '../data/lessons';

interface TrackIconProps {
  language: Language;
  size?: number;
  className?: string;
}

export default function TrackIcon({ language, size = 24, className = '' }: TrackIconProps) {
  return (
    <img
      src={language === 'python' ? iconPython : iconCpp}
      alt=""
      style={{ width: size, height: size }}
      className={`inline-block object-contain ${className}`}
    />
  );
}
