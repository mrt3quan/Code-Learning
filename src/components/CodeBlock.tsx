import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import type { Language } from '../data/lessons';

interface CodeBlockProps {
  code: string;
  language?: Language;
}

const LANGUAGE_LABEL: Record<Language, string> = {
  python: 'Python 3',
  cpp: 'C++',
};

const FILE_LABEL: Record<Language, string> = {
  python: 'main.py',
  cpp: 'main.cpp',
};

export default function CodeBlock({ code, language = 'python' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const lines = code.split('\n');

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard can be unavailable in restricted or insecure contexts.
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#0d1321] shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-800 bg-[#111827] px-3.5 py-2.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          </div>
          <span className="truncate font-mono text-xs font-semibold text-slate-300">{FILE_LABEL[language]}</span>
          <span className="hidden rounded-md bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold text-slate-400 sm:inline">{LANGUAGE_LABEL[language]}</span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-slate-400 transition hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <div className="overflow-x-auto py-3 font-mono text-sm leading-6">
        {lines.map((line, index) => (
          <div key={`${index}-${line}`} className="grid min-w-max grid-cols-[42px_minmax(0,1fr)] px-3">
            <span className="select-none border-r border-slate-800 pr-3 text-right text-xs text-slate-600">{index + 1}</span>
            <code className="whitespace-pre pl-4 text-slate-100">{line || ' '}</code>
          </div>
        ))}
      </div>
    </div>
  );
}
