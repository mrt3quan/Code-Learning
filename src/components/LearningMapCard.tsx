import { Check, Lock, Play, Sparkles } from 'lucide-react';
import type { Track } from '../data/lessons';
import TrackIcon from './TrackIcon';
import bgFloatingIslands from '../assets/bg-floating-islands.png';

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
  const completedCount = track.lessons.filter((l) => isLessonCompleted(l.id)).length;
  const progressPct = Math.round((completedCount / track.lessons.length) * 100);
  const offsets = [18, 88, 38, 104, 30, 80];

  return (
    <div className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 px-5 py-4 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-cyan-100 dark:from-violet-500/15 dark:to-cyan-500/15">
            <TrackIcon language={track.language} size={34} />
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-white">{track.title}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{completedCount} of {track.lessons.length} lessons complete</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
            {progressPct}% complete
          </span>
          <span className="hidden text-xs text-slate-400 sm:inline">Scroll →</span>
        </div>
      </div>

      <div className="relative overflow-x-auto overscroll-x-contain map-scrollbar">
        <div
          className="relative h-[340px] min-w-[780px] bg-cover bg-center"
          style={{
            minWidth: Math.max(780, track.lessons.length * 142),
            backgroundImage: `url(${bgFloatingIslands})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/0 to-white/30 dark:from-slate-950/55 dark:via-slate-950/35 dark:to-slate-950/65" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white/55 to-transparent dark:from-slate-950/45" />

          <div className="relative flex h-full items-start gap-2 px-7 py-5">
            {track.lessons.map((lesson, index) => {
              const unlocked = isLessonUnlocked(lesson.id);
              const completed = isLessonCompleted(lesson.id);
              const isNext = nextLesson?.id === lesson.id;
              const offset = offsets[index % offsets.length];
              const nextOffset = offsets[(index + 1) % offsets.length];
              const direction = nextOffset > offset ? 1 : -1;

              return (
                <div
                  key={lesson.id}
                  className="relative w-[128px] shrink-0"
                  style={{ paddingTop: offset }}
                >
                  {index < track.lessons.length - 1 && (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute left-[82px] top-[88px] h-0 w-[84px] border-t-[3px] border-dashed border-emerald-400/65 dark:border-emerald-300/30"
                      style={{
                        transform: `translateY(${offset - 18}px) rotate(${direction * 26}deg)`,
                        transformOrigin: 'left center',
                      }}
                    />
                  )}

                  <button
                    type="button"
                    disabled={!unlocked}
                    onClick={() => onSelectLesson(lesson.id)}
                    aria-label={`${lesson.title}${completed ? ', completed' : unlocked ? ', unlocked' : ', locked'}`}
                    className={`group relative z-10 flex w-full flex-col items-center rounded-2xl px-2 py-2 text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed ${
                      unlocked ? 'hover:-translate-y-1' : ''
                    }`}
                  >
                    <div
                      className={`relative flex h-16 w-16 items-center justify-center rounded-full border-4 text-lg font-black shadow-lg transition-all ${
                        completed
                          ? 'border-white bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-emerald-900/20 dark:border-slate-800'
                          : unlocked
                            ? 'border-white bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-violet-900/25 group-hover:shadow-xl dark:border-slate-800'
                            : 'border-white/90 bg-slate-200 text-slate-400 shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-700 dark:text-slate-500'
                      }`}
                    >
                      {completed ? (
                        <Check size={26} strokeWidth={3} />
                      ) : unlocked ? (
                        isNext ? <Play size={22} className="ml-1 fill-current" /> : lesson.order
                      ) : (
                        <Lock size={20} />
                      )}

                      {isNext && (
                        <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-amber-300 text-amber-900 shadow-md">
                          <Sparkles size={14} className="fill-current" />
                        </span>
                      )}
                    </div>

                    <div className={`mt-2 rounded-xl border px-2.5 py-1.5 shadow-sm backdrop-blur-md ${
                      isNext
                        ? 'border-violet-200 bg-white/95 dark:border-violet-700 dark:bg-slate-900/95'
                        : 'border-white/70 bg-white/80 dark:border-slate-700 dark:bg-slate-900/80'
                    }`}>
                      <div className="line-clamp-2 text-xs font-bold leading-4 text-slate-800 dark:text-slate-100">
                        {lesson.title.replace(/^Project:\s*/, '')}
                      </div>
                      <div className={`mt-0.5 text-[10px] font-semibold ${
                        completed
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : unlocked
                            ? 'text-violet-600 dark:text-violet-400'
                            : 'text-slate-400'
                      }`}>
                        {completed ? 'Completed' : unlocked ? `+${lesson.xpReward} XP` : 'Locked'}
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
