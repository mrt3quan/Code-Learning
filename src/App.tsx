import { useState } from 'react';
import { foundationsTrack, tracks, findLessonWithTrack, type PathId } from './data/lessons';
import { useProgress } from './hooks/useProgress';
import { useTheme } from './hooks/useTheme';
import Header from './components/Header';
import HomeScreen from './components/HomeScreen';
import PathChoiceScreen from './components/PathChoiceScreen';
import LessonScreen from './components/LessonScreen';
import AchievementsScreen from './components/AchievementsScreen';
import AchievementToast from './components/AchievementToast';

type View =
  | { screen: 'track-home'; trackId: string }
  | { screen: 'path-choice' }
  | { screen: 'lesson'; lessonId: string };

export default function App() {
  const [view, setView] = useState<View>({
    screen: 'track-home',
    trackId: foundationsTrack.id,
  });
  const [showAchievements, setShowAchievements] = useState(false);
  const {
    xp,
    streak,
    unlockedAchievementIds,
    justUnlocked,
    clearJustUnlocked,
    isFoundationsComplete,
    isLessonUnlocked,
    isLessonCompleted,
    getMastery,
    completeLesson,
    selectPath,
  } = useProgress();
  const { theme, toggleTheme } = useTheme();

  const currentLesson =
    view.screen === 'lesson' ? findLessonWithTrack(view.lessonId) : undefined;

  function goToTrackHome(trackId: string) {
    setView({ screen: 'track-home', trackId });
  }

  function goToLesson(lessonId: string) {
    if (isLessonUnlocked(lessonId)) {
      setView({ screen: 'lesson', lessonId });
    }
  }

  function handleChoosePath(path: PathId) {
    selectPath(path);
    goToTrackHome('ai-developer');
  }

  const activeTrack =
    view.screen === 'track-home'
      ? (tracks.find((t) => t.id === view.trackId) ?? foundationsTrack)
      : undefined;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header
        xp={xp}
        streak={streak}
        achievementCount={unlockedAchievementIds.length}
        currentLessonTitle={currentLesson ? currentLesson.lesson.title : null}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenAchievements={() => setShowAchievements(true)}
      />

      <AchievementToast achievementIds={justUnlocked} onDismiss={clearJustUnlocked} />

      {view.screen === 'lesson' && currentLesson && (() => {
        const { lesson, track } = currentLesson;
        const nextLesson = track.lessons.find((l) => l.order === lesson.order + 1);
        return (
          <LessonScreen
            key={lesson.id}
            lesson={lesson}
            alreadyCompleted={isLessonCompleted(lesson.id)}
            hasNextLesson={Boolean(nextLesson)}
            onBack={() => goToTrackHome(track.id)}
            onComplete={(wrongAttempts) =>
              completeLesson(lesson.id, lesson.xpReward, wrongAttempts)
            }
            onGoNext={() => nextLesson && goToLesson(nextLesson.id)}
          />
        );
      })()}

      {view.screen === 'path-choice' && (
        <PathChoiceScreen
          onBack={() => goToTrackHome(foundationsTrack.id)}
          onChoosePath={handleChoosePath}
        />
      )}

      {view.screen === 'track-home' && activeTrack && (
        <HomeScreen
          track={activeTrack}
          isLessonUnlocked={isLessonUnlocked}
          isLessonCompleted={isLessonCompleted}
          getMastery={getMastery}
          onSelectLesson={goToLesson}
          showPathChoiceCta={
            activeTrack.id === foundationsTrack.id && isFoundationsComplete
          }
          onChoosePath={() => setView({ screen: 'path-choice' })}
          onBackToFoundations={
            activeTrack.id !== foundationsTrack.id
              ? () => goToTrackHome(foundationsTrack.id)
              : undefined
          }
        />
      )}

      {/* Rendered as an overlay, not a view swap, so the screen underneath
          (an in-progress lesson especially) never unmounts and loses state. */}
      {showAchievements && (
        <div className="fixed inset-0 z-40 overflow-y-auto bg-slate-50 dark:bg-slate-950">
          <AchievementsScreen
            unlockedAchievementIds={unlockedAchievementIds}
            onBack={() => setShowAchievements(false)}
          />
        </div>
      )}
    </div>
  );
}
