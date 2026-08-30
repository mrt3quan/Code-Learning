import { ArrowRight, BrainCircuit, CheckCircle2, ListChecks, Lock, Rocket } from 'lucide-react';
import { getExplanationActivity, tracks } from '../data/lessons';
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
      <section className="relative overflow-hidden rounded-[26px] border border-moss-200 bg-gradient-to-br from-moss-50 via-parchment-50 to-robot-cyan-50 p-6 shadow-sm dark:border-moss-800 dark:from-moss-950/30 dark:via-pine-900 dark:to-robot-cyan-950/30 sm:p-7">
        <div className="relative z-10 max-w-2xl">
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-moss-700 dark:text-moss-300">Build something real</div>
          <h1 className="font-display mt-1 text-2xl font-bold tracking-tight text-pine-900 dark:text-parchment-50">Python Projects</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-moss-800/80 dark:text-parchment-400">
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
              className={`group overflow-hidden rounded-2xl border text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-robot-cyan-500 focus-visible:ring-offset-2 ${
                unlocked
                  ? 'cursor-pointer border-parchment-200 bg-parchment-50 shadow-sm hover:-translate-y-1 hover:border-moss-300 hover:shadow-lg dark:border-pine-800 dark:bg-pine-900 dark:hover:border-moss-600'
                  : 'cursor-not-allowed border-parchment-200 bg-parchment-100 opacity-60 dark:border-pine-800 dark:bg-pine-900/45'
              }`}
            >
              <div className={`flex h-32 items-center justify-between overflow-hidden px-5 ${index % 2 === 0 ? 'bg-gradient-to-br from-robot-cyan-100 to-moss-200 dark:from-robot-cyan-950/50 dark:to-moss-950/50' : 'bg-gradient-to-br from-dawn-sand-100 to-bloom-coral-100 dark:from-dawn-sand-950/50 dark:to-bloom-coral-950/40'}`}>
                <div>
                  <span className="rounded-full bg-parchment-50/75 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.13em] text-pine-800 backdrop-blur dark:bg-pine-900/65 dark:text-parchment-200">
                    Project {index + 1}
                  </span>
                  <div className="mt-3 flex items-center gap-2 text-xs font-bold text-moss-700 dark:text-parchment-300">
                    <TrackIcon language={track.language} size={24} /> Python
                  </div>
                </div>
                <ProjectIcon size={66} strokeWidth={1.35} className={index % 2 === 0 ? 'text-robot-cyan-700/80 dark:text-robot-cyan-300/70' : 'text-dawn-sand-700/80 dark:text-dawn-sand-300/70'} />
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-lg font-bold text-pine-900 dark:text-parchment-50">{lesson.title.replace(/^Project:\s*/, '')}</h2>
                    <p className="mt-1 line-clamp-3 text-sm leading-6 text-moss-700/80 dark:text-parchment-400">{getExplanationActivity(lesson)?.text}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-dawn-sand-100 px-2.5 py-1 text-xs font-black text-dawn-sand-800 dark:bg-dawn-sand-500/10 dark:text-dawn-sand-300">+{lesson.xpReward} XP</span>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-parchment-200 pt-4 dark:border-pine-800">
                  {completed ? (
                    <span className="flex items-center gap-1.5 text-sm font-bold text-moss-600 dark:text-moss-400"><CheckCircle2 size={16} /> Completed</span>
                  ) : unlocked ? (
                    <span className="flex items-center gap-1.5 text-sm font-bold text-robot-cyan-700 dark:text-robot-cyan-400">Start project <ArrowRight size={16} /></span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-sm font-bold text-parchment-500 dark:text-pine-500"><Lock size={14} /> Locked</span>
                  )}
                  {unlocked && <Rocket size={17} className="text-parchment-400 transition group-hover:text-robot-cyan-500 dark:text-pine-600" />}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {projects.length === 0 && (
        <p className="mt-6 text-sm text-moss-700/80 dark:text-parchment-400">No projects yet.</p>
      )}
    </div>
  );
}
