import { useCallback, useEffect, useState } from 'react';
import { lessons } from '../data/lessons';

const STORAGE_KEY = 'codequest.progress.v1';

interface ProgressState {
  xp: number;
  completedLessonIds: string[];
  streak: number;
  lastVisitedDate: string | null;
}

const DEFAULT_STATE: ProgressState = {
  xp: 0,
  completedLessonIds: [],
  streak: 0,
  lastVisitedDate: null,
};

function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    if (
      typeof parsed?.xp === 'number' &&
      Array.isArray(parsed?.completedLessonIds)
    ) {
      return {
        xp: parsed.xp,
        completedLessonIds: parsed.completedLessonIds,
        streak: typeof parsed.streak === 'number' ? parsed.streak : 0,
        lastVisitedDate:
          typeof parsed.lastVisitedDate === 'string' ? parsed.lastVisitedDate : null,
      };
    }
    return DEFAULT_STATE;
  } catch {
    return DEFAULT_STATE;
  }
}

// Local calendar day (not UTC), so a "day" lines up with the learner's clock.
function todayLocalDate(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function daysBetween(a: string, b: string): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  const da = new Date(`${a}T00:00:00`).getTime();
  const db = new Date(`${b}T00:00:00`).getTime();
  return Math.round((db - da) / msPerDay);
}

// Roll the visit streak forward for today, once, as part of loading state —
// this is what "visiting" means, so it belongs with initial state, not a
// separate effect that would cause an extra render right after mount.
function withTodaysVisit(prev: ProgressState): ProgressState {
  const today = todayLocalDate();
  if (prev.lastVisitedDate === today) return prev;
  const gap = prev.lastVisitedDate ? daysBetween(prev.lastVisitedDate, today) : null;
  const streak = gap === 1 ? prev.streak + 1 : 1;
  return { ...prev, streak, lastVisitedDate: today };
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressState>(() =>
    withTodaysVisit(loadProgress()),
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const isLessonUnlocked = useCallback(
    (lessonId: string) => {
      const lesson = lessons.find((l) => l.id === lessonId);
      if (!lesson) return false;
      if (lesson.order === 1) return true;
      const previous = lessons.find((l) => l.order === lesson.order - 1);
      return previous ? progress.completedLessonIds.includes(previous.id) : true;
    },
    [progress.completedLessonIds],
  );

  const isLessonCompleted = useCallback(
    (lessonId: string) => progress.completedLessonIds.includes(lessonId),
    [progress.completedLessonIds],
  );

  const completeLesson = useCallback((lessonId: string, xpReward: number) => {
    setProgress((prev) => {
      if (prev.completedLessonIds.includes(lessonId)) return prev;
      return {
        ...prev,
        xp: prev.xp + xpReward,
        completedLessonIds: [...prev.completedLessonIds, lessonId],
      };
    });
  }, []);

  return {
    xp: progress.xp,
    completedLessonIds: progress.completedLessonIds,
    streak: progress.streak,
    isLessonUnlocked,
    isLessonCompleted,
    completeLesson,
  };
}
