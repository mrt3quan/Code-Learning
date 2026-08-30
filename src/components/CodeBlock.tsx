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
    <div className="overflow-hidden rounded-2xl border border-pine-700 bg-pine-950 shadow-sm">
      <div className="flex items-center justify-between border-b border-pine-700 bg-pine-900 px-3.5 py-2.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-bloom-coral-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-dawn-sand-300/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-moss-400/80" />
          </div>
          <span className="truncate font-mono text-xs font-semibold text-parchment-300">{FILE_LABEL[language]}</span>
          <span className="hidden rounded-md bg-pine-800 px-1.5 py-0.5 text-[10px] font-bold text-parchment-500 sm:inline">{LANGUAGE_LABEL[language]}</span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-parchment-400 transition hover:bg-white/5 hover:text-parchment-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-robot-cyan-400"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <div className="overflow-x-auto py-3 font-mono text-sm leading-6">
        {lines.map((line, index) => (
          <div key={`${index}-${line}`} className="grid min-w-max grid-cols-[42px_minmax(0,1fr)] px-3">
            <span className="select-none border-r border-pine-700 pr-3 text-right text-xs text-pine-400">{index + 1}</span>
            <code className="whitespace-pre pl-4 text-parchment-100">{line || ' '}</code>
          </div>
        ))}
      </div>
    </div>
  );
}
