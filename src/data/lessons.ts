// Phase 0 lesson content for the "Programming Foundations" track.
// This is the single seam Phase 1+ extends: add more lessons/tracks here,
// components should never hardcode lesson copy.

export interface LessonExample {
  code: string;
  output: string;
}

export interface LessonChallenge {
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

export const lessons: Lesson[] = [
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
      code: 'score = 10\nscore = score + 5\nprint(score)',
      prompt: 'What does this print?',
      correctAnswer: '15',
      wrongAnswerExplanation:
        'score starts at 10. The line score = score + 5 takes the current value of score (10), adds 5, and stores the result back into score. So the print statement outputs 15.',
      hint: "Read score = score + 5 as: take the old value, add 5, save it back.",
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
      code: 'total = 0\nfor i in range(1, 5):\n    total += i\nprint(total)',
      prompt: 'What does this print?',
      correctAnswer: '10',
      wrongAnswerExplanation:
        'range(1, 5) produces 1, 2, 3, 4 (it stops before 5). Each pass adds i to total: 0+1=1, 1+2=3, 3+3=6, 6+4=10. So the final printed value is 10.',
      hint: 'List out the numbers range(1, 5) actually produces, then add them one at a time.',
    },
    xpReward: 10,
  },
];
