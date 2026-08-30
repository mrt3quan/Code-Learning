import { useState } from 'react';
import { tracks, foundationsTrack, type Track } from '../data/lessons';
import type { MasteryTier } from '../hooks/useProgress';
import HomeScreen from './HomeScreen';
import TrackIcon from './TrackIcon';

interface LessonsScreenProps {
  defaultTrackId: string;
  isLessonUnlocked: (lessonId: string) => boolean;
  isLessonCompleted: (lessonId: string) => boolean;
  getMastery: (lessonId: string) => MasteryTier | null;
  onSelectLesson: (lessonId: string) => void;
}

export default function LessonsScreen({
  defaultTrackId,
  isLessonUnlocked,
  isLessonCompleted,
  getMastery,
  onSelectLesson,
}: LessonsScreenProps) {
  const openTracks = tracks.filter(
    (t) => t.language === 'python' && isLessonUnlocked(t.lessons[0].id),
  );
  const [selectedId, setSelectedId] = useState(defaultTrackId);
  const [trackIdForReset, setTrackIdForReset] = useState(defaultTrackId);
  if (defaultTrackId !== trackIdForReset) {
    setTrackIdForReset(defaultTrackId);
    setSelectedId(defaultTrackId);
  }

  const activeTrack: Track =
    openTracks.find((t) => t.id === selectedId) ?? openTracks[0] ?? foundationsTrack;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-6">
        <div className="text-xs font-bold uppercase tracking-[0.16em] text-moss-700 dark:text-moss-400">
          Course library
        </div>
        <h1 className="font-display mt-1 text-2xl font-bold tracking-tight text-pine-900 dark:text-parchment-50">
          Python Lessons
        </h1>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-moss-700/80 dark:text-parchment-400">
          Move in order the first time, then return to any completed lesson whenever you want a review.
        </p>
      </div>

      {openTracks.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-2 rounded-2xl border border-parchment-200 bg-parchment-50 p-2 shadow-sm dark:border-pine-800 dark:bg-pine-900">
          {openTracks.map((t, index) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedId(t.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-robot-cyan-500 ${
                activeTrack.id === t.id
                  ? 'bg-robot-cyan-600 text-white shadow-sm'
                  : 'text-moss-700 hover:bg-parchment-100 dark:text-parchment-300 dark:hover:bg-pine-800'
              }`}
            >
              <span className={`flex h-6 w-6 items-center justify-center rounded-lg text-[10px] font-black ${
                activeTrack.id === t.id ? 'bg-white/15' : 'bg-parchment-100 dark:bg-pine-800'
              }`}>
                {index + 1}
              </span>
              <TrackIcon language={t.language} size={18} />
              {t.title}
            </button>
          ))}
        </div>
      )}

      <HomeScreen
        track={activeTrack}
        isLessonUnlocked={isLessonUnlocked}
        isLessonCompleted={isLessonCompleted}
        getMastery={getMastery}
        onSelectLesson={onSelectLesson}
      />
    </div>
  );
}
