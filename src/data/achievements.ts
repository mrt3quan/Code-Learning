// Achievements for milestones the app already tracks. This mirrors the
// mastery indicator's "basic, not a full system" scope: no separate
// tracking infrastructure, just thresholds evaluated against progress
// state that already exists (completed lessons, streak, XP, path, mastery).

import { aiDeveloperTrack, foundationsTrack, gameDeveloperTrack } from './lessons';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const achievements: Achievement[] = [
  {
    id: 'hello-world',
    title: 'Hello, World!',
    description: 'Complete your first lesson.',
    icon: '👋',
  },
  {
    id: 'quick-learner',
    title: 'Quick Learner',
    description: 'Solve a challenge on the first try.',
    icon: '⚡',
  },
  {
    id: 'streak-starter',
    title: 'Streak Starter',
    description: 'Visit two days in a row.',
    icon: '🔥',
  },
  {
    id: 'week-streak',
    title: 'Week Streak',
    description: 'Keep a 7-day visit streak going.',
    icon: '🗓️',
  },
  {
    id: 'century-xp',
    title: 'Century',
    description: 'Earn 100 XP.',
    icon: '💯',
  },
  {
    id: 'foundations-grad',
    title: 'Foundations Graduate',
    description: 'Complete every Programming Foundations lesson.',
    icon: '🎓',
  },
  {
    id: 'path-chosen',
    title: 'Path Chosen',
    description: 'Pick your specialization track.',
    icon: '🧭',
  },
  {
    id: 'ai-developer',
    title: 'AI Developer',
    description: 'Complete the AI Developer track.',
    icon: '🤖',
  },
  {
    id: 'game-developer',
    title: 'Game Developer',
    description: 'Complete the Game Developer track.',
    icon: '🎮',
  },
];

export interface AchievementProgressInput {
  completedLessonIds: string[];
  streak: number;
  xp: number;
  selectedPath: string | null;
  lessonAttempts: Record<string, number>;
}

// Recomputed from current state each time, rather than hand-toggled at each
// call site — the source of truth (lessons completed, streak, xp, path) is
// already tracked, so this just reads thresholds off it.
export function evaluateAchievements(input: AchievementProgressInput): string[] {
  const unlocked: string[] = [];

  if (input.completedLessonIds.length >= 1) unlocked.push('hello-world');

  if (Object.values(input.lessonAttempts).some((attempts) => attempts === 0)) {
    unlocked.push('quick-learner');
  }

  if (input.streak >= 2) unlocked.push('streak-starter');
  if (input.streak >= 7) unlocked.push('week-streak');
  if (input.xp >= 100) unlocked.push('century-xp');

  if (foundationsTrack.lessons.every((l) => input.completedLessonIds.includes(l.id))) {
    unlocked.push('foundations-grad');
  }

  if (input.selectedPath !== null) unlocked.push('path-chosen');

  if (aiDeveloperTrack.lessons.every((l) => input.completedLessonIds.includes(l.id))) {
    unlocked.push('ai-developer');
  }

  if (gameDeveloperTrack.lessons.every((l) => input.completedLessonIds.includes(l.id))) {
    unlocked.push('game-developer');
  }

  return unlocked;
}
