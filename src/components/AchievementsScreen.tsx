import { achievements } from '../data/achievements';

interface AchievementsScreenProps {
  unlockedAchievementIds: string[];
}

export default function AchievementsScreen({
  unlockedAchievementIds,
}: AchievementsScreenProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-display text-2xl font-bold text-pine-900 dark:text-parchment-50">
        Achievements
      </h1>
      <p className="mt-1 text-moss-700/80 dark:text-parchment-400">
        {unlockedAchievementIds.length} of {achievements.length} unlocked.
      </p>

      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {achievements.map((achievement) => {
          const unlocked = unlockedAchievementIds.includes(achievement.id);
          return (
            <li
              key={achievement.id}
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${
                unlocked
                  ? 'border-dawn-sand-200 bg-dawn-sand-50 dark:border-dawn-sand-800 dark:bg-dawn-sand-950/40'
                  : 'border-parchment-200 bg-parchment-100 opacity-60 dark:border-pine-800 dark:bg-pine-900/50'
              }`}
            >
              <span className={`text-2xl ${unlocked ? '' : 'grayscale'}`}>
                {achievement.icon}
              </span>
              <div>
                <div className="font-semibold text-pine-900 dark:text-parchment-100">
                  {achievement.title}
                </div>
                <div className="text-sm text-moss-700/80 dark:text-parchment-400">
                  {achievement.description}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
