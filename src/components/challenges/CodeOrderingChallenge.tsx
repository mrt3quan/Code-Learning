import { useState } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import type { CodeOrderingActivity } from '../../data/lessons';
import { PROMPT_CLASS, type ChallengeComponentProps } from './types';

function shuffledUnlessMatching(lines: string[]): string[] {
  const shuffled = [...lines];
  // Fisher-Yates, re-rolled if it happens to land on the already-correct
  // order (only possible for very short lists, but worth guarding).
  do {
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
  } while (shuffled.length > 1 && shuffled.every((line, i) => line === lines[i]));
  return shuffled;
}

export default function CodeOrderingChallenge({
  activity,
  disabled,
  onSubmit,
}: ChallengeComponentProps<CodeOrderingActivity>) {
  const [lines, setLines] = useState(() => shuffledUnlessMatching(activity.correctLines));

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= lines.length) return;
    const next = [...lines];
    [next[index], next[target]] = [next[target], next[index]];
    setLines(next);
  }

  function handleCheck() {
    const isCorrect = lines.every((line, i) => line === activity.correctLines[i]);
    onSubmit(isCorrect, lines.join('\n'));
  }

  return (
    <>
      <p className={PROMPT_CLASS}>{activity.prompt}</p>

      <ol className="flex flex-col gap-1.5 overflow-hidden rounded-2xl border border-pine-700 bg-pine-950 p-2">
        {lines.map((line, index) => (
          <li key={`${index}-${line}`} className="flex items-center gap-2">
            <span className="w-5 shrink-0 text-right font-mono text-xs text-pine-400">{index + 1}</span>
            <code className="min-w-0 flex-1 whitespace-pre-wrap break-words rounded-lg bg-pine-900 px-3 py-2 font-mono text-sm text-parchment-100">
              {line || ' '}
            </code>
            <div className="flex shrink-0 flex-col gap-0.5">
              <button
                type="button"
                disabled={disabled || index === 0}
                onClick={() => move(index, -1)}
                aria-label="Move line up"
                className="rounded-md p-1 text-parchment-400 transition hover:bg-white/10 hover:text-parchment-50 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ArrowUp size={14} />
              </button>
              <button
                type="button"
                disabled={disabled || index === lines.length - 1}
                onClick={() => move(index, 1)}
                aria-label="Move line down"
                className="rounded-md p-1 text-parchment-400 transition hover:bg-white/10 hover:text-parchment-50 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ArrowDown size={14} />
              </button>
            </div>
          </li>
        ))}
      </ol>

      {!disabled && (
        <button
          type="button"
          onClick={handleCheck}
          className="mt-4 min-h-11 rounded-xl bg-robot-cyan-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-robot-cyan-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-robot-cyan-500 focus-visible:ring-offset-2"
        >
          Check order
        </button>
      )}
    </>
  );
}
