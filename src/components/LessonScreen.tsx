import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Compass,
  Lightbulb,
  ListChecks,
  PlayCircle,
  Swords,
  Target,
} from 'lucide-react';
import {
  describeChallenge,
  getExplanationActivity,
  getPrimaryChallenge,
  type Activity,
  type Language,
  type Lesson,
} from '../data/lessons';
import { usePyodide } from '../hooks/usePyodide';
import { useTutorHint } from '../hooks/useTutorHint';
import CodeBlock from './CodeBlock';
import ChallengeBody from './challenges/ChallengeBody';
import { Mascot } from './Mascot';
import bgFloatingIslands from '../assets/bg-floating-islands.png';

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

const CHALLENGE_LABEL: Record<Exclude<Activity['type'], 'explanation'>, string> = {
  'predict-output': 'Predict the Output',
  'fill-in-blank': 'Fill in the Blank',
  'fix-the-bug': 'Fix the Bug',
  'multiple-choice': 'Multiple Choice',
  'click-code': 'Click the Correct Code',
  'code-ordering': 'Code Ordering',
  'code-editor': 'Write & Run Code',
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
  const [lastUserAnswer, setLastUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<Feedback>('none');
  const [justAwardedXp, setJustAwardedXp] = useState(false);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [retryCount, setRetryCount] = useState(0);

  // Every authored lesson has exactly one explanation and one challenge
  // activity — every lesson always starts with its concept explanation.
  const explanationActivity = getExplanationActivity(lesson)!;
  const challenge = getPrimaryChallenge(lesson)!;
  const challengeIndex = lesson.activities.findIndex((a) => a.type !== 'explanation');

  // Explanation activities are visible (and so "done") the moment the lesson
  // loads; a challenge activity is "done" once solved. A review of an
  // already-completed lesson starts with the challenge marked done too.
  const [completedActivityIndices, setCompletedActivityIndices] = useState<Set<number>>(() => {
    const indices = lesson.activities.flatMap((a, i) => (a.type === 'explanation' ? [i] : []));
    if (alreadyCompleted && challengeIndex !== -1) indices.push(challengeIndex);
    return new Set(indices);
  });

  useEffect(() => {
    let cancelled = false;
    if (language === 'python' && status === 'ready') {
      runPython(explanationActivity.example.code)
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
  }, [language, status, explanationActivity.example.code, runPython]);

  const displayedOutput = liveOutput ?? explanationActivity.example.output;
  const progressPct = Math.round((lesson.order / totalLessons) * 100);
  const isBossChallenge = challenge.type === 'fix-the-bug';

  function handleChallengeSubmit(isCorrect: boolean, userAnswerText: string) {
    if (feedback === 'correct') return;
    setLastUserAnswer(userAnswerText);

    if (isCorrect) {
      setFeedback('correct');
      setCompletedActivityIndices((prev) =>
        prev.has(challengeIndex) ? prev : new Set(prev).add(challengeIndex),
      );
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
    setFeedback('none');
    setRetryCount((n) => n + 1);
    tutor.reset();
  }

  function handleAskTutor() {
    const { code, correctAnswer } = describeChallenge(challenge);
    tutor.askTutor({
      lessonTitle: lesson.title,
      explanation: explanationActivity.text,
      challengeCode: code,
      challengePrompt: challenge.prompt,
      correctAnswer,
      staticHints: challenge.hints,
      staticExplanation: challenge.wrongAnswerExplanation,
      userAnswer: lastUserAnswer,
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
        className="mb-4 inline-flex items-center gap-2 rounded-xl px-2 py-1.5 text-sm font-semibold text-moss-700 transition hover:bg-parchment-100 hover:text-moss-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-robot-cyan-500 dark:text-parchment-400 dark:hover:bg-pine-800 dark:hover:text-parchment-100"
      >
        <ArrowLeft size={16} /> Back to lessons
      </button>

      <header className="overflow-hidden rounded-[26px] border border-moss-200 bg-parchment-50 shadow-sm dark:border-moss-800/50 dark:bg-pine-900">
        <div className="relative overflow-hidden px-5 py-5 sm:px-7 sm:py-6">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-cover bg-[center_65%]"
            style={{ backgroundImage: `url(${bgFloatingIslands})` }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-moss-900/88 via-moss-900/75 to-moss-900/45 dark:from-pine-950/92 dark:via-pine-950/82 dark:to-pine-950/55"
          />
          <div className="relative flex flex-col justify-between gap-4 text-white sm:flex-row sm:items-end">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.16em] text-dawn-sand-200">
                {trackTitle} · Lesson {lesson.order} of {totalLessons}
              </div>
              <h1 className="font-display mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{lesson.title}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-xs font-bold backdrop-blur">
                  <Compass size={13} /> +{lesson.xpReward} XP
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-xs font-bold backdrop-blur">
                  <ListChecks size={13} /> {completedActivityIndices.size} / {lesson.activities.length} activities
                </div>
              </div>
            </div>
            <div className="w-full sm:w-56">
              <div className="mb-1.5 flex items-center justify-between text-xs font-semibold text-white/80">
                <span>Track progress</span>
                <span>{progressPct}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/20">
                <div className="h-full rounded-full bg-dawn-sand-300" style={{ width: `${progressPct}%` }} />
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
              className="flex shrink-0 items-center gap-1.5 rounded-xl border border-dawn-sand-300/70 bg-parchment-100 px-3 py-2 text-xs font-bold text-moss-800 transition hover:border-moss-400 hover:bg-moss-50 hover:text-moss-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-robot-cyan-500 dark:border-dawn-sand-800/50 dark:bg-pine-800 dark:text-parchment-300 dark:hover:border-moss-600 dark:hover:bg-moss-500/10 dark:hover:text-moss-300"
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
            className="scroll-mt-24 rounded-2xl border border-parchment-200 bg-parchment-50 p-5 shadow-sm dark:border-pine-800 dark:bg-pine-900 sm:p-6"
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.14em] text-moss-600 dark:text-moss-400">Step 1</div>
                <h2 className="font-display mt-1 text-lg font-bold text-pine-900 dark:text-parchment-50">Understand the idea</h2>
              </div>
              <div className="hidden h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-moss-100 to-robot-cyan-100 dark:from-moss-800/40 dark:to-robot-cyan-900/30 sm:flex">
                <Mascot size={50} variant="head" />
              </div>
            </div>
            <p className="text-[15px] leading-7 text-pine-800/90 dark:text-parchment-300">{explanationActivity.text}</p>
          </section>

          <section
            id="section-example"
            className="scroll-mt-24 rounded-2xl border border-parchment-200 bg-parchment-50 p-5 shadow-sm dark:border-pine-800 dark:bg-pine-900 sm:p-6"
          >
            <div className="mb-4">
              <div className="text-xs font-bold uppercase tracking-[0.14em] text-robot-cyan-600 dark:text-robot-cyan-400">Step 2</div>
              <h2 className="font-display mt-1 text-lg font-bold text-pine-900 dark:text-parchment-50">See it run</h2>
              <p className="mt-1 text-sm text-moss-700/80 dark:text-parchment-400">Read the code first, then compare it with the output.</p>
            </div>

            <CodeBlock code={explanationActivity.example.code} language={language} />

            <div className="mt-3 overflow-hidden rounded-xl border border-parchment-200 dark:border-pine-700">
              <div className="flex items-center justify-between bg-parchment-100 px-4 py-2 dark:bg-pine-800">
                <span className="text-xs font-bold uppercase tracking-wide text-moss-700 dark:text-parchment-400">Output</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${status === 'ready' && liveOutput !== null ? 'bg-moss-100 text-moss-700 dark:bg-moss-500/15 dark:text-moss-300' : 'bg-parchment-200 text-moss-700 dark:bg-pine-700 dark:text-parchment-300'}`}>
                  {status === 'ready' && liveOutput !== null ? 'Live Python' : 'Example output'}
                </span>
              </div>
              <pre className="bg-parchment-50 px-4 py-3 font-mono text-sm whitespace-pre-wrap text-pine-800 dark:bg-pine-950 dark:text-parchment-100">{displayedOutput}</pre>
            </div>
          </section>

          <section
            id="section-challenge"
            className={`scroll-mt-24 rounded-2xl border p-5 shadow-sm sm:p-6 ${
              isBossChallenge
                ? 'border-dusk-lavender-300 bg-gradient-to-br from-dusk-lavender-50 via-parchment-50 to-bloom-coral-50 dark:border-dusk-lavender-600 dark:from-dusk-lavender-900/70 dark:via-dusk-lavender-950/60 dark:to-bloom-coral-950/40'
                : 'border-parchment-200 bg-parchment-50 dark:border-pine-800 dark:bg-pine-900'
            }`}
          >
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${isBossChallenge ? 'bg-dusk-lavender-600 text-white' : 'bg-dawn-sand-100 text-dawn-sand-700 dark:bg-dawn-sand-500/10 dark:text-dawn-sand-300'}`}>
                  {isBossChallenge ? <Swords size={22} /> : <Target size={21} />}
                </div>
                <div>
                  <div className={`text-xs font-bold uppercase tracking-[0.14em] ${isBossChallenge ? 'text-dusk-lavender-600 dark:text-dusk-lavender-400' : 'text-dawn-sand-700 dark:text-dawn-sand-400'}`}>
                    Step 3 · {isBossChallenge ? 'Boss Challenge' : 'Practice'}
                  </div>
                  <h2 className="font-display mt-1 text-lg font-bold text-pine-900 dark:text-parchment-50">{CHALLENGE_LABEL[challenge.type]}</h2>
                </div>
              </div>
              <span className="rounded-full bg-dawn-sand-100 px-2.5 py-1 text-xs font-black text-dawn-sand-800 dark:bg-dawn-sand-500/10 dark:text-dawn-sand-300">+{lesson.xpReward} XP</span>
            </div>

            <ChallengeBody
              key={retryCount}
              activity={challenge}
              language={language}
              disabled={feedback === 'correct'}
              onSubmit={handleChallengeSubmit}
            />

            {feedback === 'correct' && (
              <div className="animate-pop-in mt-4 rounded-2xl border border-moss-200 bg-moss-50 p-4 dark:border-moss-800 dark:bg-moss-950/40">
                <div className="flex flex-wrap items-center gap-2 font-bold text-moss-700 dark:text-moss-300">
                  <CheckCircle2 size={20} />
                  <span>Correct!</span>
                  {justAwardedXp && (
                    <span className="rounded-full bg-moss-600 px-2.5 py-1 text-xs font-black text-white">+{lesson.xpReward} XP</span>
                  )}
                </div>
                <p className="mt-1.5 text-sm text-moss-700/85 dark:text-moss-300/80">
                  {justAwardedXp
                    ? wrongAttempts === 0
                      ? 'Mastered on the first try. Nice work.'
                      : `Solved after ${wrongAttempts} ${wrongAttempts === 1 ? 'retry' : 'retries'}.`
                    : 'You already completed this lesson, so this was a review run.'}
                </p>
                <button
                  type="button"
                  onClick={hasNextLesson ? onGoNext : onBack}
                  className="mt-3 inline-flex items-center gap-2 rounded-xl bg-moss-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-moss-700"
                >
                  {hasNextLesson ? 'Next lesson' : 'Back to your path'} <ArrowRight size={16} />
                </button>
              </div>
            )}

            {feedback === 'incorrect' && (
              <div className="mt-4 rounded-2xl border border-dawn-sand-200 bg-dawn-sand-50 p-4 dark:border-dawn-sand-800 dark:bg-dawn-sand-950/30">
                <div className="flex items-center gap-2 font-bold text-dawn-sand-900 dark:text-dawn-sand-300">
                  <Lightbulb size={18} /> Not quite — use the explanation, then try again.
                </div>
                <p className="mt-2 text-sm leading-6 text-dawn-sand-900/90 dark:text-dawn-sand-200">{challenge.wrongAnswerExplanation}</p>
                <div className="mt-2 rounded-xl bg-parchment-50/80 px-3 py-2 text-sm italic text-dawn-sand-900 dark:bg-pine-900/50 dark:text-dawn-sand-300">
                  Hint: {challenge.hints[0]}
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="rounded-xl border border-dawn-sand-300 bg-parchment-50 px-3.5 py-2 text-sm font-bold text-dawn-sand-800 transition hover:bg-dawn-sand-100 dark:border-dawn-sand-700 dark:bg-pine-900 dark:text-dawn-sand-300 dark:hover:bg-pine-800"
                  >
                    Try again
                  </button>
                  {tutor.status !== 'ready' && (
                    <button
                      type="button"
                      onClick={handleAskTutor}
                      disabled={tutor.status === 'loading'}
                      className="rounded-xl border border-dusk-lavender-300 bg-parchment-50 px-3.5 py-2 text-sm font-bold text-dusk-lavender-700 transition hover:bg-dusk-lavender-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-dusk-lavender-700 dark:bg-pine-900 dark:text-dusk-lavender-300 dark:hover:bg-pine-800"
                    >
                      {tutor.status === 'loading' ? '🤖 Thinking…' : '🤖 Ask AI Tutor'}
                    </button>
                  )}
                </div>

                {tutor.status === 'unavailable' && (
                  <p className="mt-2 text-xs text-dawn-sand-700 dark:text-dawn-sand-500">AI Tutor is unavailable right now. The built-in hint above still works.</p>
                )}

                {tutor.status === 'ready' && tutor.hint && (
                  <div className="animate-pop-in mt-3 rounded-xl border border-dusk-lavender-200 bg-dusk-lavender-50 p-3 dark:border-dusk-lavender-800 dark:bg-dusk-lavender-950/40">
                    <div className="text-xs font-bold uppercase tracking-[0.14em] text-dusk-lavender-600 dark:text-dusk-lavender-400">🤖 AI Tutor</div>
                    <p className="mt-1 text-sm leading-6 text-dusk-lavender-900 dark:text-dusk-lavender-200">{tutor.hint}</p>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-3">
            <div className="rounded-2xl border border-parchment-200 bg-parchment-50 p-4 shadow-sm dark:border-pine-800 dark:bg-pine-900">
              <div className="flex justify-center">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-moss-100 to-robot-cyan-100 dark:from-moss-800/40 dark:to-robot-cyan-900/30">
                  <Mascot size={88} variant="head" />
                </div>
              </div>
              <div className="font-display mt-3 text-center text-sm font-bold text-pine-900 dark:text-parchment-50">Learn in small steps</div>
              <p className="mt-1 text-center text-xs leading-5 text-moss-700/80 dark:text-parchment-400">Understand the concept first. Then use the challenge to prove it to yourself.</p>
            </div>

            <div className="rounded-2xl border border-robot-cyan-200 bg-robot-cyan-50 p-4 dark:border-robot-cyan-800 dark:bg-robot-cyan-500/10">
              <div className="text-xs font-bold uppercase tracking-[0.14em] text-robot-cyan-700 dark:text-robot-cyan-300">Python runtime</div>
              <div className="font-display mt-2 text-sm font-bold text-pine-900 dark:text-parchment-50">
                {status === 'ready' ? '✓ Ready in your browser' : status === 'loading' ? 'Loading Python…' : 'Using saved example output'}
              </div>
              <p className="mt-1 text-xs leading-5 text-robot-cyan-800/70 dark:text-robot-cyan-200/70">Examples run with Pyodide when available. No local Python installation is required.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
