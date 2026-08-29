interface HeaderProps {
  xp: number;
  currentLessonTitle: string | null;
}

export default function Header({ xp, currentLessonTitle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-900 text-white">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 font-bold">
            C
          </div>
          <span className="font-semibold tracking-tight">CodeQuest</span>
        </div>

        <div className="flex items-center gap-4 text-sm">
          {currentLessonTitle && (
            <span className="hidden text-slate-300 sm:inline">
              {currentLessonTitle}
            </span>
          )}
          <div className="flex items-center gap-1.5 rounded-full bg-amber-400/10 px-3 py-1 font-semibold text-amber-300">
            <span aria-hidden>⭐</span>
            <span>{xp} XP</span>
          </div>
        </div>
      </div>
    </header>
  );
}
