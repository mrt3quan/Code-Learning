import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import type { Language } from '../data/lessons';

interface CodeBlockProps {
  code: string;
  language?: Language;
}

const LANGUAGE_LABEL: Record<Language, string> = {
  python: 'Python',
  cpp: 'C++',
};

export default function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API can be unavailable (permissions, insecure context) —
      // not worth surfacing an error for a convenience button.
    }
  }

  return (
    <div className="overflow-hidden rounded-xl bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-1.5">
        <span className="text-xs font-semibold text-slate-400">
          {language ? LANGUAGE_LABEL[language] : ''}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-slate-200"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto px-4 py-3 text-sm leading-relaxed text-slate-100">
        <code className="font-mono">{code}</code>
      </pre>
    </div>
  );
}
