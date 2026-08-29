interface CodeBlockProps {
  code: string;
}

export default function CodeBlock({ code }: CodeBlockProps) {
  return (
    <pre className="overflow-x-auto rounded-xl bg-slate-900 px-4 py-3 text-sm leading-relaxed text-slate-100">
      <code className="font-mono">{code}</code>
    </pre>
  );
}
