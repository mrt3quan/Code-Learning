import type { MasteryTier } from '../hooks/useProgress';
import type { Track } from '../data/lessons';

interface HomeScreenProps {
  track: Track;
  isLessonUnlocked: (lessonId: string) => boolean;
  isLessonCompleted: (lessonId: string) => boolean;
  getMastery: (lessonId: string) => MasteryTier | null;
  onSelectLesson: (lessonId: string) => void;
  showPathChoiceCta: boolean;
  onChoosePath: () => void;
  onBackToFoundations?: () => void;
}

const MASTERY_LABEL: Record<MasteryTier, string> = {
  mastered: 'Mastered — solved first try',
  practiced: 'Practiced — solved after a retry or two',
  'needs-review': 'Needs review — took several tries',
};

const MASTERY_STARS: Record<MasteryTier, number> = {
  mastered: 3,
  practiced: 2,
  'needs-review': 1,
};

function MasteryBadge({ tier }: { tier: MasteryTier }) {
  const filled = MASTERY_STARS[tier];
  return (
    <span
      title={MASTERY_LABEL[tier]}
      className="text-xs tracking-tight text-amber-500 dark:text-amber-400"
    >
      {'★'.repeat(filled)}
      <span className="text-slate-300 dark:text-slate-600">
        {'★'.repeat(3 - filled)}
      </span>
    </span>
  );
}

export default function HomeScreen({
  track,
  isLessonUnlocked,
  isLessonCompleted,
  getMastery,
  onSelectLesson,
  showPathChoiceCta,
  onChoosePath,
  onBackToFoundations,
}: HomeScreenProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {onBackToFoundations && (
        <button
          type="button"
          onClick={onBackToFoundations}
          className="mb-4 text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        >
          ← Programming Foundations
        </button>
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          {track.title}
        </h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">{track.subtitle}</p>
      </div>

      <ol className="flex flex-col gap-3">
        {track.lessons.map((lesson) => {
          const unlocked = isLessonUnlocked(lesson.id);
          const completed = isLessonCompleted(lesson.id);
          const mastery = getMastery(lesson.id);

          return (
            <li key={lesson.id}>
              <button
                type="button"
                disabled={!unlocked}
                onClick={() => onSelectLesson(lesson.id)}
                className={`flex w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left transition ${
                  unlocked
                    ? 'cursor-pointer border-slate-200 bg-white shadow-sm hover:border-violet-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-violet-500'
                    : 'cursor-not-allowed border-slate-200 bg-slate-50 opacity-60 dark:border-slate-800 dark:bg-slate-900/50'
                }`}
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg font-semibold ${
                    completed
                      ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400'
                      : unlocked
                        ? 'bg-violet-100 text-violet-600 dark:bg-violet-900 dark:text-violet-300'
                        : 'bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600'
                  }`}
                >
                  {completed ? '✅' : unlocked ? lesson.order : '🔒'}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
                    {lesson.title}
                    {mastery && <MasteryBadge tier={mastery} />}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {completed
                      ? 'Completed'
                      : unlocked
                        ? `+${lesson.xpReward} XP`
                        : 'Locked'}
                  </div>
                </div>

                {unlocked && !completed && (
                  <span className="text-violet-600 dark:text-violet-400">Start →</span>
                )}
                {completed && (
                  <span className="text-emerald-600 dark:text-emerald-400">Review →</span>
                )}
              </button>
            </li>
          );
        })}
      </ol>

      {showPathChoiceCta && (
        <button
          type="button"
          onClick={onChoosePath}
          className="animate-pop-in mt-6 flex w-full items-center justify-between rounded-2xl border border-violet-300 bg-violet-50 px-5 py-4 text-left transition hover:border-violet-400 hover:bg-violet-100 dark:border-violet-700 dark:bg-violet-950 dark:hover:bg-violet-900"
        >
          <div>
            <div className="font-semibold text-violet-800 dark:text-violet-200">
              🎉 Foundations complete — choose your path
            </div>
            <div className="text-sm text-violet-600 dark:text-violet-400">
              Pick a specialization to keep going.
            </div>
          </div>
          <span className="text-violet-700 dark:text-violet-300">Choose →</span>
        </button>
      )}
    </div>
  );
}
