// Lesson content for every track. This is the single seam the app extends:
// add more lessons/tracks/challenge types here, components should never
// hardcode lesson copy.

export interface LessonExample {
  code: string;
  output: string;
}

export type ChallengeType = 'predict-output' | 'fill-in-blank' | 'fix-the-bug';

export interface LessonChallenge {
  type: ChallengeType;
  code: string;
  prompt: string;
  correctAnswer: string;
  wrongAnswerExplanation: string;
  hint: string;
}

export interface Lesson {
  id: string;
  order: number;
  title: string;
  explanation: string;
  example: LessonExample;
  challenge: LessonChallenge;
  xpReward: number;
}

export interface Track {
  id: string;
  title: string;
  subtitle: string;
  lessons: Lesson[];
}

export const foundationsTrack: Track = {
  id: 'foundations',
  title: 'Programming Foundations',
  subtitle: 'Learn Python one bite-sized lesson at a time.',
  lessons: [
    {
      id: 'variables',
      order: 1,
      title: 'Variables',
      explanation:
        "A variable is a named box that stores a value so you can use it later. In Python you create one just by writing a name, an equals sign, and a value — there's no need to declare a type first. Once it's set, you can print the variable, use it in math, or reassign it to something new.",
      example: {
        code: 'name = "Ava"\nage = 12\nprint(name, "is", age, "years old")',
        output: 'Ava is 12 years old',
      },
      challenge: {
        type: 'predict-output',
        code: 'score = 10\nscore = score + 5\nprint(score)',
        prompt: 'What does this print?',
        correctAnswer: '15',
        wrongAnswerExplanation:
          'score starts at 10. The line score = score + 5 takes the current value of score (10), adds 5, and stores the result back into score. So the print statement outputs 15.',
        hint: 'Read score = score + 5 as: take the old value, add 5, save it back.',
      },
      xpReward: 10,
    },
    {
      id: 'conditions',
      order: 2,
      title: 'Conditions',
      explanation:
        "Conditions let a program make decisions using if, elif, and else. Python checks the if condition first — if it's True, that block runs and everything else is skipped. If it's False, Python checks the next elif, and if none of them match, it falls back to else.",
      example: {
        code:
          'temperature = 75\nif temperature > 80:\n    print("Hot")\nelif temperature > 60:\n    print("Nice")\nelse:\n    print("Cold")',
        output: 'Nice',
      },
      challenge: {
        type: 'predict-output',
        code:
          'age = 15\nif age >= 18:\n    print("Adult")\nelif age >= 13:\n    print("Teen")\nelse:\n    print("Child")',
        prompt: 'What does this print?',
        correctAnswer: 'Teen',
        wrongAnswerExplanation:
          "Python checks each condition in order. age >= 18 is False (15 is not >= 18), so it moves to the next check: age >= 13. Since 15 >= 13 is True, that block runs and prints Teen — the else is never reached.",
        hint: "Conditions are checked top to bottom. Find the first one that's True.",
      },
      xpReward: 10,
    },
    {
      id: 'loops',
      order: 3,
      title: 'Loops',
      explanation:
        'A loop repeats a block of code without you having to write it out multiple times. A for loop with range(n) runs its body once for each number from 0 up to (but not including) n. The loop variable, like i, updates automatically on every pass.',
      example: {
        code: 'for i in range(3):\n    print(i)',
        output: '0\n1\n2',
      },
      challenge: {
        type: 'predict-output',
        code: 'total = 0\nfor i in range(1, 5):\n    total += i\nprint(total)',
        prompt: 'What does this print?',
        correctAnswer: '10',
        wrongAnswerExplanation:
          'range(1, 5) produces 1, 2, 3, 4 (it stops before 5). Each pass adds i to total: 0+1=1, 1+2=3, 3+3=6, 6+4=10. So the final printed value is 10.',
        hint: 'List out the numbers range(1, 5) actually produces, then add them one at a time.',
      },
      xpReward: 10,
    },
    {
      id: 'while-loops',
      order: 4,
      title: 'While Loops',
      explanation:
        "A while loop repeats as long as a condition stays True — unlike a for loop, it doesn't know in advance how many times it will run. Each time through, Python re-checks the condition before running the body again. Forget to update something inside the loop that eventually makes the condition False, and it will run forever.",
      example: {
        code: 'count = 0\nwhile count < 3:\n    print(count)\n    count += 1',
        output: '0\n1\n2',
      },
      challenge: {
        type: 'fill-in-blank',
        code: 'count = 0\nwhile count ____ 3:\n    print(count)\n    count += 1',
        prompt:
          'Fill in the blank so this prints 0, 1, and 2 — but stops before printing 3.',
        correctAnswer: '<',
        wrongAnswerExplanation:
          'count starts at 0 and increases by 1 each loop. count < 3 keeps looping while count is 0, 1, or 2 — printing each one — and stops the moment count becomes 3. Using <= would print 3 too.',
        hint: 'You want the loop to stop the instant count reaches 3, not include it.',
      },
      xpReward: 10,
    },
    {
      id: 'lists',
      order: 5,
      title: 'Lists',
      explanation:
        'A list stores an ordered collection of values in a single variable, written with square brackets. You access an item by its position, called its index, and indexes start at 0 — so the first item is at index 0, not 1. Lists can hold any type of value and can grow with methods like .append().',
      example: {
        code:
          'fruits = ["apple", "banana", "cherry"]\nfruits.append("date")\nprint(fruits[1])',
        output: 'banana',
      },
      challenge: {
        type: 'predict-output',
        code: 'scores = [10, 20, 30, 40]\nprint(scores[-1])',
        prompt: 'What does this print?',
        correctAnswer: '40',
        wrongAnswerExplanation:
          "Negative indexes count backwards from the end of the list. scores[-1] means \"the last item\", which is 40 — not the first or second item.",
        hint: 'A negative index like -1 counts backwards from the end of the list.',
      },
      xpReward: 10,
    },
    {
      id: 'strings',
      order: 6,
      title: 'Strings',
      explanation:
        "A string is text, and Python lets you treat it like a list of characters — you can index into it or measure its length with len(). Strings also come with built-in methods like .upper() and .lower() for quick transformations. Strings are immutable, so these methods always return a new string instead of changing the original.",
      example: {
        code: 'word = "python"\nprint(word[0], word[-1], len(word))',
        output: 'p n 6',
      },
      challenge: {
        type: 'fill-in-blank',
        code: 'name = "ada"\nprint(name.____())',
        prompt: 'Fill in the blank so this prints ADA.',
        correctAnswer: 'upper',
        wrongAnswerExplanation:
          '.upper() returns a new string with every letter capitalized. name.upper() turns "ada" into "ADA".',
        hint: 'You need the string method that makes every letter capital, not just the first one.',
      },
      xpReward: 10,
    },
    {
      id: 'dictionaries',
      order: 7,
      title: 'Dictionaries',
      explanation:
        'A dictionary stores data as key-value pairs instead of a numbered sequence — you look up a value by its key, not its position. Keys are written before a colon and values after, all wrapped in curly braces. You read a value using square brackets with the key inside, like a lookup table.',
      example: {
        code: 'student = {"name": "Mia", "grade": 7}\nprint(student["name"])',
        output: 'Mia',
      },
      challenge: {
        type: 'fix-the-bug',
        code: 'scores = {"math": 90, "art": 85}\nprint(scores["science"])',
        prompt:
          'This crashes with a KeyError. What should replace scores["science"] so it works?',
        correctAnswer: 'scores["math"]',
        wrongAnswerExplanation:
          'scores has no "science" key, so scores["science"] raises a KeyError. The dictionary only defines "math" and "art" as keys — scores["math"] is one that actually exists.',
        hint: 'Check which keys the dictionary actually defines, and use one of those.',
      },
      xpReward: 10,
    },
    {
      id: 'functions',
      order: 8,
      title: 'Functions',
      explanation:
        "A function is a reusable block of code you define once with def and can call by name as many times as you like. Parameters let you pass different values in each time you call it, so the function can work with whatever data you give it. Defining a function doesn't run it — nothing happens until you actually call it.",
      example: {
        code: 'def greet(name):\n    print("Hello, " + name)\n\ngreet("Sam")',
        output: 'Hello, Sam',
      },
      challenge: {
        type: 'fix-the-bug',
        code: 'def square(n)\n    return n * n\n\nprint(square(4))',
        prompt:
          "This has a syntax error and won't run. What's missing from the function definition line?",
        correctAnswer: ':',
        wrongAnswerExplanation:
          'Every def line needs a colon at the end, just like if and while statements: def square(n):. Without it, Python cannot tell where the header ends and the body begins.',
        hint: 'Compare this def line to a working one — what punctuation is missing at the end?',
      },
      xpReward: 10,
    },
    {
      id: 'return-values',
      order: 9,
      title: 'Return Values',
      explanation:
        "A function can send a value back to wherever it was called using return — that's different from print, which just displays something and hands nothing back to your code. As soon as return runs, the function stops immediately, so anything after it inside that function never runs.",
      example: {
        code: 'def double(n):\n    return n * 2\n\nresult = double(5)\nprint(result)',
        output: '10',
      },
      challenge: {
        type: 'predict-output',
        code:
          'def add(a, b):\n    return a + b\n    print("done")\n\nprint(add(2, 3))',
        prompt: 'What does this print?',
        correctAnswer: '5',
        wrongAnswerExplanation:
          'return immediately exits the function, so print("done") on the line after it never runs — it\'s unreachable. add(2, 3) returns 5, and that\'s the value the outer print() displays.',
        hint: 'Once a function hits return, does anything else inside that function still run?',
      },
      xpReward: 10,
    },
  ],
};

