import type { Track } from '../data/lessons';
import { achievements } from '../data/achievements';
import { MascotTip } from './Mascot';
import LearningMapCard from './LearningMapCard';

interface DashboardScreenProps {
  activeTrack: Track;
  isLessonUnlocked: (lessonId: string) => boolean;
  isLessonCompleted: (lessonId: string) => boolean;
  onSelectLesson: (lessonId: string) => void;
  showPathChoiceCta: boolean;
  onChoosePath: () => void;
  unlockedAchievementIds: string[];
}

export default function DashboardScreen({
  activeTrack,
  isLessonUnlocked,
  isLessonCompleted,
  onSelectLesson,
  showPathChoiceCta,
  onChoosePath,
  unlockedAchievementIds,
}: DashboardScreenProps) {
  const nextLesson = activeTrack.lessons.find(
    (l) => isLessonUnlocked(l.id) && !isLessonCompleted(l.id),
  );
  const completedCount = activeTrack.lessons.filter((l) => isLessonCompleted(l.id)).length;
  const progressPct = Math.round((completedCount / activeTrack.lessons.length) * 100);

  const recentAchievementId = unlockedAchievementIds[unlockedAchievementIds.length - 1];
  const recentAchievement = achievements.find((a) => a.id === recentAchievementId);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <MascotTip
        className="mb-6"
        message="Keep going! Every lesson gets you closer to shipping real code. 🚀"
      />

      {showPathChoiceCta && (
        <button
          type="button"
          onClick={onChoosePath}
          className="animate-pop-in mb-6 flex w-full items-center justify-between rounded-2xl border border-violet-300 bg-violet-50 px-5 py-4 text-left transition hover:border-violet-400 hover:bg-violet-100 dark:border-violet-700 dark:bg-violet-950 dark:hover:bg-violet-900"
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

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          <h1 className="mb-4 text-xl font-bold text-slate-900 dark:text-slate-50">
            Your Learning Map
          </h1>
          <LearningMapCard
            track={activeTrack}
            isLessonUnlocked={isLessonUnlocked}
            isLessonCompleted={isLessonCompleted}
            onSelectLesson={onSelectLesson}
          />
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold text-slate-900 dark:text-slate-100">
                Continue Learning
              </h2>
              {nextLesson && (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
                  Next
                </span>
              )}
            </div>

            {nextLesson ? (
              <>
                <div className="font-medium text-slate-800 dark:text-slate-200">
                  {nextLesson.title}
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                  {nextLesson.explanation}
                </p>
                <div className="mt-3 text-xs text-emerald-600 dark:text-emerald-400">
                  {progressPct}% Complete
                </div>
                <div className="mt-1 mb-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => onSelectLesson(nextLesson.id)}
                  className="w-full rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
                >
                  Continue Lesson
                </button>
              </>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                🎉 Every lesson in this track is complete!
              </p>
            )}
          </div>

          {recentAchievement && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
              <h2 className="mb-3 font-semibold text-slate-900 dark:text-slate-100">
                Recent Achievement
              </h2>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-xl dark:bg-amber-400/10">
                  {recentAchievement.icon}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {recentAchievement.title}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {recentAchievement.description}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
