import { pathOptions, type PathId } from '../data/lessons';

interface PathChoiceScreenProps {
  onBack: () => void;
  onChoosePath: (path: PathId) => void;
}

export default function PathChoiceScreen({ onBack, onChoosePath }: PathChoiceScreenProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
      >
        ← Back to Dashboard
      </button>

      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
        Choose Your Path
      </h1>
      <p className="mt-1 text-slate-500 dark:text-slate-400">
        You've mastered the foundations. Now pick your specialization — you can
        always come back here later.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {pathOptions.map((path) => (
          <button
            key={path.id}
            type="button"
            disabled={!path.available}
            onClick={() => path.available && onChoosePath(path.id)}
            className={`rounded-2xl border p-6 text-left transition ${
              path.available
                ? 'cursor-pointer border-slate-200 bg-white shadow-sm hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-violet-500'
                : 'cursor-not-allowed border-slate-200 bg-slate-50 opacity-60 dark:border-slate-800 dark:bg-slate-900/50'
            }`}
          >
            <div className="font-semibold text-slate-900 dark:text-slate-100">
              {path.title}
            </div>
            <div className="text-lg font-bold text-violet-600 dark:text-violet-400">
              {path.language}
            </div>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {path.description}
            </p>
            <div className="mt-4 text-sm font-semibold">
              {path.available ? (
                <span className="text-violet-600 dark:text-violet-400">
                  Choose {path.language} →
                </span>
              ) : (
                <span className="text-slate-400 dark:text-slate-500">
                  Coming soon
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
