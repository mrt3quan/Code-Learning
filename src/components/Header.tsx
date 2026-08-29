import type { Theme } from '../hooks/useTheme';

interface HeaderProps {
  xp: number;
  streak: number;
  achievementCount: number;
  currentLessonTitle: string | null;
  theme: Theme;
  onToggleTheme: () => void;
  onOpenAchievements: () => void;
}

export default function Header({
  xp,
  streak,
  achievementCount,
  currentLessonTitle,
  theme,
  onToggleTheme,
  onOpenAchievements,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-900 text-white">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 font-bold">
            C
          </div>
          <span className="font-semibold tracking-tight">CodeQuest</span>
        </div>

        <div className="flex items-center gap-2 text-sm sm:gap-4">
          {currentLessonTitle && (
            <span className="hidden text-slate-300 sm:inline">
              {currentLessonTitle}
            </span>
          )}

          {streak > 0 && (
            <div className="flex items-center gap-1.5 rounded-full bg-orange-400/10 px-3 py-1 font-semibold text-orange-300">
              <span aria-hidden>🔥</span>
              <span>{streak}</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 rounded-full bg-amber-400/10 px-3 py-1 font-semibold text-amber-300">
            <span aria-hidden>⭐</span>
            <span>{xp} XP</span>
          </div>

          <button
            type="button"
            onClick={onOpenAchievements}
            aria-label={`Achievements (${achievementCount} unlocked)`}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-300 hover:bg-white/10"
          >
            🏆
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-300 hover:bg-white/10"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  );
}