export const aiDeveloperTrack: Track = {
  id: 'ai-developer',
  title: 'AI Developer · Python',
  subtitle: 'Combine data, files, and logic into your first real program.',
  lessons: [
    {
      id: 'ai-lists-and-dicts',
      order: 1,
      title: 'Lists & Dictionaries',
      explanation:
        'Real programs often combine lists and dictionaries — a list of dictionaries is a natural way to represent a table of records, like a roster of students. Loop over the list with a for loop, and each item you get back is one dictionary you can look up by key.',
      example: {
        code:
          'students = [\n    {"name": "Mia", "grade": 7},\n    {"name": "Leo", "grade": 8},\n]\nfor student in students:\n    print(student["name"])',
        output: 'Mia\nLeo',
      },
      challenge: {
        type: 'predict-output',
        code:
          'inventory = [\n    {"item": "sword", "qty": 2},\n    {"item": "shield", "qty": 1},\n]\ntotal = 0\nfor entry in inventory:\n    total += entry["qty"]\nprint(total)',
        prompt: 'What does this print?',
        correctAnswer: '3',
        wrongAnswerExplanation:
          'inventory holds two dictionaries. The loop adds each one\'s "qty" to total: 0 + 2 = 2, then 2 + 1 = 3. So the final printed value is 3.',
        hint: 'Add up the "qty" value from each dictionary in the list, one at a time.',
      },
      xpReward: 10,
    },
    {
      id: 'ai-files',
      order: 2,
      title: 'Files',
      explanation:
        'Python can read and write text files with open(). Opening a file in "w" mode creates it (or overwrites it) for writing; opening it in "r" mode reads what\'s there. A with block closes the file for you automatically once you\'re done with it.',
      example: {
        code:
          'with open("notes.txt", "w") as f:\n    f.write("hello")\n\nwith open("notes.txt", "r") as f:\n    print(f.read())',
        output: 'hello',
      },
      challenge: {
        type: 'fill-in-blank',
        code:
          'with open("log.txt", "w") as f:\n    f.write("done")\n\nwith open("log.txt", "____") as f:\n    print(f.read())',
        prompt: 'Fill in the blank with the mode needed to read the file back.',
        correctAnswer: 'r',
        wrongAnswerExplanation:
          '"w" mode is for writing — opening a file in "w" mode again would erase it. To read the contents back, you need to open it in "r" mode.',
        hint: 'You already wrote to the file — now you need the mode for reading.',
      },
      xpReward: 10,
    },
    {
      id: 'ai-project-quiz',
      order: 3,
      title: 'Project: Quiz Game',
      explanation:
        'A small project pulls together everything so far: variables to keep score, a loop to check each answer, and a condition to compare a guess against the right one. Here\'s the core of a tiny quiz game that grades itself.',
      example: {
        code:
          'question = "2 + 2 = ?"\nanswer = "4"\nguess = "4"\n\nif guess == answer:\n    print("Correct!")\nelse:\n    print("Try again.")',
        output: 'Correct!',
      },
      challenge: {
        type: 'fix-the-bug',
        code:
          'questions = ["2 + 2", "3 + 3"]\nanswers = ["4", "6"]\nscore = 0\n\nfor i in range(len(questions)):\n    guess = answers[i]\n    if guess = answers[i]:\n        score += 1\n\nprint(score)',
        prompt:
          'This has a syntax error on the if line. What should replace guess = answers[i] there?',
        correctAnswer: 'guess == answers[i]',
        wrongAnswerExplanation:
          "A single = assigns a value, and Python doesn't allow that inside an if condition. Comparing two values for equality needs ==, so the line should read if guess == answers[i]:.",
        hint: 'Assignment and comparison look almost identical but use a different number of equals signs.',
      },
      xpReward: 25,
    },
  ],
};

export const tracks: Track[] = [foundationsTrack, aiDeveloperTrack];

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

// C++ execution needs a WASM-compiled toolchain and sandboxing this app
// doesn't have yet, so that path is shown but not selectable.
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
