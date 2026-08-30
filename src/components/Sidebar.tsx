import {
  LayoutDashboard,
  Map as MapIcon,
  BookOpen,
  Target,
  Rocket,
  Trophy,
  X,
  Compass,
  type LucideIcon,
} from 'lucide-react';
import { Mascot } from './Mascot';

export type NavKey =
  | 'dashboard'
  | 'map'
  | 'lessons'
  | 'challenges'
  | 'projects'
  | 'achievements';

const NAV_ITEMS: { key: NavKey; label: string; icon: LucideIcon }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'map', label: 'Learning Map', icon: MapIcon },
  { key: 'lessons', label: 'Lessons', icon: BookOpen },
  { key: 'challenges', label: 'Challenges', icon: Target },
  { key: 'projects', label: 'Projects', icon: Rocket },
  { key: 'achievements', label: 'Achievements', icon: Trophy },
];

interface SidebarProps {
  active: NavKey;
  onNavigate: (key: NavKey) => void;
  onClose?: () => void;
}

export default function Sidebar({ active, onNavigate, onClose }: SidebarProps) {
  return (
    <aside className="relative flex h-full w-64 shrink-0 flex-col overflow-hidden border-r border-pine-800 bg-gradient-to-b from-pine-900 to-pine-950 px-3 py-4 text-parchment-100 shadow-2xl shadow-pine-950/40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_20%_-10%,rgb(47_79_56_/_0.35),transparent_65%)]"
      />

      <div className="relative flex items-center justify-between px-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-dawn-sand-400 to-moss-500 text-pine-950 shadow-lg shadow-pine-950/40">
            <Compass size={19} strokeWidth={2.25} />
          </div>
          <div>
            <div className="font-display text-base font-bold tracking-tight text-parchment-50">
              CodeQuest
            </div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-robot-cyan-300">
              Python Trail
            </div>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-lg p-1.5 text-parchment-400 transition hover:bg-white/10 hover:text-parchment-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-robot-cyan-400 md:hidden"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="relative mx-2 mt-5 rounded-xl border border-moss-700/60 bg-moss-900/40 px-3 py-2.5">
        <div className="flex items-center gap-2 text-xs font-semibold text-dawn-sand-200">
          <Compass size={14} className="shrink-0" />
          Learn Python → build with AI
        </div>
      </div>

      <nav className="relative mt-5 flex flex-1 flex-col gap-1" aria-label="Main navigation">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onNavigate(item.key)}
              aria-current={isActive ? 'page' : undefined}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-robot-cyan-400 ${
                isActive
                  ? 'bg-dawn-sand-400 text-pine-950 shadow-lg shadow-pine-950/30'
                  : 'text-parchment-300 hover:bg-white/5 hover:text-parchment-50'
              }`}
            >
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-lg transition ${
                  isActive ? 'bg-pine-950/15' : 'bg-white/5 group-hover:bg-white/10'
                }`}
              >
                <Icon size={16} strokeWidth={2} aria-hidden="true" />
              </span>
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="relative mt-4 overflow-hidden rounded-2xl border border-pine-700 bg-pine-800/70 p-3.5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-robot-cyan-500/15">
            <Mascot size={38} variant="head" />
          </div>
          <div>
            <div className="text-xs font-bold text-parchment-50">Keep building.</div>
            <p className="mt-0.5 text-[11px] leading-relaxed text-parchment-400">
              Short lessons now. Real Python skills later.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
