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
        <div className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600 dark:text-violet-400">
          Course map
        </div>
        <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
          Your Python Journey
        </h1>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
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
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ${
                activeTrack?.id === t.id
                  ? 'border-violet-600 bg-violet-600 text-white shadow-sm'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:bg-violet-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-violet-700 dark:hover:bg-violet-500/10'
              }`}
            >
              <span className={`flex h-6 w-6 items-center justify-center rounded-lg text-[10px] font-black ${activeTrack?.id === t.id ? 'bg-white/15' : 'bg-slate-100 dark:bg-slate-800'}`}>
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
