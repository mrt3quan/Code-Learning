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
      className="inline-flex items-center gap-0.5 rounded-full bg-dawn-sand-50 px-2 py-0.5 text-[11px] font-bold text-dawn-sand-700 dark:bg-dawn-sand-400/10 dark:text-dawn-sand-300"
    >
      {Array.from({ length: 3 }).map((_, index) => (
        <Star
          key={index}
          size={10}
          className={index < filled ? 'fill-current' : 'text-parchment-300 dark:text-pine-600'}
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
      <div className="mb-5 rounded-2xl border border-parchment-200 bg-gradient-to-br from-parchment-50 to-moss-50/60 p-5 shadow-sm dark:border-pine-800 dark:from-pine-900 dark:to-moss-950/30 sm:p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-moss-100 to-robot-cyan-100 dark:from-moss-800/40 dark:to-robot-cyan-900/30">
              <TrackIcon language={track.language} size={42} />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-pine-900 dark:text-parchment-50">{track.title}</h2>
              <p className="mt-1 max-w-2xl text-sm leading-5 text-moss-700/80 dark:text-parchment-400">{track.subtitle}</p>
            </div>
          </div>
          <div className="min-w-36 rounded-xl bg-parchment-50 px-4 py-3 shadow-sm dark:bg-pine-950/60">
            <div className="flex items-center justify-between text-xs font-bold text-moss-700 dark:text-parchment-400">
              <span>Progress</span><span>{pct}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-parchment-200 dark:bg-pine-800">
              <div className="h-full rounded-full bg-gradient-to-r from-moss-500 to-robot-cyan-500" style={{ width: `${pct}%` }} />
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
                className={`group flex w-full items-center gap-4 rounded-2xl border px-4 py-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-robot-cyan-500 focus-visible:ring-offset-2 sm:px-5 ${
                  unlocked
                    ? 'cursor-pointer border-parchment-200 bg-parchment-50 shadow-sm hover:-translate-y-0.5 hover:border-moss-300 hover:shadow-md dark:border-pine-800 dark:bg-pine-900 dark:hover:border-moss-600'
                    : 'cursor-not-allowed border-parchment-200 bg-parchment-100/80 opacity-60 dark:border-pine-800 dark:bg-pine-900/45'
                }`}
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-black shadow-sm ${
                    isCompleted
                      ? 'bg-moss-100 text-moss-700 dark:bg-moss-500/15 dark:text-moss-300'
                      : unlocked
                        ? 'bg-robot-cyan-100 text-robot-cyan-700 dark:bg-robot-cyan-500/15 dark:text-robot-cyan-300'
                        : 'bg-parchment-200 text-parchment-500 dark:bg-pine-800 dark:text-pine-500'
                  }`}
                >
                  {isCompleted ? <Check size={21} strokeWidth={3} /> : unlocked ? lesson.order : <Lock size={17} />}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-pine-900 dark:text-parchment-100">{lesson.title}</span>
                    {lesson.isProject && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-dusk-lavender-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-dusk-lavender-700 dark:bg-dusk-lavender-500/10 dark:text-dusk-lavender-300">
                        <Code2 size={10} /> Project
                      </span>
                    )}
                    {mastery && <MasteryBadge tier={mastery} />}
                  </div>
                  <div className="mt-1 text-xs font-medium text-moss-700/80 dark:text-parchment-400">
                    {isCompleted ? 'Ready to review' : unlocked ? `${lesson.xpReward} XP · short lesson + challenge` : 'Complete the previous lesson to unlock'}
                  </div>
                </div>

                {unlocked && (
                  <div className={`hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl transition sm:flex ${
                    isCompleted
                      ? 'bg-moss-50 text-moss-600 dark:bg-moss-500/10 dark:text-moss-300'
                      : 'bg-robot-cyan-50 text-robot-cyan-600 group-hover:bg-robot-cyan-600 group-hover:text-white dark:bg-robot-cyan-500/10 dark:text-robot-cyan-300'
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
