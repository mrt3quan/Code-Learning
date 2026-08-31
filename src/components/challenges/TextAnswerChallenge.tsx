import { useState } from 'react';
import type { ChallengeActivity } from '../../data/lessons';
import CodeBlock from '../CodeBlock';
import { PROMPT_CLASS, type ChallengeComponentProps } from './types';

const PLACEHOLDER: Record<ChallengeActivity['type'], string> = {
  'predict-output': 'Type what this prints…',
  'fill-in-blank': 'Type what goes in the blank…',
  'fix-the-bug': 'Type the fix…',
};

function normalizeOutput(answer: string): string {
  return answer.trim().toLowerCase().replace(/\s+/g, ' ');
}

function normalizeCode(answer: string): string {
  return answer.trim().replace(/\s+/g, ' ');
}

export default function TextAnswerChallenge({
  activity,
  language,
  disabled,
  onSubmit,
}: ChallengeComponentProps<ChallengeActivity>) {
  const [answer, setAnswer] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (disabled || answer.trim() === '') return;
    const normalize = activity.type === 'predict-output' ? normalizeOutput : normalizeCode;
    onSubmit(normalize(answer) === normalize(activity.correctAnswer), answer);
  }

  return (
    <>
      <p className={PROMPT_CLASS}>{activity.prompt}</p>
      <CodeBlock code={activity.code} language={language} />

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2 sm:flex-row">
        <label className="sr-only" htmlFor="lesson-answer">Your answer</label>
        <input
          id="lesson-answer"
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={disabled}
          placeholder={PLACEHOLDER[activity.type]}
          className="min-h-11 flex-1 rounded-xl border border-parchment-300 bg-parchment-50 px-3.5 py-2.5 text-sm text-pine-900 shadow-inner outline-none transition placeholder:text-moss-600/50 focus:border-robot-cyan-500 focus:ring-2 focus:ring-robot-cyan-500/15 disabled:bg-parchment-100 dark:border-pine-700 dark:bg-pine-950 dark:text-parchment-100 dark:disabled:bg-pine-900"
        />
        {!disabled && (
          <button
            type="submit"
            disabled={answer.trim() === ''}
            className="min-h-11 rounded-xl bg-robot-cyan-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-robot-cyan-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-robot-cyan-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Check answer
          </button>
        )}
      </form>
    </>
  );
}
