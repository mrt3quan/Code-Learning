// Lesson content for every track. This is the single seam the app extends:
// add more lessons/tracks/activity types here, components should never
// hardcode lesson copy.
//
// A lesson is an ordered list of activities: one `explanation` activity (the
// concept + a runnable example) plus one challenge activity, which can be
// any member of the `Activity` union below. Adding a new activity type means
// adding one new member to that union, not restructuring existing lessons.

export interface LessonExample {
  code: string;
  output: string;
}

export interface ExplanationActivity {
  type: 'explanation';
  text: string;
  example: LessonExample;
}

export type ChallengeType = 'predict-output' | 'fill-in-blank' | 'fix-the-bug';

export interface ChallengeActivity {
  type: ChallengeType;
  code: string;
  prompt: string;
  correctAnswer: string;
  wrongAnswerExplanation: string;
  // Ordered gentlest-to-most-revealing. Both the static hint ladder and the
  // AI Tutor's grounding context draw from this same array — see
  // useTutorHint.ts and worker/src/index.ts.
  hints: [string, string, string];
}

export interface MultipleChoiceActivity {
  type: 'multiple-choice';
  code?: string;
  prompt: string;
  options: string[];
  correctAnswer: string;
  wrongAnswerExplanation: string;
  hints: [string, string, string];
}

// Same shape as multiple-choice, but `options` holds lines of code instead
// of prose — the component renders them in a monospace/code style.
export interface ClickCodeActivity {
  type: 'click-code';
  prompt: string;
  options: string[];
  correctAnswer: string;
  wrongAnswerExplanation: string;
  hints: [string, string, string];
}

export interface CodeOrderingActivity {
  type: 'code-ordering';
  prompt: string;
  // The correct order. The component shuffles a copy for display and
  // compares the learner's arrangement back against this array.
  correctLines: string[];
  wrongAnswerExplanation: string;
  hints: [string, string, string];
}

export interface CodeEditorActivity {
  type: 'code-editor';
  prompt: string;
  starterCode: string;
  expectedOutput: string;
  wrongAnswerExplanation: string;
  hints: [string, string, string];
}

export type ChallengeLikeActivity =
  | ChallengeActivity
  | MultipleChoiceActivity
  | ClickCodeActivity
  | CodeOrderingActivity
  | CodeEditorActivity;

export type Activity = ExplanationActivity | ChallengeLikeActivity;

export function getExplanationActivity(lesson: Lesson): ExplanationActivity | undefined {
  return lesson.activities.find((a): a is ExplanationActivity => a.type === 'explanation');
}

export function getChallengeActivities(lesson: Lesson): ChallengeLikeActivity[] {
  return lesson.activities.filter((a): a is ChallengeLikeActivity => a.type !== 'explanation');
}

// Every lesson has exactly one challenge activity. Callers that only need
// "the" challenge (list badges, etc.) use this instead of assuming array
// shape.
export function getPrimaryChallenge(lesson: Lesson): ChallengeLikeActivity | undefined {
  return getChallengeActivities(lesson)[0];
}

// Normalizes any challenge-like activity into the plain {code, answer} shape
// the AI Tutor grounds its hints on, so useTutorHint/worker don't need to
// know about every activity type.
export function describeChallenge(activity: ChallengeLikeActivity): {
  code: string;
  correctAnswer: string;
} {
  switch (activity.type) {
    case 'predict-output':
    case 'fill-in-blank':
    case 'fix-the-bug':
      return { code: activity.code, correctAnswer: activity.correctAnswer };
    case 'multiple-choice':
      return { code: activity.code ?? '', correctAnswer: activity.correctAnswer };
    case 'click-code':
      return { code: activity.options.join('\n'), correctAnswer: activity.correctAnswer };
    case 'code-ordering':
      return { code: activity.correctLines.join('\n'), correctAnswer: activity.correctLines.join('\n') };
    case 'code-editor':
      return { code: activity.starterCode, correctAnswer: activity.expectedOutput };
  }
}

export interface Lesson {
  id: string;
  order: number;
  title: string;
  activities: Activity[];
  xpReward: number;
  isProject?: boolean;
}

export type Language = 'python' | 'cpp';

export interface Track {
  id: string;
  title: string;
  subtitle: string;
  language: Language;
  // The path that unlocks this track (see pathOptions below). Undefined
  // for the shared Foundations track, which is always available.
  pathId?: PathId;
  lessons: Lesson[];
}

