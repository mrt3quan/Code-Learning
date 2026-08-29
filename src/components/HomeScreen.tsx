import { lessons } from '../data/lessons';

interface HomeScreenProps {
  isLessonUnlocked: (lessonId: string) => boolean;
  isLessonCompleted: (lessonId: string) => boolean;
  onSelectLesson: (lessonId: string) => void;
}

export default function HomeScreen({
  isLessonUnlocked,
  isLessonCompleted,
  onSelectLesson,
}: HomeScreenProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Programming Foundations
        </h1>
        <p className="mt-1 text-slate-500">
          Learn Python one bite-sized lesson at a time.
        </p>
      </div>

      <ol className="flex flex-col gap-3">
        {lessons.map((lesson) => {
          const unlocked = isLessonUnlocked(lesson.id);
          const completed = isLessonCompleted(lesson.id);

          return (
            <li key={lesson.id}>
              <button
                type="button"
                disabled={!unlocked}
                onClick={() => onSelectLesson(lesson.id)}
                className={`flex w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left transition ${
                  unlocked
                    ? 'cursor-pointer border-slate-200 bg-white shadow-sm hover:border-violet-300 hover:shadow-md'
                    : 'cursor-not-allowed border-slate-200 bg-slate-50 opacity-60'
                }`}
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg font-semibold ${
                    completed
                      ? 'bg-emerald-100 text-emerald-600'
                      : unlocked
                        ? 'bg-violet-100 text-violet-600'
                        : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {completed ? '✅' : unlocked ? lesson.order : '🔒'}
                </div>

                <div className="flex-1">
                  <div className="font-semibold text-slate-900">
                    {lesson.title}
                  </div>
                  <div className="text-sm text-slate-500">
                    {completed
                      ? 'Completed'
                      : unlocked
                        ? `+${lesson.xpReward} XP`
                        : 'Locked'}
                  </div>
                </div>

                {unlocked && !completed && (
                  <span className="text-violet-600">Start →</span>
                )}
                {completed && (
                  <span className="text-emerald-600">Review →</span>
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
