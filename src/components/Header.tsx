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
    <header className="sticky top-0 z-30 border-b border-parchment-200 bg-parchment-50/90 backdrop-blur-xl dark:border-pine-800 dark:bg-pine-950/90">
      <div className="flex min-h-16 items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onOpenMenu}
            aria-label="Open menu"
            className="rounded-xl border border-parchment-200 bg-parchment-50 p-2 text-moss-700 shadow-sm transition hover:bg-parchment-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-robot-cyan-500 dark:border-pine-700 dark:bg-pine-900 dark:text-parchment-300 dark:hover:bg-pine-800 md:hidden"
          >
            <Menu size={19} />
          </button>

          <div className="min-w-0">
            <div className="font-display truncate text-sm font-bold text-pine-900 dark:text-parchment-100">
              {currentLessonTitle ?? 'Python Learning Trail'}
            </div>
            <div className="hidden text-xs text-moss-700/80 dark:text-parchment-400 sm:block">
              Learn the idea → practice it → build something
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm sm:gap-3">
          <div className="hidden items-center gap-2.5 rounded-2xl border border-parchment-200 bg-parchment-100/70 px-2.5 py-1.5 dark:border-pine-700 dark:bg-pine-900 sm:flex">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-dawn-sand-300 to-robot-cyan-500 text-sm font-black text-pine-950 shadow-sm ring-2 ring-parchment-50 dark:ring-pine-900">
              {level}
            </div>
            <div className="w-28 lg:w-36">
              <div className="mb-1 flex items-center justify-between text-[10px] font-semibold uppercase tracking-wide text-moss-700/80 dark:text-parchment-400">
                <span>Level {level}</span>
                <span>{xpIntoLevel}/{xpForNextLevel}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-parchment-200 dark:bg-pine-700">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-dawn-sand-400 to-robot-cyan-500 transition-[width] duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>

          {streak > 0 && (
            <div
              className="flex items-center gap-1.5 rounded-xl bg-bloom-coral-50 px-2.5 py-2 font-bold text-bloom-coral-700 dark:bg-bloom-coral-900/40 dark:text-bloom-coral-300"
              title={`${streak} day streak`}
            >
              <Flame size={15} className="fill-current" aria-hidden="true" />
              <span>{streak}</span>
              <span className="hidden text-xs font-semibold sm:inline">day</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 rounded-xl bg-robot-cyan-50 px-2.5 py-2 font-bold text-robot-cyan-700 dark:bg-robot-cyan-900/30 dark:text-robot-cyan-300">
            <Zap size={15} className="fill-current" aria-hidden="true" />
            <span>{xp}</span>
            <span className="hidden text-xs font-semibold sm:inline">XP</span>
          </div>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-parchment-200 bg-parchment-50 text-moss-700 shadow-sm transition hover:bg-parchment-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-robot-cyan-500 dark:border-pine-700 dark:bg-pine-900 dark:text-parchment-300 dark:hover:bg-pine-800"
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </div>
    </header>
  );
}
