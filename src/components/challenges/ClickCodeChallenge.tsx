import type { ClickCodeActivity } from '../../data/lessons';
import { PROMPT_CLASS, type ChallengeComponentProps } from './types';

export default function ClickCodeChallenge({
  activity,
  disabled,
  onSubmit,
}: ChallengeComponentProps<ClickCodeActivity>) {
  return (
    <>
      <p className={PROMPT_CLASS}>{activity.prompt}</p>

      <div className="flex flex-col gap-2">
        {activity.options.map((option) => (
          <button
            key={option}
            type="button"
            disabled={disabled}
            onClick={() => onSubmit(option === activity.correctAnswer, option)}
            className="min-h-11 rounded-xl border border-pine-700 bg-pine-950 px-4 py-2.5 text-left font-mono text-sm text-parchment-100 shadow-sm transition hover:border-robot-cyan-500 hover:bg-pine-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-robot-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {option}
          </button>
        ))}
      </div>
    </>
  );
}