export const foundationsTrack: Track = {
  id: 'foundations',
  title: 'Python Foundations',
  subtitle: 'Start from zero and build the core Python skills every later project depends on.',
  language: 'python',
  lessons: [
    {
      id: 'variables',
      order: 1,
      title: 'Variables',
      activities: [
        {
          type: 'explanation',
          text:
            "A variable is a named box that stores a value so you can use it later. In Python you create one just by writing a name, an equals sign, and a value — there's no need to declare a type first. Once it's set, you can print the variable, use it in math, or reassign it to something new.",
          example: {
            code: 'name = "Ava"\nage = 12\nprint(name, "is", age, "years old")',
            output: 'Ava is 12 years old',
          },
        },
        {
          type: 'predict-output',
          code: 'score = 10\nscore = score + 5\nprint(score)',
          prompt: 'What does this print?',
          correctAnswer: '15',
          wrongAnswerExplanation:
            'score starts at 10. The line score = score + 5 takes the current value of score (10), adds 5, and stores the result back into score. So the print statement outputs 15.',
          hints: [
            'Read score = score + 5 as: take the old value, add 5, save it back.',
            'score starts at 10 — walk through the assignment one operation at a time: what is score + 5 when score is still 10?',
            'score + 5 evaluates using the old value of score (10), giving 15, and that 15 is what gets stored back into score before the print runs.',
          ],
        },
      ],
      xpReward: 10,
    },
    {
      id: 'conditions',
      order: 2,
      title: 'Conditions',
      activities: [
        {
          type: 'explanation',
          text:
            "Conditions let a program make decisions using if, elif, and else. Python checks the if condition first — if it's True, that block runs and everything else is skipped. If it's False, Python checks the next elif, and if none of them match, it falls back to else.",
          example: {
            code:
              'temperature = 75\nif temperature > 80:\n    print("Hot")\nelif temperature > 60:\n    print("Nice")\nelse:\n    print("Cold")',
            output: 'Nice',
          },
        },
        {
          type: 'predict-output',
          code:
            'age = 15\nif age >= 18:\n    print("Adult")\nelif age >= 13:\n    print("Teen")\nelse:\n    print("Child")',
          prompt: 'What does this print?',
          correctAnswer: 'Teen',
          wrongAnswerExplanation:
            "Python checks each condition in order. age >= 18 is False (15 is not >= 18), so it moves to the next check: age >= 13. Since 15 >= 13 is True, that block runs and prints Teen — the else is never reached.",
          hints: [
            "Conditions are checked top to bottom. Find the first one that's True.",
            'age is 15. Check each condition in order — is age >= 18 true or false? If false, move to the next elif.',
            'age >= 18 is False, so Python checks age >= 13 next. Since 15 >= 13 is True, that branch runs and the else never does.',
          ],
        },
      ],
      xpReward: 10,
    },
    {
      id: 'loops',
      order: 3,
      title: 'Loops',
      activities: [
        {
          type: 'explanation',
          text:
            'A loop repeats a block of code without you having to write it out multiple times. A for loop with range(n) runs its body once for each number from 0 up to (but not including) n. The loop variable, like i, updates automatically on every pass.',
          example: {
            code: 'for i in range(3):\n    print(i)',
            output: '0\n1\n2',
          },
        },
        {
          type: 'predict-output',
          code: 'total = 0\nfor i in range(1, 5):\n    total += i\nprint(total)',
          prompt: 'What does this print?',
          correctAnswer: '10',
          wrongAnswerExplanation:
            'range(1, 5) produces 1, 2, 3, 4 (it stops before 5). Each pass adds i to total: 0+1=1, 1+2=3, 3+3=6, 6+4=10. So the final printed value is 10.',
          hints: [
            'List out the numbers range(1, 5) actually produces, then add them one at a time.',
            'range(1, 5) stops before 5, so it produces 1, 2, 3, 4 — not 1 through 5.',
            'Adding 1 + 2 + 3 + 4 one at a time: total goes 0 → 1 → 3 → 6 → 10.',
          ],
        },
      ],
      xpReward: 10,
    },
    {
      id: 'while-loops',
      order: 4,
      title: 'While Loops',
      activities: [
        {
          type: 'explanation',
          text:
            "A while loop repeats as long as a condition stays True — unlike a for loop, it doesn't know in advance how many times it will run. Each time through, Python re-checks the condition before running the body again. Forget to update something inside the loop that eventually makes the condition False, and it will run forever.",
          example: {
            code: 'count = 0\nwhile count < 3:\n    print(count)\n    count += 1',
            output: '0\n1\n2',
          },
        },
        {
          type: 'fill-in-blank',
          code: 'count = 0\nwhile count ____ 3:\n    print(count)\n    count += 1',
          prompt:
            'Fill in the blank so this prints 0, 1, and 2 — but stops before printing 3.',
          correctAnswer: '<',
          wrongAnswerExplanation:
            'count starts at 0 and increases by 1 each loop. count < 3 keeps looping while count is 0, 1, or 2 — printing each one — and stops the moment count becomes 3. Using <= would print 3 too.',
          hints: [
            'You want the loop to stop the instant count reaches 3, not include it.',
            'Compare < and <= — one of them lets count equal 3 and still loop, the other stops right before.',
            'count < 3 is True for 0, 1, and 2, then False once count is 3 — so the blank needs to be the less-than symbol.',
          ],
        },
      ],
      xpReward: 10,
    },
    {
      id: 'lists',
      order: 5,
      title: 'Lists',
      activities: [
        {
          type: 'explanation',
          text:
            'A list stores an ordered collection of values in a single variable, written with square brackets. You access an item by its position, called its index, and indexes start at 0 — so the first item is at index 0, not 1. Lists can hold any type of value and can grow with methods like .append().',
          example: {
            code:
              'fruits = ["apple", "banana", "cherry"]\nfruits.append("date")\nprint(fruits[1])',
            output: 'banana',
          },
        },
        {
          type: 'predict-output',
          code: 'scores = [10, 20, 30, 40]\nprint(scores[-1])',
          prompt: 'What does this print?',
          correctAnswer: '40',
          wrongAnswerExplanation:
            "Negative indexes count backwards from the end of the list. scores[-1] means \"the last item\", which is 40 — not the first or second item.",
          hints: [
            'A negative index like -1 counts backwards from the end of the list.',
            'scores[-1] is not "the first item minus one" — negative indexes count from the end of the list, not the start.',
            'scores has 4 items; scores[-1] means "1 item from the end," which is 40, the last value in the list.',
          ],
        },
      ],
      xpReward: 10,
    },
    {
      id: 'strings',
      order: 6,
      title: 'Strings',
      activities: [
        {
          type: 'explanation',
          text:
            "A string is text, and Python lets you treat it like a list of characters — you can index into it or measure its length with len(). Strings also come with built-in methods like .upper() and .lower() for quick transformations. Strings are immutable, so these methods always return a new string instead of changing the original.",
          example: {
            code: 'word = "python"\nprint(word[0], word[-1], len(word))',
            output: 'p n 6',
          },
        },
        {
          type: 'fill-in-blank',
          code: 'name = "ada"\nprint(name.____())',
          prompt: 'Fill in the blank so this prints ADA.',
          correctAnswer: 'upper',
          wrongAnswerExplanation:
            '.upper() returns a new string with every letter capitalized. name.upper() turns "ada" into "ADA".',
          hints: [
            'You need the string method that makes every letter capital, not just the first one.',
            "There's a string method specifically for uppercasing — it's not .capitalize(), which would only capitalize the first letter.",
            '.upper() returns a new string with every character capitalized, so name.upper() turns "ada" into "ADA".',
          ],
        },
      ],
      xpReward: 10,
    },
    {
      id: 'dictionaries',
      order: 7,
      title: 'Dictionaries',
      activities: [
        {
          type: 'explanation',
          text:
            'A dictionary stores data as key-value pairs instead of a numbered sequence — you look up a value by its key, not its position. Keys are written before a colon and values after, all wrapped in curly braces. You read a value using square brackets with the key inside, like a lookup table.',
          example: {
            code: 'student = {"name": "Mia", "grade": 7}\nprint(student["name"])',
            output: 'Mia',
          },
        },
        {
          type: 'fix-the-bug',
          code: 'scores = {"math": 90, "art": 85}\nprint(scores["science"])',
          prompt:
            'This crashes with a KeyError. What should replace scores["science"] so it works?',
          correctAnswer: 'scores["math"]',
          wrongAnswerExplanation:
            'scores has no "science" key, so scores["science"] raises a KeyError. The dictionary only defines "math" and "art" as keys — scores["math"] is one that actually exists.',
          hints: [
            'Check which keys the dictionary actually defines, and use one of those.',
            'scores only has two keys defined in the code above — look at what they are before picking a replacement.',
            'The dictionary defines "math" and "art", not "science" — so scores["math"] (or scores["art"]) is a key that actually exists.',
          ],
        },
      ],
      xpReward: 10,
    },
    {
      id: 'functions',
      order: 8,
      title: 'Functions',
      activities: [
        {
          type: 'explanation',
          text:
            "A function is a reusable block of code you define once with def and can call by name as many times as you like. Parameters let you pass different values in each time you call it, so the function can work with whatever data you give it. Defining a function doesn't run it — nothing happens until you actually call it.",
          example: {
            code: 'def greet(name):\n    print("Hello, " + name)\n\ngreet("Sam")',
            output: 'Hello, Sam',
          },
        },
        {
          type: 'fix-the-bug',
          code: 'def square(n)\n    return n * n\n\nprint(square(4))',
          prompt:
            "This has a syntax error and won't run. What's missing from the function definition line?",
          correctAnswer: ':',
          wrongAnswerExplanation:
            'Every def line needs a colon at the end, just like if and while statements: def square(n):. Without it, Python cannot tell where the header ends and the body begins.',
          hints: [
            'Compare this def line to a working one — what punctuation is missing at the end?',
            'Look at the if and while statements you already know — they all end their header line the same way.',
            'Every def line needs a trailing colon, just like if and while: def square(n): is the fix.',
          ],
        },
      ],
      xpReward: 10,
    },
    {
      id: 'return-values',
      order: 9,
      title: 'Return Values',
      activities: [
        {
          type: 'explanation',
          text:
            "A function can send a value back to wherever it was called using return — that's different from print, which just displays something and hands nothing back to your code. As soon as return runs, the function stops immediately, so anything after it inside that function never runs.",
          example: {
            code: 'def double(n):\n    return n * 2\n\nresult = double(5)\nprint(result)',
            output: '10',
          },
        },
        {
          type: 'predict-output',
          code:
            'def add(a, b):\n    return a + b\n    print("done")\n\nprint(add(2, 3))',
          prompt: 'What does this print?',
          correctAnswer: '5',
          wrongAnswerExplanation:
            'return immediately exits the function, so print("done") on the line after it never runs — it\'s unreachable. add(2, 3) returns 5, and that\'s the value the outer print() displays.',
          hints: [
            'Once a function hits return, does anything else inside that function still run?',
            'return immediately exits the function — anything written after it inside that same function is unreachable code.',
            'print("done") never runs because return already exited the function on the line before it; add(2, 3) returns 5, so that\'s what prints.',
          ],
        },
      ],
      xpReward: 10,
    },
  ],
};

