import { useState } from 'react';
import { foundationsTrack, tracks, findLessonWithTrack } from './data/lessons';
import { useProgress } from './hooks/useProgress';
import { useTheme } from './hooks/useTheme';
import Header from './components/Header';
import Sidebar, { type NavKey } from './components/Sidebar';
import DashboardScreen from './components/DashboardScreen';
import MapScreen from './components/MapScreen';
import LessonsScreen from './components/LessonsScreen';
import ChallengesScreen from './components/ChallengesScreen';
import ProjectsScreen from './components/ProjectsScreen';
import AchievementsScreen from './components/AchievementsScreen';
import LessonScreen from './components/LessonScreen';
import AchievementToast from './components/AchievementToast';

type View = { screen: 'nav' } | { screen: 'lesson'; lessonId: string };

export default function App() {
  const [activeNav, setActiveNav] = useState<NavKey>('dashboard');
  const [view, setView] = useState<View>({ screen: 'nav' });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
  } = useProgress();
  const { theme, toggleTheme } = useTheme();

  const currentLesson =
    view.screen === 'lesson' ? findLessonWithTrack(view.lessonId) : undefined;

  function resolveActiveTrackId(): string {
    return isFoundationsComplete ? 'ai-developer' : foundationsTrack.id;
  }

  function goToNav(nav: NavKey) {
    setActiveNav(nav);
    setView({ screen: 'nav' });
    setMobileMenuOpen(false);
  }

  function goToLesson(lessonId: string) {
    if (isLessonUnlocked(lessonId)) {
      setView({ screen: 'lesson', lessonId });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  return (
    <div className="flex min-h-screen bg-[var(--page-bg)]">
      <div className="hidden md:block">
        <div className="sticky top-0 h-screen">
          <Sidebar active={activeNav} onNavigate={goToNav} />
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <Sidebar
            active={activeNav}
            onNavigate={goToNav}
            onClose={() => setMobileMenuOpen(false)}
          />
          <button
            type="button"
            className="flex-1 bg-slate-950/55 backdrop-blur-[2px]"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu overlay"
          />
        </div>
      )}

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Header
          xp={xp}
          streak={streak}
          currentLessonTitle={currentLesson ? currentLesson.lesson.title : null}
          theme={theme}
          onToggleTheme={toggleTheme}
          onOpenMenu={() => setMobileMenuOpen(true)}
        />

        <AchievementToast achievementIds={justUnlocked} onDismiss={clearJustUnlocked} />

        <main className="flex-1">
          {view.screen === 'lesson' && currentLesson && (() => {
            const { lesson, track } = currentLesson;
            const nextLesson = track.lessons.find((l) => l.order === lesson.order + 1);
            return (
              <LessonScreen
                key={lesson.id}
                lesson={lesson}
                language={track.language}
                totalLessons={track.lessons.length}
                trackTitle={track.title}
                alreadyCompleted={isLessonCompleted(lesson.id)}
                hasNextLesson={Boolean(nextLesson)}
                onBack={() => goToNav(activeNav)}
                onComplete={(wrongAttempts) =>
                  completeLesson(lesson.id, lesson.xpReward, wrongAttempts)
                }
                onGoNext={() => nextLesson && goToLesson(nextLesson.id)}
              />
            );
          })()}

          {view.screen === 'nav' && activeNav === 'dashboard' && (
            <DashboardScreen
              activeTrack={tracks.find((t) => t.id === resolveActiveTrackId()) ?? foundationsTrack}
              isLessonUnlocked={isLessonUnlocked}
              isLessonCompleted={isLessonCompleted}
              onSelectLesson={goToLesson}
              unlockedAchievementIds={unlockedAchievementIds}
              isFoundationsComplete={isFoundationsComplete}
            />
          )}

          {view.screen === 'nav' && activeNav === 'map' && (
            <MapScreen
              defaultTrackId={resolveActiveTrackId()}
              isLessonUnlocked={isLessonUnlocked}
              isLessonCompleted={isLessonCompleted}
              onSelectLesson={goToLesson}
            />
          )}

          {view.screen === 'nav' && activeNav === 'lessons' && (
            <LessonsScreen
              defaultTrackId={resolveActiveTrackId()}
              isLessonUnlocked={isLessonUnlocked}
              isLessonCompleted={isLessonCompleted}
              getMastery={getMastery}
              onSelectLesson={goToLesson}
            />
          )}

          {view.screen === 'nav' && activeNav === 'challenges' && (
            <ChallengesScreen
              isLessonUnlocked={isLessonUnlocked}
              isLessonCompleted={isLessonCompleted}
              onSelectLesson={goToLesson}
            />
          )}

          {view.screen === 'nav' && activeNav === 'projects' && (
            <ProjectsScreen
              isLessonUnlocked={isLessonUnlocked}
              isLessonCompleted={isLessonCompleted}
              onSelectLesson={goToLesson}
            />
          )}

          {view.screen === 'nav' && activeNav === 'achievements' && (
            <AchievementsScreen unlockedAchievementIds={unlockedAchievementIds} />
          )}
        </main>
      </div>
    </div>
  );
}
