import { ArrowRight, CheckCircle2, CircleDot, Compass, LockKeyhole, MapPin } from 'lucide-react';
import { getExplanationActivity, type Track } from '../data/lessons';
import { achievements } from '../data/achievements';
import { Mascot } from './Mascot';
import TrackIcon from './TrackIcon';
import LearningMapCard from './LearningMapCard';
import bgFloatingIslands from '../assets/bg-floating-islands.png';

interface DashboardScreenProps {
  activeTrack: Track;
  isLessonUnlocked: (lessonId: string) => boolean;
  isLessonCompleted: (lessonId: string) => boolean;
  onSelectLesson: (lessonId: string) => void;
  unlockedAchievementIds: string[];
  isFoundationsComplete: boolean;
}

export default function DashboardScreen({
  activeTrack,
  isLessonUnlocked,
  isLessonCompleted,
  onSelectLesson,
  unlockedAchievementIds,
  isFoundationsComplete,
}: DashboardScreenProps) {
  const nextLesson = activeTrack.lessons.find(
    (l) => isLessonUnlocked(l.id) && !isLessonCompleted(l.id),
  );
  const completedCount = activeTrack.lessons.filter((l) => isLessonCompleted(l.id)).length;
  const progressPct = Math.round((completedCount / activeTrack.lessons.length) * 100);
  const recentAchievementId = unlockedAchievementIds[unlockedAchievementIds.length - 1];
  const recentAchievement = achievements.find((a) => a.id === recentAchievementId);
  const stage = isFoundationsComplete ? 2 : 1;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      <section className="relative overflow-hidden rounded-[28px] border border-moss-200 shadow-xl shadow-moss-900/10 dark:border-moss-800/50">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-[center_35%]"
          style={{ backgroundImage: `url(${bgFloatingIslands})` }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-parchment-50/95 via-parchment-50/78 to-transparent dark:from-pine-950/93 dark:via-pine-950/78 dark:to-pine-950/15"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-parchment-50/45 via-transparent to-transparent dark:from-pine-950/45"
        />

        <div className="relative grid items-center gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_300px]">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-moss-300/60 bg-parchment-50/85 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-moss-800 backdrop-blur dark:border-moss-700/50 dark:bg-pine-900/70 dark:text-moss-200">
              <Compass size={14} /> Python Trail · Stage {stage} of 2
            </div>
            <h1 className="font-display max-w-3xl text-3xl font-bold tracking-tight text-pine-900 sm:text-4xl dark:text-parchment-50">
              {isFoundationsComplete
                ? 'Build stronger Python before your AI path.'
                : 'Learn Python by doing, not by reading walls of text.'}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-moss-800/80 sm:text-base dark:text-parchment-300">
              Short explanations, runnable examples, instant feedback, and projects that turn each concept into something you can actually use.
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              <div className="flex items-center gap-2 rounded-xl border border-moss-200/70 bg-parchment-50/85 px-3 py-2 text-sm backdrop-blur dark:border-moss-700/40 dark:bg-pine-900/60">
                <CheckCircle2 size={16} className="text-moss-600 dark:text-moss-300" />
                <span className="font-semibold text-pine-900 dark:text-parchment-100">
                  {completedCount}/{activeTrack.lessons.length} lessons complete
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-moss-200/70 bg-parchment-50/85 px-3 py-2 text-sm backdrop-blur dark:border-moss-700/40 dark:bg-pine-900/60">
                <CircleDot size={16} className="text-dawn-sand-600 dark:text-dawn-sand-300" />
                <span className="font-semibold text-pine-900 dark:text-parchment-100">
                  {progressPct}% through this stage
                </span>
              </div>
            </div>

            {nextLesson && (
              <button
                type="button"
                onClick={() => onSelectLesson(nextLesson.id)}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-robot-cyan-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-robot-cyan-900/20 transition hover:-translate-y-0.5 hover:bg-robot-cyan-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-robot-cyan-300 focus-visible:ring-offset-2"
              >
                Continue: {nextLesson.title}
                <ArrowRight size={17} />
              </button>
            )}
          </div>

          <div className="relative mx-auto flex min-h-48 w-full max-w-[280px] items-end justify-center lg:min-h-56">
            <div className="absolute inset-x-5 bottom-2 h-16 rounded-[50%] bg-robot-cyan-300/25 blur-2xl" />
            <Mascot variant="wave-platform" size={235} className="relative drop-shadow-2xl" />
            <div className="absolute bottom-1 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full border border-dawn-sand-300/80 bg-parchment-50/90 px-2.5 py-1 text-[11px] font-bold text-dawn-sand-800 shadow-sm backdrop-blur dark:border-dawn-sand-700/60 dark:bg-pine-900/85 dark:text-dawn-sand-200">
              <MapPin size={12} className="fill-current" /> You are here
            </div>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
        <section className="min-w-0">
          <div className="mb-3 flex items-end justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.16em] text-moss-700 dark:text-moss-400">
                Your route
              </div>
              <h2 className="font-display mt-1 text-xl font-bold tracking-tight text-pine-900 dark:text-parchment-50">
                {activeTrack.title}
              </h2>
            </div>
            <span className="hidden rounded-full bg-parchment-100 px-3 py-1 text-xs font-semibold text-moss-700 dark:bg-pine-800 dark:text-parchment-400 sm:inline">
              {completedCount} complete · {activeTrack.lessons.length - completedCount} left
            </span>
          </div>

          <LearningMapCard
            track={activeTrack}
            isLessonUnlocked={isLessonUnlocked}
            isLessonCompleted={isLessonCompleted}
            onSelectLesson={onSelectLesson}
          />
        </section>

        <aside className="flex flex-col gap-4">
          <div className="rounded-2xl border border-parchment-200 bg-parchment-50 p-5 shadow-sm dark:border-pine-800 dark:bg-pine-900">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.14em] text-moss-600 dark:text-parchment-500">
                  Current stage
                </div>
                <h3 className="font-display mt-1 font-bold text-pine-900 dark:text-parchment-50">
                  {activeTrack.title}
                </h3>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-moss-100 to-robot-cyan-100 dark:from-moss-800/40 dark:to-robot-cyan-900/30">
                <TrackIcon language="python" size={36} />
              </div>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-moss-700 dark:text-parchment-400">
              <span>Course progress</span>
              <span>{progressPct}%</span>
            </div>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-parchment-200 dark:bg-pine-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-moss-500 to-robot-cyan-500 transition-[width] duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-parchment-200 bg-parchment-50 p-5 shadow-sm dark:border-pine-800 dark:bg-pine-900">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-display font-bold text-pine-900 dark:text-parchment-50">
                Continue Learning
              </h3>
              {nextLesson && (
                <span className="rounded-full bg-dawn-sand-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-dawn-sand-800 dark:bg-dawn-sand-900/30 dark:text-dawn-sand-300">
                  Next
                </span>
              )}
            </div>

            {nextLesson ? (
              <>
                <div className="rounded-xl bg-parchment-100 p-3.5 dark:bg-pine-800/70">
                  <div className="text-sm font-bold text-pine-900 dark:text-parchment-50">{nextLesson.title}</div>
                  <p className="mt-1 line-clamp-3 text-xs leading-5 text-moss-700/90 dark:text-parchment-400">
                    {getExplanationActivity(nextLesson)?.text}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectLesson(nextLesson.id)}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-robot-cyan-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-robot-cyan-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-robot-cyan-400 focus-visible:ring-offset-2"
                >
                  Start lesson <ArrowRight size={16} />
                </button>
              </>
            ) : (
              <div className="rounded-xl bg-moss-50 p-4 text-sm font-semibold text-moss-700 dark:bg-moss-900/20 dark:text-moss-300">
                🎉 This stage is complete. Great work.
              </div>
            )}
          </div>

          {recentAchievement ? (
            <div className="rounded-2xl border border-dawn-sand-200 bg-gradient-to-br from-dawn-sand-50 to-bloom-coral-50 p-5 shadow-sm dark:border-dawn-sand-800/40 dark:from-dawn-sand-900/20 dark:to-bloom-coral-900/10">
              <div className="text-xs font-bold uppercase tracking-[0.14em] text-dawn-sand-800 dark:text-dawn-sand-300">
                Latest achievement
              </div>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-parchment-50 text-2xl shadow-sm dark:bg-pine-900">
                  {recentAchievement.icon}
                </div>
                <div>
                  <div className="text-sm font-bold text-pine-900 dark:text-parchment-50">
                    {recentAchievement.title}
                  </div>
                  <div className="mt-0.5 text-xs leading-5 text-moss-700/90 dark:text-parchment-400">
                    {recentAchievement.description}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-parchment-300 bg-parchment-50/60 p-5 dark:border-pine-700 dark:bg-pine-900/50">
              <div className="flex items-center gap-3">
                <LockKeyhole className="text-moss-500 dark:text-parchment-500" size={20} />
                <p className="text-sm text-moss-700/90 dark:text-parchment-400">
                  Finish your first lesson to unlock your first achievement.
                </p>
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-dusk-lavender-200 bg-dusk-lavender-50 p-5 dark:border-dusk-lavender-800/50 dark:bg-dusk-lavender-900/20">
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-dusk-lavender-700 dark:text-dusk-lavender-300">
              Distant peaks
            </div>
            <div className="font-display mt-2 text-sm font-bold text-pine-900 dark:text-parchment-50">
              Next phase: Data & AI
            </div>
            <p className="mt-1 text-xs leading-5 text-dusk-lavender-800/80 dark:text-dusk-lavender-200/80">
              After strong Python fundamentals, the course can expand into data, machine learning, neural networks, and LLM applications.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
