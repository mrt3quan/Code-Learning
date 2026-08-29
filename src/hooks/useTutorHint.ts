import { useCallback, useState } from 'react';

export interface TutorHintRequest {
  lessonTitle: string;
  explanation: string;
  challengeCode: string;
  challengePrompt: string;
  correctAnswer: string;
  staticHint: string;
  staticExplanation: string;
  userAnswer: string;
  wrongAttempts: number;
}

export type TutorHintStatus = 'idle' | 'loading' | 'ready' | 'unavailable';

// On-demand only — the tutor is never called automatically on a wrong
// answer, only when the learner asks for it, so a missing/unconfigured
// key or a slow network never blocks the (free, instant) static hint.
export function useTutorHint() {
  const [status, setStatus] = useState<TutorHintStatus>('idle');
  const [hint, setHint] = useState<string | null>(null);

  const askTutor = useCallback(async (req: TutorHintRequest) => {
    const url = import.meta.env.VITE_TUTOR_API_URL;
    if (!url) {
      setStatus('unavailable');
      return;
    }

    setStatus('loading');
    setHint(null);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(req),
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`Tutor request failed: ${res.status}`);
      const data = await res.json();
      if (!data.hint) throw new Error('Empty tutor response');
      setHint(data.hint);
      setStatus('ready');
    } catch {
      setStatus('unavailable');
    } finally {
      clearTimeout(timeout);
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setHint(null);
  }, []);

  return { status, hint, askTutor, reset };
}
