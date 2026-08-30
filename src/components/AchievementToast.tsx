import { useEffect } from 'react';
import { achievements } from '../data/achievements';

interface AchievementToastProps {
  achievementIds: string[];
  onDismiss: () => void;
}

export default function AchievementToast({ achievementIds, onDismiss }: AchievementToastProps) {
  useEffect(() => {
    if (achievementIds.length === 0) return;
    const timer = setTimeout(onDismiss, 4500);
    return () => clearTimeout(timer);
  }, [achievementIds, onDismiss]);

  if (achievementIds.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {achievementIds.map((id) => {
        const achievement = achievements.find((a) => a.id === id);
        if (!achievement) return null;
        return (
          <div
            key={id}
            className="animate-pop-in flex items-center gap-3 rounded-xl border border-dawn-sand-300 bg-parchment-50 px-4 py-3 shadow-lg dark:border-dawn-sand-700 dark:bg-pine-800"
          >
            <span className="text-2xl">{achievement.icon}</span>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-dawn-sand-600 dark:text-dawn-sand-400">
                Achievement unlocked
              </div>
              <div className="font-display font-bold text-pine-900 dark:text-parchment-100">
                {achievement.title}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
