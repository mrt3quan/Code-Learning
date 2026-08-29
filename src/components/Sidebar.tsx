import { Mascot } from './Mascot';

export type NavKey =
  | 'dashboard'
  | 'map'
  | 'lessons'
  | 'challenges'
  | 'projects'
  | 'achievements'
  | 'community'
  | 'store';

const NAV_ITEMS: { key: NavKey; label: string; icon: string }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: '🏠' },
  { key: 'map', label: 'Map', icon: '🗺️' },
  { key: 'lessons', label: 'Lessons', icon: '📚' },
  { key: 'challenges', label: 'Challenges', icon: '🎯' },
  { key: 'projects', label: 'Projects', icon: '🚀' },
  { key: 'achievements', label: 'Achievements', icon: '🏆' },
  { key: 'community', label: 'Community', icon: '👥' },
  { key: 'store', label: 'Store', icon: '🛍️' },
];

interface SidebarProps {
  active: NavKey;
  onNavigate: (key: NavKey) => void;
  onClose?: () => void;
}

export default function Sidebar({ active, onNavigate, onClose }: SidebarProps) {
  return (
    <div className="flex h-full w-64 shrink-0 flex-col bg-slate-900 px-3 py-4 text-white">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 font-bold">
            C
          </div>
          <span className="font-semibold tracking-tight">CodeQuest</span>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-md p-1 text-slate-400 hover:bg-white/10 hover:text-white md:hidden"
          >
            ✕
          </button>
        )}
      </div>

      <nav className="mt-6 flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => onNavigate(item.key)}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
              active === item.key
                ? 'bg-violet-600 text-white'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span aria-hidden>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-4 rounded-2xl bg-slate-800 p-3">
        <div className="flex items-start gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-violet-300">
            <Mascot size={22} />
          </div>
          <p className="text-xs leading-relaxed text-slate-300">
            Keep going! Every lesson gets you closer to shipping real code.
          </p>
        </div>
      </div>
    </div>
  );
}
