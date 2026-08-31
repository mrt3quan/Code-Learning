import type { ChallengeLikeActivity, Language } from '../../data/lessons';

// Shared contract for every per-type challenge component. The component
// owns its own input state and presentation (prompt, code/options, control);
// LessonScreen owns the shared feedback panel (correct/incorrect messaging,
// hints, AI Tutor) that appears once onSubmit fires.
export interface ChallengeComponentProps<T extends ChallengeLikeActivity = ChallengeLikeActivity> {
  activity: T;
  language: Language;
  disabled: boolean;
  onSubmit: (isCorrect: boolean, userAnswerText: string) => void;
}

export const PROMPT_CLASS = 'mb-3 text-sm font-semibold leading-6 text-pine-800/90 dark:text-parchment-300';
