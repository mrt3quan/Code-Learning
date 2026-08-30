import { useCallback, useEffect, useState } from 'react';
import { foundationsTrack, findLessonWithTrack, type PathId } from '../data/lessons';
import { evaluateAchievements } from '../data/achievements';

const STORAGE_KEY = 'codequest.progress.v1';

interface ProgressState {
  xp: number;
  completedLessonIds: string[];
  streak: number;
  lastVisitedDate: string | null;
  selectedPath: PathId | null;
  lessonAttempts: Record<string, number>;
  unlockedAchievementIds: string[];
}

const DEFAULT_STATE: ProgressState = {
  xp: 0,
  completedLessonIds: [],
  streak: 0,
  lastVisitedDate: null,
  selectedPath: null,
  lessonAttempts: {},
  unlockedAchievementIds: [],
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
        selectedPath:
          parsed.selectedPath === 'cpp' || parsed.selectedPath === 'python'
            ? parsed.selectedPath
            : null,
        lessonAttempts:
          parsed.lessonAttempts && typeof parsed.lessonAttempts === 'object'
            ? parsed.lessonAttempts
            : {},
        unlockedAchievementIds: Array.isArray(parsed.unlockedAchievementIds)
          ? parsed.unlockedAchievementIds
          : [],
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

export type MasteryTier = 'mastered' | 'practiced' | 'needs-review';

// A basic per-lesson mastery signal, not a full skill tree: how many wrong
// submissions it took before the learner got the challenge right.
export function masteryTier(wrongAttempts: number): MasteryTier {
  if (wrongAttempts === 0) return 'mastered';
  if (wrongAttempts <= 2) return 'practiced';
  return 'needs-review';
}

// Achievements only ever change as a side effect of the three places
// progress itself changes (initial load/streak rollover, completing a
// lesson, choosing a path) — so this is called at each of those call
// sites directly, rather than as a separate reactive effect watching
// the whole state shape.
function mergeNewAchievements(
  state: ProgressState,
): { state: ProgressState; newlyEarned: string[] } {
  const eligible = evaluateAchievements({
    completedLessonIds: state.completedLessonIds,
    streak: state.streak,
    xp: state.xp,
    selectedPath: state.selectedPath,
    lessonAttempts: state.lessonAttempts,
  });
  const newlyEarned = eligible.filter((id) => !state.unlockedAchievementIds.includes(id));
  if (newlyEarned.length === 0) return { state, newlyEarned };
  return {
    state: {
      ...state,
      unlockedAchievementIds: [...state.unlockedAchievementIds, ...newlyEarned],
    },
    newlyEarned,
  };
}

function initialProgress(): { state: ProgressState; newlyEarned: string[] } {
  return mergeNewAchievements(withTodaysVisit(loadProgress()));
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressState>(
    () => initialProgress().state,
  );
  const [justUnlocked, setJustUnlocked] = useState<string[]>(
    () => initialProgress().newlyEarned,
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const clearJustUnlocked = useCallback(() => setJustUnlocked([]), []);

  const isFoundationsComplete = foundationsTrack.lessons.every((l) =>
    progress.completedLessonIds.includes(l.id),
  );

  const isLessonUnlocked = useCallback(
    (lessonId: string) => {
      const found = findLessonWithTrack(lessonId);
      if (!found) return false;
      const { lesson, track } = found;

      // Python-only phase: the intermediate Python track opens automatically
      // after Foundations. The dormant C++ track stays inaccessible until a
      // future product phase intentionally brings it back.
      if (track.pathId === 'cpp') return false;
      if (track.pathId === 'python' && !isFoundationsComplete) return false;

      if (lesson.order === 1) return true;
      const previous = track.lessons.find((l) => l.order === lesson.order - 1);
      return previous ? progress.completedLessonIds.includes(previous.id) : true;
    },
    [progress.completedLessonIds, isFoundationsComplete],
  );

  const isLessonCompleted = useCallback(
    (lessonId: string) => progress.completedLessonIds.includes(lessonId),
    [progress.completedLessonIds],
  );

  const getMastery = useCallback(
    (lessonId: string): MasteryTier | null => {
      if (!progress.completedLessonIds.includes(lessonId)) return null;
      return masteryTier(progress.lessonAttempts[lessonId] ?? 0);
    },
    [progress.completedLessonIds, progress.lessonAttempts],
  );

  const completeLesson = useCallback(
    (lessonId: string, xpReward: number, wrongAttempts: number) => {
      if (progress.completedLessonIds.includes(lessonId)) return;
      const { state, newlyEarned } = mergeNewAchievements({
        ...progress,
        xp: progress.xp + xpReward,
        completedLessonIds: [...progress.completedLessonIds, lessonId],
        lessonAttempts: { ...progress.lessonAttempts, [lessonId]: wrongAttempts },
      });
      setProgress(state);
      if (newlyEarned.length > 0) setJustUnlocked((j) => [...j, ...newlyEarned]);
    },
    [progress],
  );

  const selectPath = useCallback(
    (path: PathId) => {
      const { state, newlyEarned } = mergeNewAchievements({ ...progress, selectedPath: path });
      setProgress(state);
      if (newlyEarned.length > 0) setJustUnlocked((j) => [...j, ...newlyEarned]);
    },
    [progress],
  );

  return {
    xp: progress.xp,
    completedLessonIds: progress.completedLessonIds,
    streak: progress.streak,
    selectedPath: progress.selectedPath,
    unlockedAchievementIds: progress.unlockedAchievementIds,
    justUnlocked,
    clearJustUnlocked,
    isFoundationsComplete,
    isLessonUnlocked,
    isLessonCompleted,
    getMastery,
    completeLesson,
    selectPath,
  };
}
