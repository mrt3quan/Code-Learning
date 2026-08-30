import { ArrowRight, BrainCircuit, CheckCircle2, ListChecks, Lock, Rocket } from 'lucide-react';
import { tracks } from '../data/lessons';
import TrackIcon from './TrackIcon';
import { Mascot } from './Mascot';

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
  const projects = tracks
    .filter((track) => track.language === 'python')
    .flatMap((track) =>
      track.lessons.filter((lesson) => lesson.isProject).map((lesson) => ({ track, lesson })),
    );

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <section className="relative overflow-hidden rounded-[26px] border border-sky-200 bg-gradient-to-br from-sky-50 via-white to-violet-50 p-6 shadow-sm dark:border-sky-800 dark:from-sky-950/30 dark:via-slate-900 dark:to-violet-950/30 sm:p-7">
        <div className="relative z-10 max-w-2xl">
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-sky-700 dark:text-sky-300">Build something real</div>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950 dark:text-white">Python Projects</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            Projects combine several lessons at once. They are where isolated syntax starts turning into programming skill.
          </p>
        </div>
        <div className="absolute -bottom-10 right-4 hidden h-36 w-36 items-center justify-center sm:flex">
          <Mascot variant="wave" size={125} />
        </div>
      </section>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {projects.map(({ track, lesson }, index) => {
          const unlocked = isLessonUnlocked(lesson.id);
          const completed = isLessonCompleted(lesson.id);
          const ProjectIcon = index % 2 === 0 ? ListChecks : BrainCircuit;

          return (
            <button
              key={lesson.id}
              type="button"
              disabled={!unlocked}
              onClick={() => onSelectLesson(lesson.id)}
              className={`group overflow-hidden rounded-2xl border text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 ${
                unlocked
                  ? 'cursor-pointer border-slate-200 bg-white shadow-sm hover:-translate-y-1 hover:border-violet-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-violet-600'
                  : 'cursor-not-allowed border-slate-200 bg-slate-50 opacity-60 dark:border-slate-800 dark:bg-slate-900/45'
              }`}
            >
              <div className={`flex h-32 items-center justify-between overflow-hidden px-5 ${index % 2 === 0 ? 'bg-gradient-to-br from-cyan-100 to-sky-200 dark:from-cyan-950/50 dark:to-sky-950/50' : 'bg-gradient-to-br from-violet-100 to-fuchsia-100 dark:from-violet-950/50 dark:to-fuchsia-950/40'}`}>
                <div>
                  <span className="rounded-full bg-white/75 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.13em] text-slate-700 backdrop-blur dark:bg-slate-900/65 dark:text-slate-200">
                    Project {index + 1}
                  </span>
                  <div className="mt-3 flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                    <TrackIcon language={track.language} size={24} /> Python
                  </div>
                </div>
                <ProjectIcon size={66} strokeWidth={1.35} className={index % 2 === 0 ? 'text-sky-600/80 dark:text-sky-300/70' : 'text-violet-600/80 dark:text-violet-300/70'} />
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-black text-slate-950 dark:text-white">{lesson.title.replace(/^Project:\s*/, '')}</h2>
                    <p className="mt-1 line-clamp-3 text-sm leading-6 text-slate-500 dark:text-slate-400">{lesson.explanation}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-black text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">+{lesson.xpReward} XP</span>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                  {completed ? (
                    <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-600 dark:text-emerald-400"><CheckCircle2 size={16} /> Completed</span>
                  ) : unlocked ? (
                    <span className="flex items-center gap-1.5 text-sm font-bold text-violet-600 dark:text-violet-400">Start project <ArrowRight size={16} /></span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-sm font-bold text-slate-400"><Lock size={14} /> Locked</span>
                  )}
                  {unlocked && <Rocket size={17} className="text-slate-300 transition group-hover:text-violet-500 dark:text-slate-600" />}
                </div>
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
