import { Menu, Flame, Sun, Moon, Zap } from 'lucide-react';
import type { Theme } from '../hooks/useTheme';

interface HeaderProps {
  xp: number;
  streak: number;
  currentLessonTitle: string | null;
  theme: Theme;
  onToggleTheme: () => void;
  onOpenMenu: () => void;
}

function levelFromXp(xp: number) {
  const level = Math.floor(xp / 100) + 1;
  const xpIntoLevel = xp % 100;
  return { level, xpIntoLevel, xpForNextLevel: 100 };
}

export default function Header({
  xp,
  streak,
  currentLessonTitle,
  theme,
  onToggleTheme,
  onOpenMenu,
}: HeaderProps) {
  const { level, xpIntoLevel, xpForNextLevel } = levelFromXp(xp);
  const progressPct = Math.round((xpIntoLevel / xpForNextLevel) * 100);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/85">
      <div className="flex min-h-16 items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onOpenMenu}
            aria-label="Open menu"
            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 md:hidden"
          >
            <Menu size={19} />
          </button>

          <div className="min-w-0">
            <div className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">
              {currentLessonTitle ?? 'Python Learning Journey'}
            </div>
            <div className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">
              Learn the idea → practice it → build something
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm sm:gap-3">
          <div className="hidden items-center gap-2.5 rounded-2xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 dark:border-slate-700 dark:bg-slate-900 sm:flex">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-300 to-orange-400 text-sm font-black text-amber-950 shadow-sm">
              {level}
            </div>
            <div className="w-28 lg:w-36">
              <div className="mb-1 flex items-center justify-between text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                <span>Level {level}</span>
                <span>{xpIntoLevel}/{xpForNextLevel}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-400 transition-[width] duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>

          {streak > 0 && (
            <div
              className="flex items-center gap-1.5 rounded-xl bg-orange-50 px-2.5 py-2 font-bold text-orange-600 dark:bg-orange-400/10 dark:text-orange-300"
              title={`${streak} day streak`}
            >
              <Flame size={15} className="fill-current" aria-hidden="true" />
              <span>{streak}</span>
              <span className="hidden text-xs font-semibold sm:inline">day</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 rounded-xl bg-violet-50 px-2.5 py-2 font-bold text-violet-700 dark:bg-violet-400/10 dark:text-violet-300">
            <Zap size={15} className="fill-current" aria-hidden="true" />
            <span>{xp}</span>
            <span className="hidden text-xs font-semibold sm:inline">XP</span>
          </div>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </div>
    </header>
  );
}
