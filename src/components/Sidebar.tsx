import {
  LayoutDashboard,
  Map as MapIcon,
  BookOpen,
  Target,
  Rocket,
  Trophy,
  X,
  Sparkles,
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
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-white/5 bg-[#111827] px-3 py-4 text-white shadow-2xl shadow-slate-950/10">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-violet-500 to-sky-500 shadow-lg shadow-violet-950/30">
            <span className="font-mono text-sm font-black tracking-tight">&lt;/&gt;</span>
          </div>
          <div>
            <div className="font-bold tracking-tight">CodeQuest</div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-300/80">
              Python Journey
            </div>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white md:hidden"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="mx-2 mt-5 rounded-xl border border-sky-400/10 bg-gradient-to-br from-violet-500/10 to-sky-400/10 px-3 py-2.5">
        <div className="flex items-center gap-2 text-xs font-semibold text-sky-200">
          <Sparkles size={14} />
          Learn Python → build with AI
        </div>
      </div>

      <nav className="mt-5 flex flex-1 flex-col gap-1" aria-label="Main navigation">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onNavigate(item.key)}
              aria-current={isActive ? 'page' : undefined}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                isActive
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-950/20'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-lg transition ${
                  isActive ? 'bg-white/10' : 'bg-white/5 group-hover:bg-white/10'
                }`}
              >
                <Icon size={16} strokeWidth={2} aria-hidden="true" />
              </span>
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800 to-slate-900 p-3.5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-violet-500/15">
            <Mascot size={38} variant="head" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Keep building.</div>
            <p className="mt-0.5 text-[11px] leading-relaxed text-slate-400">
              Short lessons now. Real Python skills later.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
