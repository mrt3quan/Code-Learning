import { useState } from 'react';
import { PlayCircle } from 'lucide-react';
import type { CodeEditorActivity } from '../../data/lessons';
import { usePyodide } from '../../hooks/usePyodide';
import { translatePythonError } from '../../utils/translatePythonError';
import { PROMPT_CLASS, type ChallengeComponentProps } from './types';

export default function CodeEditorChallenge({
  activity,
  disabled,
  onSubmit,
}: ChallengeComponentProps<CodeEditorActivity>) {
  const { status, runPython } = usePyodide();
  const [code, setCode] = useState(activity.starterCode);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [rawError, setRawError] = useState<string | null>(null);

  async function handleRun() {
    if (status !== 'ready' || isRunning || disabled) return;
    setIsRunning(true);
    setOutput(null);
    setRawError(null);
    try {
      const result = await runPython(code);
      setOutput(result);
      const isCorrect = result.trim() === activity.expectedOutput.trim();
      onSubmit(isCorrect, code);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setRawError(message);
      onSubmit(false, code);
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <>
      <p className={PROMPT_CLASS}>{activity.prompt}</p>

      <div className="overflow-hidden rounded-2xl border border-pine-700 bg-pine-950 shadow-sm">
        <div className="flex items-center justify-between border-b border-pine-700 bg-pine-900 px-3.5 py-2.5">
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-bloom-coral-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-dawn-sand-300/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-moss-400/80" />
          </div>
          <span className="font-mono text-xs font-semibold text-parchment-300">main.py</span>
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          disabled={disabled}
          spellCheck={false}
          rows={Math.max(5, code.split('\n').length + 1)}
          className="w-full resize-y bg-pine-950 px-4 py-3 font-mono text-sm text-parchment-100 outline-none disabled:opacity-70"
        />
      </div>

      <div className="mt-3 flex items-center gap-3">
        {!disabled && (
          <button
            type="button"
            onClick={handleRun}
            disabled={status !== 'ready' || isRunning}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-robot-cyan-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-robot-cyan-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-robot-cyan-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <PlayCircle size={16} />
            {isRunning ? 'Running…' : 'Run Code'}
          </button>
        )}
        {status !== 'ready' && <span className="text-xs text-moss-700/70 dark:text-parchment-400">Python is still loading…</span>}
      </div>

      {output !== null && (
        <div className="mt-3 overflow-hidden rounded-xl border border-parchment-200 dark:border-pine-700">
          <div className="bg-parchment-100 px-4 py-2 text-xs font-bold uppercase tracking-wide text-moss-700 dark:bg-pine-800 dark:text-parchment-400">
            Output
          </div>
          <pre className="bg-parchment-50 px-4 py-3 font-mono text-sm whitespace-pre-wrap text-pine-800 dark:bg-pine-950 dark:text-parchment-100">{output || '(no output)'}</pre>
        </div>
      )}

      {rawError !== null && (
        <div className="mt-3 rounded-xl border border-bloom-coral-300 bg-bloom-coral-50 p-3.5 dark:border-bloom-coral-800 dark:bg-bloom-coral-950/30">
          <p className="text-sm font-semibold leading-6 text-bloom-coral-900 dark:text-bloom-coral-200">
            {translatePythonError(rawError)}
          </p>
          <details className="mt-2">
            <summary className="cursor-pointer text-xs font-bold uppercase tracking-wide text-bloom-coral-700 dark:text-bloom-coral-400">
              Show raw error
            </summary>
            <pre className="mt-1.5 overflow-x-auto whitespace-pre-wrap font-mono text-xs text-bloom-coral-900/80 dark:text-bloom-coral-200/80">{rawError}</pre>
          </details>
        </div>
      )}
    </>
  );
}
