import { ArrowRight, CheckCircle2, CircleDot, LockKeyhole, Sparkles } from 'lucide-react';
import type { Track } from '../data/lessons';
import { achievements } from '../data/achievements';
import { Mascot } from './Mascot';
import TrackIcon from './TrackIcon';
import LearningMapCard from './LearningMapCard';

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
      <section className="relative overflow-hidden rounded-[28px] border border-violet-200/70 bg-gradient-to-br from-[#17153a] via-[#24205d] to-[#0f6b8b] p-6 text-white shadow-xl shadow-violet-950/10 dark:border-violet-500/20 sm:p-8">
        <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-violet-400/15 blur-3xl" />

        <div className="relative grid items-center gap-6 lg:grid-cols-[1fr_310px]">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-cyan-100 backdrop-blur">
              <Sparkles size={14} /> Python Journey · Stage {stage} of 2
            </div>
            <h1 className="max-w-3xl text-3xl font-black tracking-tight sm:text-4xl">
              {isFoundationsComplete
                ? 'Build stronger Python before your AI path.'
                : 'Learn Python by doing, not by reading walls of text.'}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200 sm:text-base">
              Short explanations, runnable examples, instant feedback, and projects that turn each concept into something you can actually use.
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm backdrop-blur">
                <CheckCircle2 size={16} className="text-emerald-300" />
                <span className="font-semibold">{completedCount}/{activeTrack.lessons.length} lessons complete</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm backdrop-blur">
                <CircleDot size={16} className="text-amber-300" />
                <span className="font-semibold">{progressPct}% through this stage</span>
              </div>
            </div>

            {nextLesson && (
              <button
                type="button"
                onClick={() => onSelectLesson(nextLesson.id)}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 shadow-lg shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-cyan-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
              >
                Continue: {nextLesson.title}
                <ArrowRight size={17} />
              </button>
            )}
          </div>

          <div className="relative mx-auto flex min-h-48 w-full max-w-[310px] items-end justify-center lg:min-h-56">
            <div className="absolute inset-x-5 bottom-2 h-16 rounded-[50%] bg-cyan-300/20 blur-2xl" />
            <Mascot variant="wave-platform" size={255} className="relative drop-shadow-2xl" />
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
        <section className="min-w-0">
          <div className="mb-3 flex items-end justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600 dark:text-violet-400">
                Your route
              </div>
              <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950 dark:text-white">
                {activeTrack.title}
              </h2>
            </div>
            <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400 sm:inline">
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
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Current stage</div>
                <h3 className="mt-1 font-bold text-slate-900 dark:text-white">{activeTrack.title}</h3>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-cyan-100 dark:from-violet-500/15 dark:to-cyan-500/15">
                <TrackIcon language="python" size={36} />
              </div>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span>Course progress</span>
              <span>{progressPct}%</span>
            </div>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-[width] duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white">Continue Learning</h3>
              {nextLesson && (
                <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
                  Next
                </span>
              )}
            </div>

            {nextLesson ? (
              <>
                <div className="rounded-xl bg-slate-50 p-3.5 dark:bg-slate-800/70">
                  <div className="text-sm font-bold text-slate-900 dark:text-white">{nextLesson.title}</div>
                  <p className="mt-1 line-clamp-3 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    {nextLesson.explanation}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectLesson(nextLesson.id)}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2"
                >
                  Start lesson <ArrowRight size={16} />
                </button>
              </>
            ) : (
              <div className="rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                🎉 This stage is complete. Great work.
              </div>
            )}
          </div>

          {recentAchievement ? (
            <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-5 shadow-sm dark:border-amber-700/40 dark:from-amber-500/10 dark:to-orange-500/5">
              <div className="text-xs font-bold uppercase tracking-[0.14em] text-amber-700 dark:text-amber-300">
                Latest achievement
              </div>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm dark:bg-slate-900">
                  {recentAchievement.icon}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">{recentAchievement.title}</div>
                  <div className="mt-0.5 text-xs leading-5 text-slate-500 dark:text-slate-400">{recentAchievement.description}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white/50 p-5 dark:border-slate-700 dark:bg-slate-900/50">
              <div className="flex items-center gap-3">
                <LockKeyhole className="text-slate-400" size={20} />
                <p className="text-sm text-slate-500 dark:text-slate-400">Finish your first lesson to unlock your first achievement.</p>
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5 dark:border-sky-800/60 dark:bg-sky-500/10">
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-sky-700 dark:text-sky-300">Roadmap</div>
            <div className="mt-2 text-sm font-bold text-slate-900 dark:text-white">Next phase: Data & AI</div>
            <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-400">
              After strong Python fundamentals, the course can expand into data, machine learning, neural networks, and LLM applications.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
