import { useCallback, useEffect, useState } from 'react';
import { lessons } from '../data/lessons';

const STORAGE_KEY = 'codequest.progress.v1';

interface ProgressState {
  xp: number;
  completedLessonIds: string[];
}

const DEFAULT_STATE: ProgressState = {
  xp: 0,
  completedLessonIds: [],
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
      return parsed as ProgressState;
    }
    return DEFAULT_STATE;
  } catch {
    return DEFAULT_STATE;
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressState>(loadProgress);

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
        xp: prev.xp + xpReward,
        completedLessonIds: [...prev.completedLessonIds, lessonId],
      };
    });
  }, []);

  return {
    xp: progress.xp,
    completedLessonIds: progress.completedLessonIds,
    isLessonUnlocked,
    isLessonCompleted,
    completeLesson,
  };
}
