// Pyodide surfaces raw CPython tracebacks. Beginners don't read tracebacks —
// they need a plain-English pointer to what to check. This pulls the last
// "ExceptionType: message" line out of the traceback and maps common
// exception types to a short, actionable explanation.

const FRIENDLY_EXPLANATIONS: Record<string, (detail: string) => string> = {
  SyntaxError: () =>
    "Python couldn't understand the structure of your code — often a missing colon `:` at the end of an if/for/while/def line, a missing closing bracket or quote, or mismatched parentheses.",
  IndentationError: () =>
    'Python cares about indentation — lines inside an if, for, while, or def block need to line up with consistent spacing (usually 4 spaces).',
  NameError: (detail) =>
    `Python doesn't recognize a name you used${detail ? ` (${detail})` : ''} — check for a typo, or make sure you defined that variable before using it.`,
  TypeError: (detail) =>
    `You're mixing types Python can't combine that way${detail ? ` (${detail})` : ''} — for example, adding a number and a string together needs one of them converted first.`,
  IndexError: () =>
    "You tried to access a position in a list that doesn't exist — remember indexes start at 0 and stop at length - 1.",
  KeyError: (detail) =>
    `You tried to look up a dictionary key that isn't there${detail ? ` (${detail})` : ''} — double-check the spelling and that you added it first.`,
  ZeroDivisionError: () => "You tried to divide by zero, which Python doesn't allow.",
  ValueError: (detail) =>
    `A value was the right type but not something Python could use here${detail ? ` (${detail})` : ''} — check what you're passing in.`,
  AttributeError: (detail) =>
    `You called a method or accessed a property that doesn't exist on that value${detail ? ` (${detail})` : ''} — check the spelling and the type of the value.`,
};

export function translatePythonError(rawError: string): string {
  const lines = rawError.trim().split('\n');
  const lastLine = lines[lines.length - 1] ?? '';
  const match = /^(\w+(?:Error|Exception)):\s*(.*)$/.exec(lastLine.trim());

  if (!match) {
    return "Something went wrong while running your code — check the error details below for exactly what Python reported.";
  }

  const [, exceptionType, detail] = match;
  const explain = FRIENDLY_EXPLANATIONS[exceptionType];
  return explain
    ? explain(detail)
    : `Python reported a ${exceptionType}${detail ? ` (${detail})` : ''} — check the error details below for exactly what went wrong.`;
}
