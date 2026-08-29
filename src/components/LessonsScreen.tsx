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
  isFoundationsComplete: boolean;
  onChoosePath: () => void;
}

export default function LessonsScreen({
  defaultTrackId,
  isLessonUnlocked,
  isLessonCompleted,
  getMastery,
  onSelectLesson,
  isFoundationsComplete,
  onChoosePath,
}: LessonsScreenProps) {
  const openTracks = tracks.filter((t) => isLessonUnlocked(t.lessons[0].id));
  const [selectedId, setSelectedId] = useState(defaultTrackId);
  const activeTrack: Track =
    openTracks.find((t) => t.id === selectedId) ?? openTracks[0] ?? foundationsTrack;

  return (
    <>
      {openTracks.length > 1 && (
        <div className="mx-auto flex max-w-3xl flex-wrap gap-2 px-4 pt-8">
          {openTracks.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedId(t.id)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                activeTrack.id === t.id
                  ? 'bg-violet-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              <TrackIcon language={t.language} size={16} />
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
        showPathChoiceCta={activeTrack.id === foundationsTrack.id && isFoundationsComplete}
        onChoosePath={onChoosePath}
      />
    </>
  );
}
