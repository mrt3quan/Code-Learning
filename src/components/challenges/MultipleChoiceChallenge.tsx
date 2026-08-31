import type { MultipleChoiceActivity } from '../../data/lessons';
import CodeBlock from '../CodeBlock';
import { PROMPT_CLASS, type ChallengeComponentProps } from './types';

export default function MultipleChoiceChallenge({
  activity,
  language,
  disabled,
  onSubmit,
}: ChallengeComponentProps<MultipleChoiceActivity>) {
  return (
    <>
      <p className={PROMPT_CLASS}>{activity.prompt}</p>
      {activity.code && <CodeBlock code={activity.code} language={language} />}

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {activity.options.map((option) => (
          <button
            key={option}
            type="button"
            disabled={disabled}
            onClick={() => onSubmit(option === activity.correctAnswer, option)}
            className="min-h-11 rounded-xl border border-parchment-300 bg-parchment-50 px-4 py-2.5 text-left text-sm font-semibold text-pine-900 shadow-sm transition hover:border-robot-cyan-400 hover:bg-robot-cyan-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-robot-cyan-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-pine-700 dark:bg-pine-950 dark:text-parchment-100 dark:hover:border-robot-cyan-600 dark:hover:bg-robot-cyan-500/10"
          >
            {option}
          </button>
        ))}
      </div>
    </>
  );
}
