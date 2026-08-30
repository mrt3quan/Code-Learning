import { useState } from 'react';
import { tracks } from '../data/lessons';
import LearningMapCard from './LearningMapCard';
import TrackIcon from './TrackIcon';

interface MapScreenProps {
  defaultTrackId: string;
  isLessonUnlocked: (lessonId: string) => boolean;
  isLessonCompleted: (lessonId: string) => boolean;
  onSelectLesson: (lessonId: string) => void;
}

export default function MapScreen({
  defaultTrackId,
  isLessonUnlocked,
  isLessonCompleted,
  onSelectLesson,
}: MapScreenProps) {
  const openTracks = tracks.filter(
    (t) => t.language === 'python' && isLessonUnlocked(t.lessons[0].id),
  );
  const [selectedId, setSelectedId] = useState(defaultTrackId);
  const [trackIdForReset, setTrackIdForReset] = useState(defaultTrackId);
  if (defaultTrackId !== trackIdForReset) {
    setTrackIdForReset(defaultTrackId);
    setSelectedId(defaultTrackId);
  }

  const activeTrack = openTracks.find((t) => t.id === selectedId) ?? openTracks[0];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-6">
        <div className="text-xs font-bold uppercase tracking-[0.16em] text-moss-700 dark:text-moss-400">
          Course map
        </div>
        <h1 className="font-display mt-1 text-2xl font-bold tracking-tight text-pine-900 dark:text-parchment-50">
          Your Python Journey
        </h1>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-moss-700/80 dark:text-parchment-400">
          Follow the route in order to unlock new lessons. Completed lessons stay open for review.
        </p>
      </div>

      {openTracks.length > 1 && (
        <div className="mb-5 flex flex-wrap gap-2">
          {openTracks.map((t, index) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedId(t.id)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-robot-cyan-500 ${
                activeTrack?.id === t.id
                  ? 'border-robot-cyan-600 bg-robot-cyan-600 text-white shadow-sm'
                  : 'border-parchment-200 bg-parchment-50 text-moss-700 hover:border-moss-300 hover:bg-moss-50 dark:border-pine-800 dark:bg-pine-900 dark:text-parchment-300 dark:hover:border-moss-600 dark:hover:bg-moss-500/10'
              }`}
            >
              <span className={`flex h-6 w-6 items-center justify-center rounded-lg text-[10px] font-black ${activeTrack?.id === t.id ? 'bg-white/15' : 'bg-parchment-100 dark:bg-pine-800'}`}>
                {index + 1}
              </span>
              <TrackIcon language={t.language} size={18} />
              {t.title}
            </button>
          ))}
        </div>
      )}

      {activeTrack && (
        <LearningMapCard
          track={activeTrack}
          isLessonUnlocked={isLessonUnlocked}
          isLessonCompleted={isLessonCompleted}
          onSelectLesson={onSelectLesson}
        />
      )}
    </div>
  );
}
