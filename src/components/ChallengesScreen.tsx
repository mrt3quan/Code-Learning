import { CheckCircle2 } from 'lucide-react';
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
  'predict-output': 'bg-robot-cyan-100 text-robot-cyan-700 dark:bg-robot-cyan-400/10 dark:text-robot-cyan-300',
  'fill-in-blank': 'bg-dawn-sand-100 text-dawn-sand-700 dark:bg-dawn-sand-400/10 dark:text-dawn-sand-300',
  'fix-the-bug': 'bg-dusk-lavender-100 text-dusk-lavender-700 dark:bg-dusk-lavender-400/10 dark:text-dusk-lavender-300',
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
      <h1 className="font-display text-2xl font-bold text-pine-900 dark:text-parchment-50">Challenges</h1>
      <p className="mt-1 text-moss-700/80 dark:text-parchment-400">
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
                className="flex w-full items-center gap-4 rounded-2xl border border-parchment-200 bg-parchment-50 px-5 py-4 text-left shadow-sm transition hover:border-moss-300 hover:shadow-md dark:border-pine-700 dark:bg-pine-900 dark:hover:border-moss-600"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-parchment-100 dark:bg-pine-800">
                  <TrackIcon language={track.language} size={22} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-pine-900 dark:text-parchment-100">
                      {lesson.title}
                    </span>
                    {completed && (
                      <CheckCircle2
                        size={16}
                        className="text-moss-600 dark:text-moss-400"
                        aria-label="Completed"
                      />
                    )}
                  </div>
                  <div className="text-xs text-moss-700/80 dark:text-parchment-400">{track.title}</div>
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
        <p className="mt-6 text-sm text-moss-700/80 dark:text-parchment-400">
          Complete your first lesson to unlock challenges here.
        </p>
      )}
    </div>
  );
}
