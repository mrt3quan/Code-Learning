import { tracks } from '../data/lessons';

interface ProjectsScreenProps {
  isLessonUnlocked: (lessonId: string) => boolean;
  isLessonCompleted: (lessonId: string) => boolean;
  onSelectLesson: (lessonId: string) => void;
}

export default function ProjectsScreen({
  isLessonUnlocked,
  isLessonCompleted,
  onSelectLesson,
}: ProjectsScreenProps) {
  const projects = tracks.flatMap((track) =>
    track.lessons.filter((l) => l.isProject).map((lesson) => ({ track, lesson })),
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Projects</h1>
      <p className="mt-1 text-slate-500 dark:text-slate-400">
        Small projects that pull a track's lessons together into one program.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {projects.map(({ track, lesson }) => {
          const unlocked = isLessonUnlocked(lesson.id);
          const completed = isLessonCompleted(lesson.id);
          return (
            <button
              key={lesson.id}
              type="button"
              disabled={!unlocked}
              onClick={() => onSelectLesson(lesson.id)}
              className={`rounded-2xl border p-5 text-left transition ${
                unlocked
                  ? 'cursor-pointer border-slate-200 bg-white shadow-sm hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-violet-500'
                  : 'cursor-not-allowed border-slate-200 bg-slate-50 opacity-60 dark:border-slate-800 dark:bg-slate-900/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{track.language === 'python' ? '🐍' : '🎮'}</span>
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
                  +{lesson.xpReward} XP
                </span>
              </div>
              <div className="mt-3 font-semibold text-slate-900 dark:text-slate-100">
                {lesson.title.replace(/^Project:\s*/, '')}
              </div>
              <p className="mt-1 line-clamp-3 text-sm text-slate-500 dark:text-slate-400">
                {lesson.explanation}
              </p>
              <div className="mt-3 text-sm font-semibold">
                {completed ? (
                  <span className="text-emerald-600 dark:text-emerald-400">✅ Completed</span>
                ) : unlocked ? (
                  <span className="text-violet-600 dark:text-violet-400">Start →</span>
                ) : (
                  <span className="text-slate-400 dark:text-slate-500">🔒 Locked</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {projects.length === 0 && (
        <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">No projects yet.</p>
      )}
    </div>
  );
}