export const aiDeveloperTrack: Track = {
  id: 'ai-developer',
  title: 'Python Builder · Toward AI',
  subtitle: 'Build stronger Python with data structures, files, classes, JSON, and projects before machine learning and AI.',
  language: 'python',
  pathId: 'python',
  lessons: [
    {
      id: 'ai-lists-and-dicts',
      order: 1,
      title: 'Lists & Dictionaries',
      activities: [
        {
          type: 'explanation',
          text:
            'Real programs often combine lists and dictionaries — a list of dictionaries is a natural way to represent a table of records, like a roster of students. Loop over the list with a for loop, and each item you get back is one dictionary you can look up by key.',
          example: {
            code:
              'students = [\n    {"name": "Mia", "grade": 7},\n    {"name": "Leo", "grade": 8},\n]\nfor student in students:\n    print(student["name"])',
            output: 'Mia\nLeo',
          },
        },
        {
          type: 'predict-output',
          code:
            'inventory = [\n    {"item": "sword", "qty": 2},\n    {"item": "shield", "qty": 1},\n]\ntotal = 0\nfor entry in inventory:\n    total += entry["qty"]\nprint(total)',
          prompt: 'What does this print?',
          correctAnswer: '3',
          wrongAnswerExplanation:
            'inventory holds two dictionaries. The loop adds each one\'s "qty" to total: 0 + 2 = 2, then 2 + 1 = 3. So the final printed value is 3.',
          hints: [
            'Add up the "qty" value from each dictionary in the list, one at a time.',
            'inventory has two dictionary entries — total starts at 0 and adds each entry\'s "qty" in turn.',
            'The first entry adds 2 (total becomes 2), the second adds 1 (total becomes 3) — so print(total) shows 3.',
          ],
        },
      ],
      xpReward: 10,
    },
    {
      id: 'ai-comprehensions',
      order: 2,
      title: 'List Comprehensions',
      activities: [
        {
          type: 'explanation',
          text:
            "A list comprehension builds a new list in a single line by describing what to do with each item, instead of writing a full loop with .append(). The pattern is [expression for item in iterable], and adding an if at the end filters which items make it in. They show up constantly in code that processes data, since they read almost like the sentence they describe.",
          example: {
            code: 'numbers = [1, 2, 3, 4, 5]\ndoubled = [n * 2 for n in numbers]\nprint(doubled)',
            output: '[2, 4, 6, 8, 10]',
          },
        },
        {
          type: 'predict-output',
          code:
            'scores = [55, 90, 40, 75, 30]\npassing = [s for s in scores if s >= 50]\nprint(len(passing))',
          prompt: 'What does this print?',
          correctAnswer: '3',
          wrongAnswerExplanation:
            "The comprehension keeps only scores where s >= 50 is True: 55, 90, and 75 qualify, while 40 and 30 don't. That leaves 3 items in passing, so len(passing) prints 3.",
          hints: [
            'Count how many scores in the original list are 50 or higher.',
            'Go through scores one at a time and mark which ones are >= 50 — those are the only ones that end up in passing.',
            '55, 90, and 75 are each >= 50 (three values); 40 and 30 are not — so passing has 3 items and len(passing) is 3.',
          ],
        },
      ],
      xpReward: 10,
    },
    {
      id: 'ai-error-handling',
      order: 3,
      title: 'Error Handling',
      activities: [
        {
          type: 'explanation',
          text:
            "Some errors are expected — a file might be missing, or input might not be a number — and a try/except block lets your program handle them instead of crashing. Python runs the try block first; the moment an error happens inside it, execution jumps straight to the matching except block.",
          example: {
            code: 'try:\n    number = int("abc")\nexcept ValueError:\n    print("That wasn\'t a number")',
            output: "That wasn't a number",
          },
        },
        {
          type: 'fill-in-blank',
          code:
            'try:\n    result = 10 / 0\n____ ZeroDivisionError:\n    print("Can\'t divide by zero")',
          prompt: 'Fill in the blank so this catches the error instead of crashing.',
          correctAnswer: 'except',
          wrongAnswerExplanation:
            'try starts the block that might fail. To catch a specific error it can raise, you follow it with except <ErrorType>: — here, except ZeroDivisionError: catches the division error and runs the fallback print instead of crashing the program.',
          hints: [
            'You already have try — what keyword pairs with it to catch the error?',
            'try always needs a matching keyword to define what happens when something goes wrong inside it.',
            'except pairs with try — except ZeroDivisionError: catches that specific error and runs its block instead of crashing.',
          ],
        },
      ],
      xpReward: 10,
    },
    {
      id: 'ai-default-args',
      order: 4,
      title: 'Default Arguments',
      activities: [
        {
          type: 'explanation',
          text:
            "A parameter can have a default value, given with = in the function definition. If the caller doesn't pass that argument, Python uses the default instead — this lets you add optional settings to a function without breaking every existing call to it.",
          example: {
            code:
              'def greet(name, greeting="Hello"):\n    print(greeting + ", " + name)\n\ngreet("Ava")\ngreet("Leo", "Hey")',
            output: 'Hello, Ava\nHey, Leo',
          },
        },
        {
          type: 'predict-output',
          code: 'def power(base, exponent=2):\n    return base ** exponent\n\nprint(power(3))',
          prompt: 'What does this print?',
          correctAnswer: '9',
          wrongAnswerExplanation:
            'power(3) only passes one argument, so exponent falls back to its default value of 2. That computes base ** exponent as 3 ** 2, which is 9.',
          hints: [
            "Since the second argument isn't given, the function falls back to its default value.",
            'power(3) only supplies one argument — check what value exponent is defined to use when nothing is passed for it.',
            'exponent defaults to 2, so power(3) computes 3 ** 2, which is 9.',
          ],
        },
      ],
      xpReward: 10,
    },
    {
      id: 'ai-classes',
      order: 5,
      title: 'Classes & Objects',
      activities: [
        {
          type: 'explanation',
          text:
            'A class is a blueprint for creating objects that bundle data and behavior together. Fields are set inside __init__, which runs automatically when you create an object, and methods are functions defined inside the class body. Every method\'s first parameter is self, which refers to the specific object it was called on.',
          example: {
            code:
              'class Dog:\n    def __init__(self, name):\n        self.name = name\n\n    def bark(self):\n        print(self.name + " says woof!")\n\nrex = Dog("Rex")\nrex.bark()',
            output: 'Rex says woof!',
          },
        },
        {
          type: 'fill-in-blank',
          code:
            'class Counter:\n    def __init__(self):\n        self.count = 0\n\n    def increment(self):\n        self.____ += 1\n\nc = Counter()\nc.increment()\nc.increment()\nprint(c.count)',
          prompt: "Fill in the blank so increment() actually updates the object's count.",
          correctAnswer: 'count',
          wrongAnswerExplanation:
            "self.count is the object's own count field, set to 0 in __init__. self.count += 1 increases that specific object's count — using just count without self would refer to a variable that doesn't exist inside the method.",
          hints: [
            "You're updating the same field that __init__ set on self.",
            '__init__ creates self.count — increment() needs to update that exact same field, accessed through self.',
            'The blank should be count, so the line reads self.count += 1, updating the object\'s own count field each call.',
          ],
        },
      ],
      xpReward: 10,
    },
    {
      id: 'ai-files',
      order: 6,
      title: 'Files',
      activities: [
        {
          type: 'explanation',
          text:
            'Python can read and write text files with open(). Opening a file in "w" mode creates it (or overwrites it) for writing; opening it in "r" mode reads what\'s there. A with block closes the file for you automatically once you\'re done with it.',
          example: {
            code:
              'with open("notes.txt", "w") as f:\n    f.write("hello")\n\nwith open("notes.txt", "r") as f:\n    print(f.read())',
            output: 'hello',
          },
        },
        {
          type: 'fill-in-blank',
          code:
            'with open("log.txt", "w") as f:\n    f.write("done")\n\nwith open("log.txt", "____") as f:\n    print(f.read())',
          prompt: 'Fill in the blank with the mode needed to read the file back.',
          correctAnswer: 'r',
          wrongAnswerExplanation:
            '"w" mode is for writing — opening a file in "w" mode again would erase it. To read the contents back, you need to open it in "r" mode.',
          hints: [
            'You already wrote to the file — now you need the mode for reading.',
            '"w" mode is for writing; there is a different single-letter mode meant for reading a file back.',
            'The blank should be "r" — open(..., "r") opens the file for reading instead of overwriting it again.',
          ],
        },
      ],
      xpReward: 10,
    },
    {
      id: 'ai-json',
      order: 7,
      title: 'Working with JSON',
      activities: [
        {
          type: 'explanation',
          text:
            "JSON is a text format for structured data that maps directly onto Python dictionaries and lists — it's how most web APIs and AI services send data back and forth. Python's json module converts between the two: json.loads() parses JSON text into a dict, and json.dumps() turns a dict back into JSON text.",
          example: {
            code: 'import json\n\ntext = \'{"name": "Ava", "score": 90}\'\ndata = json.loads(text)\nprint(data["name"])',
            output: 'Ava',
          },
        },
        {
          type: 'predict-output',
          code:
            'import json\n\ntext = \'{"item": "sword", "price": 25}\'\ndata = json.loads(text)\ndata["price"] += 5\nprint(data["price"])',
          prompt: 'What does this print?',
          correctAnswer: '30',
          wrongAnswerExplanation:
            'json.loads() turns the JSON text into a regular Python dictionary, so data["price"] starts out as 25. data["price"] += 5 works exactly like any dictionary value update, giving 30.',
          hints: [
            'Once parsed, data is just a normal dictionary — treat data["price"] like any other dict value.',
            'json.loads() turns the JSON text into a Python dict, so data["price"] starts at 25, same as any other dict value.',
            'data["price"] += 5 adds 5 to the existing 25, giving 30, exactly like updating any dictionary value.',
          ],
        },
      ],
      xpReward: 10,
    },
    {
      id: 'ai-modules',
      order: 8,
      title: 'Modules & Imports',
      activities: [
        {
          type: 'explanation',
          text:
            "A module is a file of Python code you can reuse with import, including modules built into Python itself. import math gives you access to everything inside it through dot notation, like math.sqrt(). You can also import just one name with from module import name, so you can call it directly without the module prefix.",
          example: {
            code: 'import math\n\nprint(math.sqrt(16))',
            output: '4.0',
          },
        },
        {
          type: 'predict-output',
          code: 'from math import floor\n\nprice = 19.99\nprint(floor(price))',
          prompt: 'What does this print?',
          correctAnswer: '19',
          wrongAnswerExplanation:
            "from math import floor imports floor directly, so it's called as floor(price) instead of math.floor(price). floor() always rounds down to the nearest whole number, and 19.99 rounds down to 19.",
          hints: [
            'floor() always rounds down, no matter how close the decimal is to the next whole number.',
            'floor was imported directly with from math import floor, so it\'s called as floor(price), not math.floor(price).',
            'floor(19.99) rounds down to the nearest whole number, which is 19, not 20.',
          ],
        },
      ],
      xpReward: 10,
    },
    {
      id: 'ai-project-quiz',
      order: 9,
      title: 'Project: Quiz Game',
      activities: [
        {
          type: 'explanation',
          text:
            'A small project pulls together everything so far: variables to keep score, a loop to check each answer, and a condition to compare a guess against the right one. Here\'s the core of a tiny quiz game that grades itself.',
          example: {
            code:
              'question = "2 + 2 = ?"\nanswer = "4"\nguess = "4"\n\nif guess == answer:\n    print("Correct!")\nelse:\n    print("Try again.")',
            output: 'Correct!',
          },
        },
        {
          type: 'fix-the-bug',
          code:
            'questions = ["2 + 2", "3 + 3"]\nanswers = ["4", "6"]\nscore = 0\n\nfor i in range(len(questions)):\n    guess = answers[i]\n    if guess = answers[i]:\n        score += 1\n\nprint(score)',
          prompt:
            'This has a syntax error on the if line. What should replace guess = answers[i] there?',
          correctAnswer: 'guess == answers[i]',
          wrongAnswerExplanation:
            "A single = assigns a value, and Python doesn't allow that inside an if condition. Comparing two values for equality needs ==, so the line should read if guess == answers[i]:.",
          hints: [
            'Assignment and comparison look almost identical but use a different number of equals signs.',
            'A single = inside an if condition is a syntax error in Python — conditions need the equality operator instead.',
            'Replace guess = answers[i] with guess == answers[i] — two equals signs compare values instead of assigning one.',
          ],
        },
      ],
      xpReward: 25,
      isProject: true,
    },
    {
      id: 'ai-project-chatbot',
      order: 10,
      title: 'Project: Rule-Based Chatbot',
      activities: [
        {
          type: 'explanation',
          text:
            "A simple rule-based \"chatbot\" just matches keywords in the user's message to a canned response — no real intelligence, but it's the same pattern real dialogue systems build on: check the input, find a matching rule, respond. Here a function loops over a dictionary of keyword-to-reply pairs and returns the first one it finds inside the message.",
          example: {
            code:
              'responses = {\n    "hello": "Hi there!",\n    "bye": "See you later!",\n}\n\ndef chatbot_reply(message):\n    for keyword in responses:\n        if keyword in message.lower():\n            return responses[keyword]\n    return "I don\'t understand."\n\nprint(chatbot_reply("hello there"))',
            output: 'Hi there!',
          },
        },
        {
          type: 'fix-the-bug',
          code:
            'responses = {\n    "help": "How can I assist you?",\n    "thanks": "You\'re welcome!",\n}\n\ndef chatbot_reply(message):\n    for keyword in responses:\n        if keyword in message:\n            return responses[keyword]\n    return "I don\'t understand."\n\nprint(chatbot_reply("Thanks a lot!"))',
          prompt:
            'This prints "I don\'t understand." instead of matching "thanks". What should message become inside the if check so it matches regardless of capitalization?',
          correctAnswer: 'message.lower()',
          wrongAnswerExplanation:
            'The dictionary key is the lowercase "thanks", but the message is "Thanks a lot!" with a capital T, so "thanks" in message is False. Calling message.lower() first turns it into "thanks a lot!", which does contain "thanks".',
          hints: [
            'The keyword is lowercase, but the message might not be — what string method fixes that mismatch?',
            'The dictionary keys are all lowercase, but message keeps whatever capitalization the caller passed in — those need to match.',
            'Change message to message.lower() inside the if check, so "Thanks a lot!" becomes "thanks a lot!" before checking for "thanks".',
          ],
        },
      ],
      xpReward: 25,
      isProject: true,
    },
    {
      id: 'truthy-falsy',
      order: 11,
      title: 'Truthy & Falsy Values',
      activities: [
        {
          type: 'explanation',
          text:
            "Every value in Python is truthy or falsy when used somewhere a True/False is expected, like an if condition. 0, empty strings (\"\"), empty lists ([]), and None are all falsy. Pretty much everything else — non-zero numbers, non-empty strings, non-empty lists — is truthy. This lets you write if my_list: instead of if len(my_list) > 0:.",
          example: {
            code: 'cart = []\nif cart:\n    print("You have items")\nelse:\n    print("Cart is empty")',
            output: 'Cart is empty',
          },
        },
        {
          type: 'multiple-choice',
          code: 'name = ""\nif name:\n    print("Has a name")\nelse:\n    print("No name yet")',
          prompt: 'What does this print?',
          options: ['Has a name', 'No name yet', 'An error', 'Nothing — the if is skipped entirely'],
          correctAnswer: 'No name yet',
          wrongAnswerExplanation:
            'name is an empty string "", and empty strings are falsy in Python. So if name: is False, and the else branch runs, printing "No name yet".',
          hints: [
            'An empty string is one of Python\'s falsy values — think about what that means for the if check.',
            '"" (empty string) is falsy, just like 0, [], and None. if name: is really asking "is name non-empty?"',
            'Since name is "", if name: evaluates to False, so Python runs the else block and prints "No name yet".',
          ],
        },
      ],
      xpReward: 15,
    },
    {
      id: 'checking-membership',
      order: 12,
      title: 'Checking Membership',
      activities: [
        {
          type: 'explanation',
          text:
            "The in keyword checks whether a value exists inside a list, string, or dictionary. For a list, it scans every item for a match. For a string, it checks for a substring anywhere inside. For a dictionary, it checks the keys, not the values. It always evaluates to True or False, so it's often used directly inside an if.",
          example: {
            code: 'inventory = ["sword", "shield", "potion"]\nprint("shield" in inventory)',
            output: 'True',
          },
        },
        {
          type: 'click-code',
          prompt:
            'You have allowed_users = ["ava", "sam"]. Click the line that correctly checks whether "sam" is in that list.',
          options: [
            'if allowed_users = "sam":',
            'if "sam" == allowed_users:',
            'if "sam" in allowed_users:',
            'if allowed_users.contains("sam"):',
          ],
          correctAnswer: 'if "sam" in allowed_users:',
          wrongAnswerExplanation:
            'Python checks list membership with the in keyword: if "sam" in allowed_users:. There\'s no .contains() method on lists in Python (that\'s Java/JS), a single = is assignment not comparison, and == would compare "sam" to the whole list rather than searching inside it.',
          hints: [
            'Python has a dedicated keyword for "is this value inside that collection?" — it\'s not a method call.',
            'Rule out the ones that are wrong for a specific reason: = assigns, == compares two whole values, .contains() isn\'t a Python list method.',
            'The correct line is if "sam" in allowed_users: — in searches every item in the list for a match.',
          ],
        },
      ],
      xpReward: 15,
    },
    {
      id: 'building-a-loop',
      order: 13,
      title: 'Building a Simple Loop',
      activities: [
        {
          type: 'explanation',
          text:
            "Writing a loop from scratch means putting its parts in the right order: set up anything the loop needs before it starts, write the for or while line, then indent the body underneath. Get the order wrong — like using a variable before it's created, or writing the loop header after the body — and the code won't run.",
          example: {
            code: 'total = 0\nfor n in [4, 8, 15]:\n    total += n\nprint(total)',
            output: '27',
          },
        },
        {
          type: 'code-ordering',
          prompt: 'Arrange these lines so the program prints the total of the numbers in the list.',
          correctLines: [
            'numbers = [3, 6, 9]',
            'total = 0',
            'for n in numbers:',
            '    total += n',
            'print(total)',
          ],
          wrongAnswerExplanation:
            'numbers has to exist before the loop reads it, and total has to start at 0 before anything gets added to it. The for line introduces n, and only then can the indented total += n use it — print(total) has to come last, after the loop has finished adding everything up.',
          hints: [
            'Anything a line depends on has to be defined above it — find what each line needs first.',
            'numbers and total both need to exist before the for loop starts; the indented total += n line depends on the for line right above it.',
            'The order is: numbers = [3, 6, 9], then total = 0, then for n in numbers:, then the indented total += n, then print(total) last.',
          ],
        },
      ],
      xpReward: 15,
    },
    {
      id: 'first-program',
      order: 14,
      title: 'Your First Program',
      activities: [
        {
          type: 'explanation',
          text:
            "Time to write real code instead of just reading it. The editor below runs actual Python — write a program, hit Run, and see your own output. If you make a mistake, Python will tell you what went wrong; read the error message, it usually points right at the problem.",
          example: {
            code: 'print("Hello, world!")',
            output: 'Hello, world!',
          },
        },
        {
          type: 'code-editor',
          prompt:
            'Write a program that prints the numbers 1 through 5, each on its own line, using a loop.',
          starterCode: '# Write your code here\n',
          expectedOutput: '1\n2\n3\n4\n5',
          wrongAnswerExplanation:
            "range(1, 6) produces 1, 2, 3, 4, 5 — range stops before its second argument, so range(1, 6) is needed to include 5. A loop like for i in range(1, 6): print(i) prints each number on its own line.",
          hints: [
            'You need a loop that runs 5 times and prints a number each time — range() is the tool for that.',
            'range(1, 6) produces 1 through 5. Remember range stops one short of its second argument.',
            'Try: for i in range(1, 6):\\n    print(i) — that prints 1, 2, 3, 4, 5, each on its own line.',
          ],
        },
      ],
      xpReward: 15,
    },
  ],
};

