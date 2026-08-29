import { useState } from 'react';
import { lessons } from './data/lessons';
import { useProgress } from './hooks/useProgress';
import { useTheme } from './hooks/useTheme';
import Header from './components/Header';
import HomeScreen from './components/HomeScreen';
import LessonScreen from './components/LessonScreen';

export default function App() {
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const {
    xp,
    streak,
    isLessonUnlocked,
    isLessonCompleted,
    completeLesson,
  } = useProgress();
  const { theme, toggleTheme } = useTheme();

  const currentLesson = lessons.find((l) => l.id === currentLessonId) ?? null;
  const currentIndex = currentLesson
    ? lessons.findIndex((l) => l.id === currentLesson.id)
    : -1;
  const nextLesson =
    currentIndex >= 0 ? lessons[currentIndex + 1] : undefined;

  function goHome() {
    setCurrentLessonId(null);
  }

  function goToLesson(lessonId: string) {
    if (isLessonUnlocked(lessonId)) {
      setCurrentLessonId(lessonId);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header
        xp={xp}
        streak={streak}
        currentLessonTitle={currentLesson ? currentLesson.title : null}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {currentLesson ? (
        <LessonScreen
          key={currentLesson.id}
          lesson={currentLesson}
          alreadyCompleted={isLessonCompleted(currentLesson.id)}
          hasNextLesson={Boolean(nextLesson)}
          onBack={goHome}
          onComplete={() =>
            completeLesson(currentLesson.id, currentLesson.xpReward)
          }
          onGoNext={() => nextLesson && goToLesson(nextLesson.id)}
        />
      ) : (
        <HomeScreen
          isLessonUnlocked={isLessonUnlocked}
          isLessonCompleted={isLessonCompleted}
          onSelectLesson={goToLesson}
        />
      )}
    </div>
  );
}
