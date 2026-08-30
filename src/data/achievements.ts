import { aiDeveloperTrack, foundationsTrack } from './lessons';

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
    description: 'Complete your first Python lesson.',
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
    description: 'Keep a 7-day learning streak going.',
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
    title: 'Python Foundations Graduate',
    description: 'Complete every Python Foundations lesson.',
    icon: '🎓',
  },
  {
    id: 'python-builder',
    title: 'Python Builder',
    description: 'Start the intermediate Python track.',
    icon: '🐍',
  },
  {
    id: 'project-builder',
    title: 'Project Builder',
    description: 'Complete your first Python project.',
    icon: '🛠️',
  },
  {
    id: 'ai-ready',
    title: 'AI Ready',
    description: 'Complete the Python Builder track and unlock the next AI learning phase.',
    icon: '🤖',
  },
];

export interface AchievementProgressInput {
  completedLessonIds: string[];
  streak: number;
  xp: number;
  selectedPath: string | null;
  lessonAttempts: Record<string, number>;
}

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

  if (input.completedLessonIds.some((id) => aiDeveloperTrack.lessons.some((l) => l.id === id))) {
    unlocked.push('python-builder');
  }

  if (
    input.completedLessonIds.some((id) =>
      aiDeveloperTrack.lessons.some((l) => l.id === id && l.isProject),
    )
  ) {
    unlocked.push('project-builder');
  }

  if (aiDeveloperTrack.lessons.every((l) => input.completedLessonIds.includes(l.id))) {
    unlocked.push('ai-ready');
  }

  return unlocked;
}
