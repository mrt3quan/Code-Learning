import { useState } from 'react';
import { tracks } from '../data/lessons';
import LearningMapCard from './LearningMapCard';

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
  const openTracks = tracks.filter((t) => isLessonUnlocked(t.lessons[0].id));
  const [selectedId, setSelectedId] = useState(defaultTrackId);
  const activeTrack = openTracks.find((t) => t.id === selectedId) ?? openTracks[0];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold text-slate-900 dark:text-slate-50">
        Your Learning Map
      </h1>

      {openTracks.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {openTracks.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedId(t.id)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                activeTrack?.id === t.id
                  ? 'bg-violet-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {t.language === 'python' ? '🐍' : '🎮'} {t.title}
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
