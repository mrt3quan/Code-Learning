import { useCallback, useEffect, useRef, useState } from 'react';

// Minimal shape of the Pyodide interface we actually use.
interface PyodideInterface {
  globals: { set: (name: string, value: unknown) => void };
  runPythonAsync: (code: string) => Promise<string>;
}

declare global {
  interface Window {
    loadPyodide?: (config: { indexURL: string }) => Promise<PyodideInterface>;
  }
}

const PYODIDE_VERSION = '0.26.4';
const PYODIDE_CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

let pyodidePromise: Promise<PyodideInterface> | null = null;

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}

function getPyodide(): Promise<PyodideInterface> {
  if (!pyodidePromise) {
    pyodidePromise = loadScript(`${PYODIDE_CDN}pyodide.js`).then(() => {
      if (!window.loadPyodide) {
        throw new Error('Pyodide failed to attach to window');
      }
      return window.loadPyodide({ indexURL: PYODIDE_CDN });
    });
  }
  return pyodidePromise;
}

export type PyodideStatus = 'loading' | 'ready' | 'error';

// Runs a snippet in an isolated namespace and returns whatever it printed,
// so lesson examples can show real, live-computed output instead of a
// hand-typed string that could drift from the actual interpreter.
export function usePyodide() {
  const [status, setStatus] = useState<PyodideStatus>('loading');
  const pyodideRef = useRef<PyodideInterface | null>(null);

  useEffect(() => {
    let cancelled = false;
    getPyodide()
      .then((py) => {
        if (cancelled) return;
        pyodideRef.current = py;
        setStatus('ready');
      })
      .catch(() => {
        if (cancelled) return;
        setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const runPython = useCallback(async (code: string): Promise<string> => {
    const py = pyodideRef.current;
    if (!py) throw new Error('Pyodide is not ready yet');
    py.globals.set('__src', code);
    const output = await py.runPythonAsync(
      [
        'import io, contextlib',
        '_buf = io.StringIO()',
        'with contextlib.redirect_stdout(_buf):',
        '    exec(__src, {})',
        '_buf.getvalue()',
      ].join('\n'),
    );
    return output.replace(/\n$/, '');
  }, []);

  return { status, runPython };
}
