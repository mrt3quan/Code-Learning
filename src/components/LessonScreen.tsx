import { useEffect, useState } from 'react';
import type { Lesson } from '../data/lessons';
import { usePyodide } from '../hooks/usePyodide';
import CodeBlock from './CodeBlock';

interface LessonScreenProps {
  lesson: Lesson;
  alreadyCompleted: boolean;
  hasNextLesson: boolean;
  onBack: () => void;
  onComplete: () => void;
  onGoNext: () => void;
}

type Feedback = 'none' | 'correct' | 'incorrect';

function normalize(answer: string): string {
  return answer.trim().toLowerCase().replace(/\s+/g, ' ');
}

export default function LessonScreen({
  lesson,
  alreadyCompleted,
  hasNextLesson,
  onBack,
  onComplete,
  onGoNext,
}: LessonScreenProps) {
  const { status, runPython } = usePyodide();
  const [liveOutput, setLiveOutput] = useState<string | null>(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<Feedback>('none');
  const [justAwardedXp, setJustAwardedXp] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (status === 'ready') {
      runPython(lesson.example.code)
        .then((out) => {
          if (!cancelled) setLiveOutput(out);
        })
        .catch(() => {
          if (!cancelled) setLiveOutput(null);
        });
    }
    return () => {
      cancelled = true;
    };
  }, [status, lesson.example.code, runPython]);

  const displayedOutput = liveOutput ?? lesson.example.output;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (feedback === 'correct') return;

    const isCorrect =
      normalize(answer) === normalize(lesson.challenge.correctAnswer);

    if (isCorrect) {
      setFeedback('correct');
      if (!alreadyCompleted) {
        onComplete();
        setJustAwardedXp(true);
      }
    } else {
      setFeedback('incorrect');
    }
  }

  function handleRetry() {
    setAnswer('');
    setFeedback('none');
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 text-sm font-medium text-slate-500 hover:text-slate-700"
      >
        ← Back to path
      </button>

      <h1 className="mb-1 text-2xl font-bold text-slate-900">
        Lesson {lesson.order}: {lesson.title}
      </h1>

      <section className="mt-6">
        <p className="leading-relaxed text-slate-700">{lesson.explanation}</p>
      </section>

      <section className="mt-6">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
          Example
        </h2>
        <CodeBlock code={lesson.example.code} />
        <div className="mt-2 rounded-xl border border-slate-200 bg-white px-4 py-3">
          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Output {status === 'ready' && liveOutput !== null && '(live)'}
          </div>
          <pre className="font-mono text-sm whitespace-pre-wrap text-slate-800">
            {displayedOutput}
          </pre>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
          Challenge
        </h2>
        <p className="mb-3 font-medium text-slate-800">
          {lesson.challenge.prompt}
        </p>
        <CodeBlock code={lesson.challenge.code} />

        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={feedback === 'correct'}
            placeholder="Type what this prints…"
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none disabled:bg-slate-50"
          />
          {feedback !== 'correct' && (
            <button
              type="submit"
              disabled={answer.trim() === ''}
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Submit
            </button>
          )}
        </form>

        {feedback === 'correct' && (
          <div className="animate-pop-in mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4">
            <div className="flex items-center gap-2 font-semibold text-emerald-700">
              <span>✅ Correct!</span>
              {justAwardedXp && (
                <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-bold text-white">
                  +{lesson.xpReward} XP
                </span>
              )}
            </div>
            <div className="mt-3 flex gap-2">
              {hasNextLesson ? (
                <button
                  type="button"
                  onClick={onGoNext}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Next lesson →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onBack}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  🎉 Back to path
                </button>
              )}
            </div>
          </div>
        )}

        {feedback === 'incorrect' && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4">
            <div className="font-semibold text-amber-800">
              Not quite — here's what happens:
            </div>
            <p className="mt-1 text-sm leading-relaxed text-amber-900">
              {lesson.challenge.wrongAnswerExplanation}
            </p>
            <p className="mt-2 text-sm italic text-amber-700">
              Hint: {lesson.challenge.hint}
            </p>
            <button
              type="button"
              onClick={handleRetry}
              className="mt-3 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-sm font-semibold text-amber-800 hover:bg-amber-100"
            >
              Try again
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
