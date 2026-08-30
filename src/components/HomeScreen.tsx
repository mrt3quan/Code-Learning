import { Check, Lock, ArrowRight, Star, Code2 } from 'lucide-react';
import type { MasteryTier } from '../hooks/useProgress';
import type { Track } from '../data/lessons';
import TrackIcon from './TrackIcon';

interface HomeScreenProps {
  track: Track;
  isLessonUnlocked: (lessonId: string) => boolean;
  isLessonCompleted: (lessonId: string) => boolean;
  getMastery: (lessonId: string) => MasteryTier | null;
  onSelectLesson: (lessonId: string) => void;
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
      className="inline-flex items-center gap-0.5 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-600 dark:bg-amber-400/10 dark:text-amber-300"
    >
      {Array.from({ length: 3 }).map((_, index) => (
        <Star
          key={index}
          size={10}
          className={index < filled ? 'fill-current' : 'text-slate-300 dark:text-slate-600'}
        />
      ))}
    </span>
  );
}

export default function HomeScreen({
  track,
  isLessonUnlocked,
  isLessonCompleted,
  getMastery,
  onSelectLesson,
}: HomeScreenProps) {
  const completed = track.lessons.filter((lesson) => isLessonCompleted(lesson.id)).length;
  const pct = Math.round((completed / track.lessons.length) * 100);

  return (
    <section>
      <div className="mb-5 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-violet-50/60 p-5 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:to-violet-950/20 sm:p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-cyan-100 dark:from-violet-500/15 dark:to-cyan-500/15">
              <TrackIcon language={track.language} size={42} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-950 dark:text-white">{track.title}</h2>
              <p className="mt-1 max-w-2xl text-sm leading-5 text-slate-500 dark:text-slate-400">{track.subtitle}</p>
            </div>
          </div>
          <div className="min-w-36 rounded-xl bg-white px-4 py-3 shadow-sm dark:bg-slate-950/60">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
              <span>Progress</span><span>{pct}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>
      </div>

      <ol className="grid gap-3">
        {track.lessons.map((lesson) => {
          const unlocked = isLessonUnlocked(lesson.id);
          const isCompleted = isLessonCompleted(lesson.id);
          const mastery = getMastery(lesson.id);

          return (
            <li key={lesson.id}>
              <button
                type="button"
                disabled={!unlocked}
                onClick={() => onSelectLesson(lesson.id)}
                className={`group flex w-full items-center gap-4 rounded-2xl border px-4 py-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 sm:px-5 ${
                  unlocked
                    ? 'cursor-pointer border-slate-200 bg-white shadow-sm hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-violet-600'
                    : 'cursor-not-allowed border-slate-200 bg-slate-50/80 opacity-60 dark:border-slate-800 dark:bg-slate-900/45'
                }`}
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-black shadow-sm ${
                    isCompleted
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
                      : unlocked
                        ? 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300'
                        : 'bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600'
                  }`}
                >
                  {isCompleted ? <Check size={21} strokeWidth={3} /> : unlocked ? lesson.order : <Lock size={17} />}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-slate-100">{lesson.title}</span>
                    {lesson.isProject && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">
                        <Code2 size={10} /> Project
                      </span>
                    )}
                    {mastery && <MasteryBadge tier={mastery} />}
                  </div>
                  <div className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                    {isCompleted ? 'Ready to review' : unlocked ? `${lesson.xpReward} XP · short lesson + challenge` : 'Complete the previous lesson to unlock'}
                  </div>
                </div>

                {unlocked && (
                  <div className={`hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl transition sm:flex ${
                    isCompleted
                      ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300'
                      : 'bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white dark:bg-violet-500/10 dark:text-violet-300'
                  }`}>
                    <ArrowRight size={17} />
                  </div>
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
