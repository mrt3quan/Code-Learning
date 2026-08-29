import { useState } from 'react';
import { foundationsTrack, tracks, findLessonWithTrack, type PathId } from './data/lessons';
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
import ComingSoonScreen from './components/ComingSoonScreen';
import PathChoiceScreen from './components/PathChoiceScreen';
import LessonScreen from './components/LessonScreen';
import AchievementToast from './components/AchievementToast';

type View = { screen: 'nav' } | { screen: 'path-choice' } | { screen: 'lesson'; lessonId: string };

export default function App() {
  const [activeNav, setActiveNav] = useState<NavKey>('dashboard');
  const [view, setView] = useState<View>({ screen: 'nav' });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const {
    xp,
    streak,
    selectedPath,
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

  // The track a "current activity" view (Dashboard's map, Lessons' default
  // tab) should show: Foundations until it's done, then whichever path was
  // chosen, falling back to Foundations if none has been chosen yet.
  function resolveActiveTrackId(): string {
    if (!isFoundationsComplete) return foundationsTrack.id;
    if (selectedPath === 'python') return 'ai-developer';
    if (selectedPath === 'cpp') return 'game-developer';
    return foundationsTrack.id;
  }

  function goToNav(nav: NavKey) {
    setActiveNav(nav);
    setView({ screen: 'nav' });
    setMobileMenuOpen(false);
  }

  function goToLesson(lessonId: string) {
    if (isLessonUnlocked(lessonId)) {
      setView({ screen: 'lesson', lessonId });
    }
  }

  function handleChoosePath(path: PathId) {
    selectPath(path);
    setActiveNav('dashboard');
    setView({ screen: 'nav' });
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="hidden md:block">
        <Sidebar active={activeNav} onNavigate={goToNav} />
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <Sidebar active={activeNav} onNavigate={goToNav} onClose={() => setMobileMenuOpen(false)} />
          <div
            className="flex-1 bg-black/40"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
        </div>
      )}

      <div className="flex min-h-screen flex-1 flex-col">
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

          {view.screen === 'path-choice' && (
            <PathChoiceScreen onBack={() => goToNav('dashboard')} onChoosePath={handleChoosePath} />
          )}

          {view.screen === 'nav' && activeNav === 'dashboard' && (
            <DashboardScreen
              activeTrack={tracks.find((t) => t.id === resolveActiveTrackId()) ?? foundationsTrack}
              isLessonUnlocked={isLessonUnlocked}
              isLessonCompleted={isLessonCompleted}
              onSelectLesson={goToLesson}
              showPathChoiceCta={isFoundationsComplete && selectedPath === null}
              onChoosePath={() => setView({ screen: 'path-choice' })}
              unlockedAchievementIds={unlockedAchievementIds}
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
              isFoundationsComplete={isFoundationsComplete}
              onChoosePath={() => setView({ screen: 'path-choice' })}
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

          {view.screen === 'nav' && activeNav === 'community' && (
            <ComingSoonScreen
              title="Community"
              icon="👥"
              description="Connect with other learners, share progress, and help each other out."
            />
          )}

          {view.screen === 'nav' && activeNav === 'store' && (
            <ComingSoonScreen
              title="Store"
              icon="🛍️"
              description="Spend XP on themes, avatars, and boosts."
            />
          )}
        </main>
      </div>
    </div>
  );
}
