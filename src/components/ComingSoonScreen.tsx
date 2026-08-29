import { MascotTip } from './Mascot';

interface ComingSoonScreenProps {
  title: string;
  icon: string;
  description: string;
}

export default function ComingSoonScreen({ title, icon, description }: ComingSoonScreenProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
        {icon} {title}
      </h1>
      <p className="mt-1 text-slate-500 dark:text-slate-400">{description}</p>

      <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center dark:border-slate-700 dark:bg-slate-900/50">
        <MascotTip layout="column" message="Coming soon — this needs a backend we haven't built yet." />
      </div>
    </div>
  );
}
