import { useEffect, useState } from 'react';
import { BookOpen, Lightbulb, Target, Swords, CheckCircle2 } from 'lucide-react';
import type { ChallengeType, Language, Lesson } from '../data/lessons';
import { usePyodide } from '../hooks/usePyodide';
import { useTutorHint } from '../hooks/useTutorHint';
import CodeBlock from './CodeBlock';

interface LessonScreenProps {
  lesson: Lesson;
  language: Language;
  alreadyCompleted: boolean;
  hasNextLesson: boolean;
  onBack: () => void;
  onComplete: (wrongAttempts: number) => void;
  onGoNext: () => void;
}

type Feedback = 'none' | 'correct' | 'incorrect';

// Predicted program output is graded loosely (case doesn't change meaning
// for a beginner reading print() results); code the learner writes is
// graded case-sensitively, since Python identifiers and keywords are.
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

  // Only Python runs live, via Pyodide — there's no in-browser C++
  // toolchain, so C++ examples always show their pre-written output.
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (feedback === 'correct') return;

    const normalize =
      lesson.challenge.type === 'predict-output' ? normalizeOutput : normalizeCode;
    const isCorrect =
      normalize(answer) === normalize(lesson.challenge.correctAnswer);

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

  const isBossChallenge = lesson.challenge.type === 'fix-the-bug';

  function scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
      >
        ← Back to path
      </button>

      <h1 className="mb-4 text-2xl font-bold text-slate-900 dark:text-slate-50">
        Lesson {lesson.order}: {lesson.title}
      </h1>

      <div className="mb-6 flex gap-2 overflow-x-auto">
        {[
          { id: 'section-explain', label: 'Explain', Icon: BookOpen },
          { id: 'section-example', label: 'Example', Icon: Lightbulb },
          {
            id: 'section-challenge',
            label: isBossChallenge ? 'Boss Challenge' : 'Challenge',
            Icon: isBossChallenge ? Swords : Target,
          },
        ].map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => scrollToSection(s.id)}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-violet-300 hover:text-violet-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-violet-500 dark:hover:text-violet-400"
          >
            <s.Icon size={14} />
            {s.label}
          </button>
        ))}
      </div>

      <section id="section-explain" className="mt-6 scroll-mt-20">
        <p className="leading-relaxed text-slate-700 dark:text-slate-300">
          {lesson.explanation}
        </p>
      </section>

      <section id="section-example" className="mt-6 scroll-mt-20">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
          Example
        </h2>
        <CodeBlock code={lesson.example.code} language={language} />
        <div className="mt-2 rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
            Output {status === 'ready' && liveOutput !== null && '(live)'}
          </div>
          <pre className="font-mono text-sm whitespace-pre-wrap text-slate-800 dark:text-slate-100">
            {displayedOutput}
          </pre>
        </div>
      </section>

      <section
        id="section-challenge"
        className={`mt-8 scroll-mt-20 ${isBossChallenge ? 'rounded-2xl border border-violet-300 bg-gradient-to-br from-violet-50 to-fuchsia-50 p-5 dark:border-violet-700 dark:from-violet-950 dark:to-fuchsia-950' : ''}`}
      >
        {isBossChallenge ? (
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Swords size={26} className="text-violet-500 dark:text-violet-400" />
              <div>
                <div className="text-xs font-bold tracking-wide text-violet-500 dark:text-violet-400">
                  BOSS CHALLENGE
                </div>
                <div className="font-bold text-slate-900 dark:text-slate-50">Fix the Bug</div>
              </div>
            </div>
            <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
              +{lesson.xpReward} XP
            </span>
          </div>
        ) : (
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-violet-500 dark:text-violet-400">
            {CHALLENGE_LABEL[lesson.challenge.type]}
          </h2>
        )}
        <p className="mb-3 font-medium text-slate-800 dark:text-slate-200">
          {lesson.challenge.prompt}
        </p>
        <CodeBlock code={lesson.challenge.code} language={language} />

        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={feedback === 'correct'}
            placeholder={CHALLENGE_PLACEHOLDER[lesson.challenge.type]}
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none disabled:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:disabled:bg-slate-900"
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
          <div className="animate-pop-in mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4 dark:border-emerald-800 dark:bg-emerald-950">
            <div className="flex items-center gap-2 font-semibold text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 size={20} />
              <span>Correct!</span>
              {justAwardedXp && (
                <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-bold text-white">
                  +{lesson.xpReward} XP
                </span>
              )}
            </div>
            {justAwardedXp && (
              <p className="mt-1 text-sm text-emerald-600 dark:text-emerald-500">
                {wrongAttempts === 0
                  ? '🏆 Mastered — solved on the first try.'
                  : `Solved after ${wrongAttempts} ${wrongAttempts === 1 ? 'retry' : 'retries'}.`}
              </p>
            )}
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
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 dark:border-amber-800 dark:bg-amber-950">
            <div className="font-semibold text-amber-800 dark:text-amber-300">
              Not quite — here's what happens:
            </div>
            <p className="mt-1 text-sm leading-relaxed text-amber-900 dark:text-amber-200">
              {lesson.challenge.wrongAnswerExplanation}
            </p>
            <p className="mt-2 text-sm italic text-amber-700 dark:text-amber-400">
              Hint: {lesson.challenge.hint}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleRetry}
                className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-sm font-semibold text-amber-800 hover:bg-amber-100 dark:border-amber-700 dark:bg-slate-800 dark:text-amber-300 dark:hover:bg-slate-700"
              >
                Try again
              </button>
              {tutor.status !== 'ready' && (
                <button
                  type="button"
                  onClick={handleAskTutor}
                  disabled={tutor.status === 'loading'}
                  className="rounded-lg border border-violet-300 bg-white px-3 py-1.5 text-sm font-semibold text-violet-700 hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-violet-700 dark:bg-slate-800 dark:text-violet-300 dark:hover:bg-slate-700"
                >
                  {tutor.status === 'loading' ? '🤖 Thinking…' : '🤖 Ask AI Tutor'}
                </button>
              )}
            </div>

            {tutor.status === 'unavailable' && (
              <p className="mt-2 text-xs text-amber-600 dark:text-amber-500">
                AI Tutor isn't available right now — the hint above still applies.
              </p>
            )}

            {tutor.status === 'ready' && tutor.hint && (
              <div className="animate-pop-in mt-3 rounded-lg border border-violet-200 bg-violet-50 px-3 py-2.5 dark:border-violet-800 dark:bg-violet-950">
                <div className="text-xs font-semibold uppercase tracking-wide text-violet-500 dark:text-violet-400">
                  🤖 AI Tutor
                </div>
                <p className="mt-1 text-sm leading-relaxed text-violet-900 dark:text-violet-200">
                  {tutor.hint}
                </p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