export const gameDeveloperTrack: Track = {
  id: 'game-developer',
  title: 'Game Developer · C++',
  subtitle: "Translate what you already know into C++, with the extras game code leans on.",
  language: 'cpp',
  pathId: 'cpp',
  lessons: [
    {
      id: 'cpp-variables',
      order: 1,
      title: 'Variables & Types',
      activities: [
        {
          type: 'explanation',
          text:
            "Unlike Python, C++ needs you to state each variable's type up front — int for whole numbers, double for decimals, std::string for text. Once declared, a variable's type can't change. You print with std::cout and the << operator, chaining as many values as you like.",
          example: {
            code:
              'int score = 10;\nstd::string name = "Ava";\nstd::cout << name << " scored " << score << std::endl;',
            output: 'Ava scored 10',
          },
        },
        {
          type: 'predict-output',
          code: 'int score = 10;\nscore = score + 5;\nstd::cout << score << std::endl;',
          prompt: 'What does this print?',
          correctAnswer: '15',
          wrongAnswerExplanation:
            'score starts at 10. score = score + 5 takes the current value (10), adds 5, and stores the result back into score — the same rule as Python, just with a declared int type. std::cout then prints 15.',
          hints: [
            'Read score = score + 5 as: take the old value, add 5, save it back.',
            'score starts at 10 — score = score + 5 uses that old value before overwriting score with the result.',
            'score + 5 is 10 + 5 = 15, and that 15 is stored back into score, so std::cout prints 15.',
          ],
        },
      ],
      xpReward: 10,
    },
    {
      id: 'cpp-conditions',
      order: 2,
      title: 'Conditions',
      activities: [
        {
          type: 'explanation',
          text:
            "C++ conditions work like Python's, but every block needs curly braces {} instead of indentation, and the condition itself goes in parentheses. Only one branch runs — the first one that's true.",
          example: {
            code:
              'int temperature = 75;\nif (temperature > 80) {\n    std::cout << "Hot" << std::endl;\n} else if (temperature > 60) {\n    std::cout << "Nice" << std::endl;\n} else {\n    std::cout << "Cold" << std::endl;\n}',
            output: 'Nice',
          },
        },
        {
          type: 'predict-output',
          code:
            'int age = 15;\nif (age >= 18) {\n    std::cout << "Adult" << std::endl;\n} else if (age >= 13) {\n    std::cout << "Teen" << std::endl;\n} else {\n    std::cout << "Child" << std::endl;\n}',
          prompt: 'What does this print?',
          correctAnswer: 'Teen',
          wrongAnswerExplanation:
            'C++ checks each condition in order, same as Python. age >= 18 is false (15 is not >= 18), so it checks age >= 13 next. That one is true, so it prints Teen — the else never runs.',
          hints: [
            "Conditions are checked top to bottom. Find the first one that's true.",
            'age is 15 — check age >= 18 first; if that\'s false, C++ moves on to the next else if condition.',
            'age >= 18 is false, so it checks age >= 13 next, which is true — that branch prints Teen and the else never runs.',
          ],
        },
      ],
      xpReward: 10,
    },
    {
      id: 'cpp-loops',
      order: 3,
      title: 'Loops',
      activities: [
        {
          type: 'explanation',
          text:
            'A for loop in C++ has three parts inside its parentheses, separated by semicolons: a starting value, a condition to keep looping, and how to update each pass. It keeps running as long as the condition stays true.',
          example: {
            code: 'for (int i = 0; i < 3; i++) {\n    std::cout << i << std::endl;\n}',
            output: '0\n1\n2',
          },
        },
        {
          type: 'predict-output',
          code:
            'int total = 0;\nfor (int i = 1; i < 5; i++) {\n    total += i;\n}\nstd::cout << total << std::endl;',
          prompt: 'What does this print?',
          correctAnswer: '10',
          wrongAnswerExplanation:
            'The loop runs while i < 5, so i takes 1, 2, 3, 4 — the same numbers Python\'s range(1, 5) would give. Each pass adds i to total: 1, then 3, then 6, then 10.',
          hints: [
            'List out the values i takes, then add them one at a time.',
            'The loop runs while i < 5 starting from i = 1, so i takes the values 1, 2, 3, 4.',
            'Adding 1 + 2 + 3 + 4 one pass at a time: total goes 0 → 1 → 3 → 6 → 10.',
          ],
        },
      ],
      xpReward: 10,
    },
    {
      id: 'cpp-while-loops',
      order: 4,
      title: 'While Loops',
      activities: [
        {
          type: 'explanation',
          text:
            "A while loop in C++ repeats as long as its condition stays true, just like Python — but you still have to update the loop variable yourself inside the braces, or it never stops.",
          example: {
            code: 'int count = 0;\nwhile (count < 3) {\n    std::cout << count << std::endl;\n    count++;\n}',
            output: '0\n1\n2',
          },
        },
        {
          type: 'fill-in-blank',
          code:
            'int count = 0;\nwhile (count ____ 3) {\n    std::cout << count << std::endl;\n    count++;\n}',
          prompt: 'Fill in the blank so this prints 0, 1, and 2 — but stops before printing 3.',
          correctAnswer: '<',
          wrongAnswerExplanation:
            'count starts at 0 and increases by 1 each loop. count < 3 keeps looping while count is 0, 1, or 2 — printing each — and stops the moment count becomes 3. Using <= would print 3 too.',
          hints: [
            'You want the loop to stop the instant count reaches 3, not include it.',
            'Compare < and <= — one lets count equal 3 and keep looping, the other stops just before.',
            'count < 3 is true for 0, 1, and 2, then false once count is 3 — so the blank is the less-than symbol.',
          ],
        },
      ],
      xpReward: 10,
    },
    {
      id: 'cpp-arrays',
      order: 5,
      title: 'Arrays',
      activities: [
        {
          type: 'explanation',
          text:
            "An array holds a fixed number of values of the same type, back to back in memory. You declare its size up front, and access an item with square brackets — indexes start at 0, just like Python lists, but there's no negative indexing.",
          example: {
            code: 'int scores[3] = {10, 20, 30};\nstd::cout << scores[1] << std::endl;',
            output: '20',
          },
        },
        {
          type: 'predict-output',
          code: 'int scores[4] = {10, 20, 30, 40};\nstd::cout << scores[3] << std::endl;',
          prompt: 'What does this print?',
          correctAnswer: '40',
          wrongAnswerExplanation:
            "Indexes start at 0, so scores[3] is the 4th element — 40. There's no negative indexing in C++ like scores[-1] in Python; you have to count from the front.",
          hints: [
            'Count from 0: scores[0] is the first element. Which one is scores[3]?',
            'There\'s no negative indexing in C++ — count forward from index 0 to find scores[3].',
            'scores[0] is 10, scores[1] is 20, scores[2] is 30, and scores[3] is 40 — the fourth element.',
          ],
        },
      ],
      xpReward: 10,
    },
    {
      id: 'cpp-functions',
      order: 6,
      title: 'Functions',
      activities: [
        {
          type: 'explanation',
          text:
            "A C++ function declares the type of value it returns before its name — int for a whole number, void for nothing at all. Parameters need types too. Like Python, defining a function doesn't run it; you still have to call it.",
          example: {
            code: 'int square(int n) {\n    return n * n;\n}\n\nstd::cout << square(4) << std::endl;',
            output: '16',
          },
        },
        {
          type: 'fix-the-bug',
          code: 'int square(int n) {\n    return n * n\n}\n\nstd::cout << square(4) << std::endl;',
          prompt: "This won't compile. What's missing from the return line?",
          correctAnswer: ';',
          wrongAnswerExplanation:
            'Every statement in C++ needs a semicolon at the end, including return. return n * n without one is a syntax error — it should read return n * n;.',
          hints: [
            'Compare the return line to the std::cout line below it — what does it end with that this line is missing?',
            'Every statement in C++, including return, needs to end with the same punctuation mark as the line below it.',
            'return n * n is missing its trailing semicolon — it should read return n * n;.',
          ],
        },
      ],
      xpReward: 10,
    },
    {
      id: 'cpp-structs',
      order: 7,
      title: 'Structs (Game Objects)',
      activities: [
        {
          type: 'explanation',
          text:
            'A struct bundles related variables into one custom type — perfect for a game entity like a player, with fields for health and position all in one place. You create a struct value and reach its fields with a dot.',
          example: {
            code: 'struct Player {\n    int health;\n    int x;\n};\n\nPlayer hero = {100, 0};\nstd::cout << hero.health << std::endl;',
            output: '100',
          },
        },
        {
          type: 'predict-output',
          code:
            'struct Player {\n    int health;\n    int x;\n};\n\nPlayer hero = {100, 0};\nhero.health -= 30;\nstd::cout << hero.health << std::endl;',
          prompt: 'What does this print?',
          correctAnswer: '70',
          wrongAnswerExplanation:
            'hero.health starts at 100. hero.health -= 30 subtracts 30 and stores the result back — the same rule as score -= 5 on a plain variable — leaving 70.',
          hints: [
            '-= subtracts and reassigns, just like += adds and reassigns.',
            'hero.health starts at 100 — hero.health -= 30 subtracts 30 from that current value and stores the result back.',
            '100 - 30 is 70, and that 70 is stored back into hero.health, so std::cout prints 70.',
          ],
        },
      ],
      xpReward: 10,
    },
    {
      id: 'cpp-references',
      order: 8,
      title: 'References',
      activities: [
        {
          type: 'explanation',
          text:
            "Passing a variable to a function normally passes a copy — changes inside the function don't affect the original. Adding & to a parameter makes it a reference instead: the function works on the original variable directly, which is how game code avoids copying large objects every frame.",
          example: {
            code:
              'void heal(int &health) {\n    health += 10;\n}\n\nint hp = 50;\nheal(hp);\nstd::cout << hp << std::endl;',
            output: '60',
          },
        },
        {
          type: 'fill-in-blank',
          code:
            'void damage(int ____health) {\n    health -= 20;\n}\n\nint hp = 100;\ndamage(hp);\nstd::cout << hp << std::endl;',
          prompt: 'Fill in the blank so damage() actually changes hp, printing 80.',
          correctAnswer: '&',
          wrongAnswerExplanation:
            'Without &, health is just a copy — damage() would change its own local copy and hp would stay 100. int &health makes health a reference to the original hp, so subtracting from it changes hp itself.',
          hints: [
            'You need the symbol that turns a parameter into a reference to the original variable.',
            'Without a reference, health would just be a copy of hp — damage() needs to modify hp itself.',
            'Adding & before health (int &health) makes it a reference to hp, so subtracting from health changes hp directly, printing 80.',
          ],
        },
      ],
      xpReward: 10,
    },
    {
      id: 'cpp-project-health-bar',
      order: 9,
      title: 'Project: Health Bar',
      activities: [
        {
          type: 'explanation',
          text:
            'This project combines a struct, a function, and a loop: a Player struct holds health, a takeDamage function reduces it, and a loop applies damage across a few turns — printing the remaining health after each one.',
          example: {
            code:
              'struct Player {\n    int health;\n};\n\nvoid takeDamage(Player &p, int amount) {\n    p.health -= amount;\n}\n\nPlayer hero = {100};\nfor (int turn = 0; turn < 3; turn++) {\n    takeDamage(hero, 10);\n    std::cout << hero.health << std::endl;\n}',
            output: '90\n80\n70',
          },
        },
        {
          type: 'fix-the-bug',
          code:
            'struct Player {\n    int health;\n};\n\nvoid takeDamage(Player p, int amount) {\n    p.health -= amount;\n}\n\nPlayer hero = {100};\ntakeDamage(hero, 25);\nstd::cout << hero.health << std::endl;',
          prompt:
            'This prints 100 instead of 75 — takeDamage seems to do nothing. What should the parameter Player p become so it actually changes hero?',
          correctAnswer: 'Player &p',
          wrongAnswerExplanation:
            'Player p takes a copy of hero, so subtracting inside takeDamage only changes the copy — hero itself never changes, so it still prints 100. Player &p makes p a reference to the original hero, so the change sticks.',
          hints: [
            'This is the same fix as the References lesson — what turns a parameter into a reference?',
            'Player p currently takes a copy of hero, so changes inside takeDamage never reach the original hero.',
            'Change the parameter to Player &p so it references hero directly — then subtracting from p.health changes hero.health too, printing 75.',
          ],
        },
      ],
      xpReward: 25,
      isProject: true,
    },
  ],
};

export const tracks: Track[] = [foundationsTrack, aiDeveloperTrack, gameDeveloperTrack];

export function findLessonWithTrack(
  lessonId: string,
): { lesson: Lesson; track: Track } | undefined {
  for (const track of tracks) {
    const lesson = track.lessons.find((l) => l.id === lessonId);
    if (lesson) return { lesson, track };
  }
  return undefined;
}

export type PathId = 'cpp' | 'python';

export interface PathOption {
  id: PathId;
  title: string;
  language: string;
  description: string;
  available: boolean;
}

export const pathOptions: PathOption[] = [
  {
    id: 'cpp',
    title: 'Game Developer',
    language: 'C++',
    description: 'Build games with high-performance C++.',
    available: false,
  },
  {
    id: 'python',
    title: 'AI Developer',
    language: 'Python',
    description: 'Build AI apps with data, files, and logic.',
    available: true,
  },
];
