import type { ChallengeComponentProps } from './types';
import TextAnswerChallenge from './TextAnswerChallenge';
import MultipleChoiceChallenge from './MultipleChoiceChallenge';
import ClickCodeChallenge from './ClickCodeChallenge';
import CodeOrderingChallenge from './CodeOrderingChallenge';
import CodeEditorChallenge from './CodeEditorChallenge';

export default function ChallengeBody({ activity, language, disabled, onSubmit }: ChallengeComponentProps) {
  switch (activity.type) {
    case 'predict-output':
    case 'fill-in-blank':
    case 'fix-the-bug':
      return <TextAnswerChallenge activity={activity} language={language} disabled={disabled} onSubmit={onSubmit} />;
    case 'multiple-choice':
      return <MultipleChoiceChallenge activity={activity} language={language} disabled={disabled} onSubmit={onSubmit} />;
    case 'click-code':
      return <ClickCodeChallenge activity={activity} language={language} disabled={disabled} onSubmit={onSubmit} />;
    case 'code-ordering':
      return <CodeOrderingChallenge activity={activity} language={language} disabled={disabled} onSubmit={onSubmit} />;
    case 'code-editor':
      return <CodeEditorChallenge activity={activity} language={language} disabled={disabled} onSubmit={onSubmit} />;
  }
}
