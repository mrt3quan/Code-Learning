import { Menu, Flame, Star, Sun, Moon } from 'lucide-react';
import type { Theme } from '../hooks/useTheme';

interface HeaderProps {
  xp: number;
  streak: number;
  currentLessonTitle: string | null;
  theme: Theme;
  onToggleTheme: () => void;
  onOpenMenu: () => void;
}

// Level is a plain, honest function of real XP earned — not a fabricated
// stat — 100 XP per level, same shape as the mockup's hex badge + bar.
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
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onOpenMenu}
            aria-label="Open menu"
            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10 md:hidden"
          >
            <Menu size={20} />
          </button>
          {currentLessonTitle && (
            <span className="truncate text-sm font-medium text-slate-600 dark:text-slate-300">
              {currentLessonTitle}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm sm:gap-3">
          <div className="hidden items-center gap-2 sm:flex">
            <div className="flex h-8 w-8 items-center justify-center bg-amber-400 text-xs font-bold text-amber-950 [clip-path:polygon(25%_0%,75%_0%,100%_50%,75%_100%,25%_100%,0%_50%)]">
              {level}
            </div>
            <div className="w-28">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className="h-full rounded-full bg-amber-400"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">
                {xpIntoLevel}/{xpForNextLevel} XP
              </div>
            </div>
          </div>

          {streak > 0 && (
            <div className="flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 font-semibold text-orange-600 dark:bg-orange-400/10 dark:text-orange-300">
              <Flame size={14} className="fill-current" aria-hidden="true" />
              <span>{streak}</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 rounded-full bg-violet-100 px-3 py-1 font-semibold text-violet-700 dark:bg-violet-400/10 dark:text-violet-300">
            <Star size={14} className="fill-current" aria-hidden="true" />
            <span>{xp} XP</span>
          </div>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}
