import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Lightbulb,
  PlayCircle,
  Sparkles,
  Swords,
  Target,
} from 'lucide-react';
import type { ChallengeType, Language, Lesson } from '../data/lessons';
import { usePyodide } from '../hooks/usePyodide';
import { useTutorHint } from '../hooks/useTutorHint';
import CodeBlock from './CodeBlock';
import { Mascot } from './Mascot';

interface LessonScreenProps {
  lesson: Lesson;
  language: Language;
  totalLessons: number;
  trackTitle: string;
  alreadyCompleted: boolean;
  hasNextLesson: boolean;
  onBack: () => void;
  onComplete: (wrongAttempts: number) => void;
  onGoNext: () => void;
}

type Feedback = 'none' | 'correct' | 'incorrect';

function normalizeOutput(answer: string): string {
  return answer.trim().toLowerCase().replace(/\s+/g, ' ');
}

function normalizeCode(answer: string): string {
  return answer.trim().replace(/\s+/g, ' ');
}

const CHALLENGE_LABEL: Record<ChallengeType, string> = {
  'predict-output': 'Predict the Output',
  'fill-in-blank': 'Fill in the Blank',
  'fix-the-bug': 'Fix the Bug',
};

const CHALLENGE_PLACEHOLDER: Record<ChallengeType, string> = {
  'predict-output': 'Type what this prints…',
  'fill-in-blank': 'Type what goes in the blank…',
  'fix-the-bug': 'Type the fix…',
};

