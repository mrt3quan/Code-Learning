import { tracks, type ChallengeType } from '../data/lessons';
import TrackIcon from './TrackIcon';

interface ChallengesScreenProps {
  isLessonUnlocked: (lessonId: string) => boolean;
  isLessonCompleted: (lessonId: string) => boolean;
  onSelectLesson: (lessonId: string) => void;
}

const CHALLENGE_LABEL: Record<ChallengeType, string> = {
  'predict-output': 'Predict the Output',
  'fill-in-blank': 'Fill in the Blank',
  'fix-the-bug': 'Fix the Bug',
};

const CHALLENGE_COLOR: Record<ChallengeType, string> = {
  'predict-output': 'bg-violet-100 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300',
  'fill-in-blank': 'bg-sky-100 text-sky-700 dark:bg-sky-400/10 dark:text-sky-300',
  'fix-the-bug': 'bg-rose-100 text-rose-700 dark:bg-rose-400/10 dark:text-rose-300',
};

export default function ChallengesScreen({
  isLessonUnlocked,
  isLessonCompleted,
  onSelectLesson,
}: ChallengesScreenProps) {
  const entries = tracks.flatMap((track) =>
    track.lessons
      .filter((lesson) => isLessonUnlocked(lesson.id))
      .map((lesson) => ({ track, lesson })),
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Challenges</h1>
      <p className="mt-1 text-slate-500 dark:text-slate-400">
        Every challenge you've unlocked so far — jump back in to practice any of them.
      </p>

      <ul className="mt-6 flex flex-col gap-3">
        {entries.map(({ track, lesson }) => {
          const completed = isLessonCompleted(lesson.id);
          return (
            <li key={lesson.id}>
              <button
                type="button"
                onClick={() => onSelectLesson(lesson.id)}
                className="flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left shadow-sm transition hover:border-violet-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-violet-500"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                  <TrackIcon language={track.language} size={22} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {lesson.title}
                    </span>
                    {completed && <span title="Completed">✅</span>}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{track.title}</div>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${CHALLENGE_COLOR[lesson.challenge.type]}`}
                >
                  {CHALLENGE_LABEL[lesson.challenge.type]}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {entries.length === 0 && (
        <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
          Complete your first lesson to unlock challenges here.
        </p>
      )}
    </div>
  );
}
