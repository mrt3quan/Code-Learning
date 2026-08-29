import { achievements } from '../data/achievements';

interface AchievementsScreenProps {
  unlockedAchievementIds: string[];
}

export default function AchievementsScreen({
  unlockedAchievementIds,
}: AchievementsScreenProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
        Achievements
      </h1>
      <p className="mt-1 text-slate-500 dark:text-slate-400">
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
                  ? 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950'
                  : 'border-slate-200 bg-slate-50 opacity-60 dark:border-slate-800 dark:bg-slate-900/50'
              }`}
            >
              <span className={`text-2xl ${unlocked ? '' : 'grayscale'}`}>
                {achievement.icon}
              </span>
              <div>
                <div className="font-semibold text-slate-900 dark:text-slate-100">
                  {achievement.title}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
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