export default function LessonScreen({
  lesson,
  language,
  totalLessons,
  trackTitle,
  alreadyCompleted,
  hasNextLesson,
  onBack,
  onComplete,
  onGoNext,
}: LessonScreenProps) {
  const { status, runPython } = usePyodide();
  const tutor = useTutorHint();
  const [liveOutput, setLiveOutput] = useState<string | null>(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<Feedback>('none');
  const [justAwardedXp, setJustAwardedXp] = useState(false);
  const [wrongAttempts, setWrongAttempts] = useState(0);

  useEffect(() => {
    let cancelled = false;
    if (language === 'python' && status === 'ready') {
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
  }, [language, status, lesson.example.code, runPython]);

  const displayedOutput = liveOutput ?? lesson.example.output;
  const progressPct = Math.round((lesson.order / totalLessons) * 100);
  const isBossChallenge = lesson.challenge.type === 'fix-the-bug';

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (feedback === 'correct') return;

    const normalize =
      lesson.challenge.type === 'predict-output' ? normalizeOutput : normalizeCode;
    const isCorrect = normalize(answer) === normalize(lesson.challenge.correctAnswer);

    if (isCorrect) {
      setFeedback('correct');
      if (!alreadyCompleted) {
        onComplete(wrongAttempts);
        setJustAwardedXp(true);
      }
    } else {
      setFeedback('incorrect');
      setWrongAttempts((n) => n + 1);
    }
  }

  function handleRetry() {
    setAnswer('');
    setFeedback('none');
    tutor.reset();
  }

  function handleAskTutor() {
    tutor.askTutor({
      lessonTitle: lesson.title,
      explanation: lesson.explanation,
      challengeCode: lesson.challenge.code,
      challengePrompt: lesson.challenge.prompt,
      correctAnswer: lesson.challenge.correctAnswer,
      staticHint: lesson.challenge.hint,
      staticExplanation: lesson.challenge.wrongAnswerExplanation,
      userAnswer: answer,
      wrongAttempts,
    });
  }

  function scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-2 rounded-xl px-2 py-1.5 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
      >
        <ArrowLeft size={16} /> Back to lessons
      </button>

      <header className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-600 px-5 py-5 text-white sm:px-7 sm:py-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.16em] text-violet-100">
                {trackTitle} · Lesson {lesson.order} of {totalLessons}
              </div>
              <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">{lesson.title}</h1>
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-xs font-bold backdrop-blur">
                <Sparkles size={13} /> +{lesson.xpReward} XP
              </div>
            </div>
            <div className="w-full sm:w-56">
              <div className="mb-1.5 flex items-center justify-between text-xs font-semibold text-white/80">
                <span>Track progress</span>
                <span>{progressPct}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/20">
                <div className="h-full rounded-full bg-white" style={{ width: `${progressPct}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto px-4 py-3 sm:px-6">
          {[
            { id: 'section-explain', label: 'Learn', Icon: BookOpen },
            { id: 'section-example', label: 'See Example', Icon: PlayCircle },
            {
              id: 'section-challenge',
              label: isBossChallenge ? 'Boss Challenge' : 'Practice',
              Icon: isBossChallenge ? Swords : Target,
            },
          ].map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => scrollToSection(section.id)}
              className="flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-violet-600 dark:hover:bg-violet-500/10 dark:hover:text-violet-300"
            >
              <section.Icon size={14} />
              {section.label}
            </button>
          ))}
        </div>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_230px]">
        <div className="min-w-0 space-y-6">
          <section
            id="section-explain"
            className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6"
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.14em] text-violet-600 dark:text-violet-400">Step 1</div>
                <h2 className="mt-1 text-lg font-black text-slate-950 dark:text-white">Understand the idea</h2>
              </div>
              <div className="hidden h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-violet-100 to-cyan-100 dark:from-violet-500/15 dark:to-cyan-500/15 sm:flex">
                <Mascot size={50} variant="head" />
              </div>
            </div>
            <p className="text-[15px] leading-7 text-slate-700 dark:text-slate-300">{lesson.explanation}</p>
          </section>

          <section
            id="section-example"
            className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6"
          >
            <div className="mb-4">
              <div className="text-xs font-bold uppercase tracking-[0.14em] text-sky-600 dark:text-sky-400">Step 2</div>
              <h2 className="mt-1 text-lg font-black text-slate-950 dark:text-white">See it run</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Read the code first, then compare it with the output.</p>
            </div>

            <CodeBlock code={lesson.example.code} language={language} />

            <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between bg-slate-50 px-4 py-2 dark:bg-slate-800">
                <span className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Output</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${status === 'ready' && liveOutput !== null ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300' : 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-300'}`}>
                  {status === 'ready' && liveOutput !== null ? 'Live Python' : 'Example output'}
                </span>
              </div>
              <pre className="bg-white px-4 py-3 font-mono text-sm whitespace-pre-wrap text-slate-800 dark:bg-slate-950 dark:text-slate-100">{displayedOutput}</pre>
            </div>
          </section>

          <section
            id="section-challenge"
            className={`scroll-mt-24 rounded-2xl border p-5 shadow-sm sm:p-6 ${
              isBossChallenge
                ? 'border-violet-300 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 dark:border-violet-700 dark:from-violet-950/60 dark:via-slate-900 dark:to-fuchsia-950/40'
                : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
            }`}
          >
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${isBossChallenge ? 'bg-violet-600 text-white' : 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300'}`}>
                  {isBossChallenge ? <Swords size={22} /> : <Target size={21} />}
                </div>
                <div>
                  <div className={`text-xs font-bold uppercase tracking-[0.14em] ${isBossChallenge ? 'text-violet-600 dark:text-violet-400' : 'text-amber-600 dark:text-amber-400'}`}>
                    Step 3 · {isBossChallenge ? 'Boss Challenge' : 'Practice'}
                  </div>
                  <h2 className="mt-1 text-lg font-black text-slate-950 dark:text-white">{CHALLENGE_LABEL[lesson.challenge.type]}</h2>
                </div>
              </div>
              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-black text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">+{lesson.xpReward} XP</span>
            </div>

            <p className="mb-3 text-sm font-semibold leading-6 text-slate-700 dark:text-slate-300">{lesson.challenge.prompt}</p>
            <CodeBlock code={lesson.challenge.code} language={language} />

            <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2 sm:flex-row">
              <label className="sr-only" htmlFor="lesson-answer">Your answer</label>
              <input
                id="lesson-answer"
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={feedback === 'correct'}
                placeholder={CHALLENGE_PLACEHOLDER[lesson.challenge.type]}
                className="min-h-11 flex-1 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-inner outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15 disabled:bg-slate-50 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100 dark:disabled:bg-slate-900"
              />
              {feedback !== 'correct' && (
                <button
                  type="submit"
                  disabled={answer.trim() === ''}
                  className="min-h-11 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Check answer
                </button>
              )}
            </form>

            {feedback === 'correct' && (
              <div className="animate-pop-in mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950/60">
                <div className="flex flex-wrap items-center gap-2 font-bold text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 size={20} />
                  <span>Correct!</span>
                  {justAwardedXp && (
                    <span className="rounded-full bg-emerald-600 px-2.5 py-1 text-xs font-black text-white">+{lesson.xpReward} XP</span>
                  )}
                </div>
                <p className="mt-1.5 text-sm text-emerald-700/85 dark:text-emerald-300/80">
                  {justAwardedXp
                    ? wrongAttempts === 0
                      ? 'Mastered on the first try. Nice work.'
                      : `Solved after ${wrongAttempts} ${wrongAttempts === 1 ? 'retry' : 'retries'}.`
                    : 'You already completed this lesson, so this was a review run.'}
                </p>
                <button
                  type="button"
                  onClick={hasNextLesson ? onGoNext : onBack}
                  className="mt-3 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
                >
                  {hasNextLesson ? 'Next lesson' : 'Back to your path'} <ArrowRight size={16} />
                </button>
              </div>
            )}

            {feedback === 'incorrect' && (
              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/60">
                <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
                  <Lightbulb size={18} /> Not quite — use the explanation, then try again.
                </div>
                <p className="mt-2 text-sm leading-6 text-amber-900 dark:text-amber-200">{lesson.challenge.wrongAnswerExplanation}</p>
                <div className="mt-2 rounded-xl bg-white/70 px-3 py-2 text-sm italic text-amber-800 dark:bg-slate-900/50 dark:text-amber-300">
                  Hint: {lesson.challenge.hint}
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="rounded-xl border border-amber-300 bg-white px-3.5 py-2 text-sm font-bold text-amber-800 transition hover:bg-amber-100 dark:border-amber-700 dark:bg-slate-900 dark:text-amber-300 dark:hover:bg-slate-800"
                  >
                    Try again
                  </button>
                  {tutor.status !== 'ready' && (
                    <button
                      type="button"
                      onClick={handleAskTutor}
                      disabled={tutor.status === 'loading'}
                      className="rounded-xl border border-violet-300 bg-white px-3.5 py-2 text-sm font-bold text-violet-700 transition hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-violet-700 dark:bg-slate-900 dark:text-violet-300 dark:hover:bg-slate-800"
                    >
                      {tutor.status === 'loading' ? '🤖 Thinking…' : '🤖 Ask AI Tutor'}
                    </button>
                  )}
                </div>

                {tutor.status === 'unavailable' && (
                  <p className="mt-2 text-xs text-amber-600 dark:text-amber-500">AI Tutor is unavailable right now. The built-in hint above still works.</p>
                )}

                {tutor.status === 'ready' && tutor.hint && (
                  <div className="animate-pop-in mt-3 rounded-xl border border-violet-200 bg-violet-50 p-3 dark:border-violet-800 dark:bg-violet-950/70">
                    <div className="text-xs font-bold uppercase tracking-[0.14em] text-violet-500 dark:text-violet-400">🤖 AI Tutor</div>
                    <p className="mt-1 text-sm leading-6 text-violet-900 dark:text-violet-200">{tutor.hint}</p>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex justify-center">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-violet-100 to-cyan-100 dark:from-violet-500/15 dark:to-cyan-500/15">
                  <Mascot size={88} variant="head" />
                </div>
              </div>
              <div className="mt-3 text-center text-sm font-bold text-slate-900 dark:text-white">Learn in small steps</div>
              <p className="mt-1 text-center text-xs leading-5 text-slate-500 dark:text-slate-400">Understand the concept first. Then use the challenge to prove it to yourself.</p>
            </div>

            <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 dark:border-sky-800 dark:bg-sky-500/10">
              <div className="text-xs font-bold uppercase tracking-[0.14em] text-sky-700 dark:text-sky-300">Python runtime</div>
              <div className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
                {status === 'ready' ? '✓ Ready in your browser' : status === 'loading' ? 'Loading Python…' : 'Using saved example output'}
              </div>
              <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-400">Examples run with Pyodide when available. No local Python installation is required.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
