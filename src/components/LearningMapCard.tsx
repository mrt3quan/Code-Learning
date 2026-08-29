import type { Track } from '../data/lessons';

interface LearningMapCardProps {
  track: Track;
  isLessonUnlocked: (lessonId: string) => boolean;
  isLessonCompleted: (lessonId: string) => boolean;
  onSelectLesson: (lessonId: string) => void;
}

export default function LearningMapCard({
  track,
  isLessonUnlocked,
  isLessonCompleted,
  onSelectLesson,
}: LearningMapCardProps) {
  const nextLesson = track.lessons.find(
    (l) => isLessonUnlocked(l.id) && !isLessonCompleted(l.id),
  );

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-sky-50 to-emerald-50 p-6 dark:border-slate-800 dark:from-slate-800 dark:to-slate-900">
      {/* Soft decorative backdrop — evokes the "adventure map" feel without any external art assets. */}
      <div className="pointer-events-none absolute -top-8 -left-8 h-32 w-32 rounded-full bg-sky-200/50 blur-2xl dark:bg-sky-500/10" />
      <div className="pointer-events-none absolute -right-6 -bottom-10 h-36 w-36 rounded-full bg-emerald-200/50 blur-2xl dark:bg-emerald-500/10" />

      <div className="relative mb-6 flex justify-center">
        <span className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-slate-800 shadow-sm dark:bg-slate-800 dark:text-slate-100">
          {track.language === 'python' ? '🐍' : '🎮'} {track.title}
        </span>
      </div>

      <div className="relative flex items-start overflow-x-auto pb-2">
        {track.lessons.map((lesson, i) => {
          const unlocked = isLessonUnlocked(lesson.id);
          const completed = isLessonCompleted(lesson.id);
          const isNext = nextLesson?.id === lesson.id;

          return (
            <div key={lesson.id} className="flex items-start">
              <button
                type="button"
                disabled={!unlocked}
                onClick={() => onSelectLesson(lesson.id)}
                className="flex w-20 shrink-0 flex-col items-center gap-1.5 disabled:cursor-not-allowed"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-semibold shadow-sm ring-4 ${
                    completed
                      ? 'bg-emerald-500 text-white ring-emerald-100 dark:ring-emerald-900'
                      : unlocked
                        ? `bg-violet-600 text-white ${isNext ? 'ring-violet-200 dark:ring-violet-900' : 'ring-white dark:ring-slate-800'}`
                        : 'bg-slate-200 text-slate-400 ring-white dark:bg-slate-700 dark:text-slate-500 dark:ring-slate-800'
                  }`}
                >
                  {completed ? '✓' : unlocked ? lesson.order : '🔒'}
                </div>
                <span className="text-center text-xs leading-tight font-medium text-slate-600 dark:text-slate-300">
                  {lesson.title}
                </span>
              </button>

              {i < track.lessons.length - 1 && (
                <div className="mt-6 h-0.5 w-6 shrink-0 border-t-2 border-dashed border-emerald-300 dark:border-slate-600" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
