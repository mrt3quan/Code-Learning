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
  title: 'Programming Foundations',
  subtitle: 'Learn core programming concepts in Python, then apply them to your specialization.',
  language: 'python',
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
  subtitle: 'Data structures, error handling, classes, and JSON — building toward real AI-flavored projects.',
  language: 'python',
  pathId: 'python',
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
      id: 'ai-comprehensions',
      order: 2,
      title: 'List Comprehensions',
      explanation:
        "A list comprehension builds a new list in a single line by describing what to do with each item, instead of writing a full loop with .append(). The pattern is [expression for item in iterable], and adding an if at the end filters which items make it in. They show up constantly in code that processes data, since they read almost like the sentence they describe.",
      example: {
        code: 'numbers = [1, 2, 3, 4, 5]\ndoubled = [n * 2 for n in numbers]\nprint(doubled)',
        output: '[2, 4, 6, 8, 10]',
      },
      challenge: {
        type: 'predict-output',
        code:
          'scores = [55, 90, 40, 75, 30]\npassing = [s for s in scores if s >= 50]\nprint(len(passing))',
        prompt: 'What does this print?',
        correctAnswer: '3',
        wrongAnswerExplanation:
          "The comprehension keeps only scores where s >= 50 is True: 55, 90, and 75 qualify, while 40 and 30 don't. That leaves 3 items in passing, so len(passing) prints 3.",
        hint: 'Count how many scores in the original list are 50 or higher.',
      },
      xpReward: 10,
    },
    {
      id: 'ai-error-handling',
      order: 3,
      title: 'Error Handling',
      explanation:
        "Some errors are expected — a file might be missing, or input might not be a number — and a try/except block lets your program handle them instead of crashing. Python runs the try block first; the moment an error happens inside it, execution jumps straight to the matching except block.",
      example: {
        code: 'try:\n    number = int("abc")\nexcept ValueError:\n    print("That wasn\'t a number")',
        output: "That wasn't a number",
      },
      challenge: {
        type: 'fill-in-blank',
        code:
          'try:\n    result = 10 / 0\n____ ZeroDivisionError:\n    print("Can\'t divide by zero")',
        prompt: 'Fill in the blank so this catches the error instead of crashing.',
        correctAnswer: 'except',
        wrongAnswerExplanation:
          'try starts the block that might fail. To catch a specific error it can raise, you follow it with except <ErrorType>: — here, except ZeroDivisionError: catches the division error and runs the fallback print instead of crashing the program.',
        hint: 'You already have try — what keyword pairs with it to catch the error?',
      },
      xpReward: 10,
    },
    {
      id: 'ai-default-args',
      order: 4,
      title: 'Default Arguments',
      explanation:
        "A parameter can have a default value, given with = in the function definition. If the caller doesn't pass that argument, Python uses the default instead — this lets you add optional settings to a function without breaking every existing call to it.",
      example: {
        code:
          'def greet(name, greeting="Hello"):\n    print(greeting + ", " + name)\n\ngreet("Ava")\ngreet("Leo", "Hey")',
        output: 'Hello, Ava\nHey, Leo',
      },
      challenge: {
        type: 'predict-output',
        code: 'def power(base, exponent=2):\n    return base ** exponent\n\nprint(power(3))',
        prompt: 'What does this print?',
        correctAnswer: '9',
        wrongAnswerExplanation:
          'power(3) only passes one argument, so exponent falls back to its default value of 2. That computes base ** exponent as 3 ** 2, which is 9.',
        hint: "Since the second argument isn't given, the function falls back to its default value.",
      },
      xpReward: 10,
    },
    {
      id: 'ai-classes',
      order: 5,
      title: 'Classes & Objects',
      explanation:
        'A class is a blueprint for creating objects that bundle data and behavior together. Fields are set inside __init__, which runs automatically when you create an object, and methods are functions defined inside the class body. Every method\'s first parameter is self, which refers to the specific object it was called on.',
      example: {
        code:
          'class Dog:\n    def __init__(self, name):\n        self.name = name\n\n    def bark(self):\n        print(self.name + " says woof!")\n\nrex = Dog("Rex")\nrex.bark()',
        output: 'Rex says woof!',
      },
      challenge: {
        type: 'fill-in-blank',
        code:
          'class Counter:\n    def __init__(self):\n        self.count = 0\n\n    def increment(self):\n        self.____ += 1\n\nc = Counter()\nc.increment()\nc.increment()\nprint(c.count)',
        prompt: "Fill in the blank so increment() actually updates the object's count.",
        correctAnswer: 'count',
        wrongAnswerExplanation:
          "self.count is the object's own count field, set to 0 in __init__. self.count += 1 increases that specific object's count — using just count without self would refer to a variable that doesn't exist inside the method.",
        hint: "You're updating the same field that __init__ set on self.",
      },
      xpReward: 10,
    },
    {
      id: 'ai-files',
      order: 6,
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
      id: 'ai-json',
      order: 7,
      title: 'Working with JSON',
      explanation:
        "JSON is a text format for structured data that maps directly onto Python dictionaries and lists — it's how most web APIs and AI services send data back and forth. Python's json module converts between the two: json.loads() parses JSON text into a dict, and json.dumps() turns a dict back into JSON text.",
      example: {
        code: 'import json\n\ntext = \'{"name": "Ava", "score": 90}\'\ndata = json.loads(text)\nprint(data["name"])',
        output: 'Ava',
      },
      challenge: {
        type: 'predict-output',
        code:
          'import json\n\ntext = \'{"item": "sword", "price": 25}\'\ndata = json.loads(text)\ndata["price"] += 5\nprint(data["price"])',
        prompt: 'What does this print?',
        correctAnswer: '30',
        wrongAnswerExplanation:
          'json.loads() turns the JSON text into a regular Python dictionary, so data["price"] starts out as 25. data["price"] += 5 works exactly like any dictionary value update, giving 30.',
        hint: 'Once parsed, data is just a normal dictionary — treat data["price"] like any other dict value.',
      },
      xpReward: 10,
    },
    {
      id: 'ai-modules',
      order: 8,
      title: 'Modules & Imports',
      explanation:
        "A module is a file of Python code you can reuse with import, including modules built into Python itself. import math gives you access to everything inside it through dot notation, like math.sqrt(). You can also import just one name with from module import name, so you can call it directly without the module prefix.",
      example: {
        code: 'import math\n\nprint(math.sqrt(16))',
        output: '4.0',
      },
      challenge: {
        type: 'predict-output',
        code: 'from math import floor\n\nprice = 19.99\nprint(floor(price))',
        prompt: 'What does this print?',
        correctAnswer: '19',
        wrongAnswerExplanation:
          "from math import floor imports floor directly, so it's called as floor(price) instead of math.floor(price). floor() always rounds down to the nearest whole number, and 19.99 rounds down to 19.",
        hint: "floor() always rounds down, no matter how close the decimal is to the next whole number.",
      },
      xpReward: 10,
    },
    {
      id: 'ai-project-quiz',
      order: 9,
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
      isProject: true,
    },
    {
      id: 'ai-project-chatbot',
      order: 10,
      title: 'Project: Rule-Based Chatbot',
      explanation:
        "A simple rule-based \"chatbot\" just matches keywords in the user's message to a canned response — no real intelligence, but it's the same pattern real dialogue systems build on: check the input, find a matching rule, respond. Here a function loops over a dictionary of keyword-to-reply pairs and returns the first one it finds inside the message.",
      example: {
        code:
          'responses = {\n    "hello": "Hi there!",\n    "bye": "See you later!",\n}\n\ndef chatbot_reply(message):\n    for keyword in responses:\n        if keyword in message.lower():\n            return responses[keyword]\n    return "I don\'t understand."\n\nprint(chatbot_reply("hello there"))',
        output: 'Hi there!',
      },
      challenge: {
        type: 'fix-the-bug',
        code:
          'responses = {\n    "help": "How can I assist you?",\n    "thanks": "You\'re welcome!",\n}\n\ndef chatbot_reply(message):\n    for keyword in responses:\n        if keyword in message:\n            return responses[keyword]\n    return "I don\'t understand."\n\nprint(chatbot_reply("Thanks a lot!"))',
        prompt:
          'This prints "I don\'t understand." instead of matching "thanks". What should message become inside the if check so it matches regardless of capitalization?',
        correctAnswer: 'message.lower()',
        wrongAnswerExplanation:
          'The dictionary key is the lowercase "thanks", but the message is "Thanks a lot!" with a capital T, so "thanks" in message is False. Calling message.lower() first turns it into "thanks a lot!", which does contain "thanks".',
        hint: 'The keyword is lowercase, but the message might not be — what string method fixes that mismatch?',
      },
      xpReward: 25,
      isProject: true,
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
      explanation:
        "Unlike Python, C++ needs you to state each variable's type up front — int for whole numbers, double for decimals, std::string for text. Once declared, a variable's type can't change. You print with std::cout and the << operator, chaining as many values as you like.",
      example: {
        code:
          'int score = 10;\nstd::string name = "Ava";\nstd::cout << name << " scored " << score << std::endl;',
        output: 'Ava scored 10',
      },
      challenge: {
        type: 'predict-output',
        code: 'int score = 10;\nscore = score + 5;\nstd::cout << score << std::endl;',
        prompt: 'What does this print?',
        correctAnswer: '15',
        wrongAnswerExplanation:
          'score starts at 10. score = score + 5 takes the current value (10), adds 5, and stores the result back into score — the same rule as Python, just with a declared int type. std::cout then prints 15.',
        hint: 'Read score = score + 5 as: take the old value, add 5, save it back.',
      },
      xpReward: 10,
    },
    {
      id: 'cpp-conditions',
      order: 2,
      title: 'Conditions',
      explanation:
        "C++ conditions work like Python's, but every block needs curly braces {} instead of indentation, and the condition itself goes in parentheses. Only one branch runs — the first one that's true.",
      example: {
        code:
          'int temperature = 75;\nif (temperature > 80) {\n    std::cout << "Hot" << std::endl;\n} else if (temperature > 60) {\n    std::cout << "Nice" << std::endl;\n} else {\n    std::cout << "Cold" << std::endl;\n}',
        output: 'Nice',
      },
      challenge: {
        type: 'predict-output',
        code:
          'int age = 15;\nif (age >= 18) {\n    std::cout << "Adult" << std::endl;\n} else if (age >= 13) {\n    std::cout << "Teen" << std::endl;\n} else {\n    std::cout << "Child" << std::endl;\n}',
        prompt: 'What does this print?',
        correctAnswer: 'Teen',
        wrongAnswerExplanation:
          'C++ checks each condition in order, same as Python. age >= 18 is false (15 is not >= 18), so it checks age >= 13 next. That one is true, so it prints Teen — the else never runs.',
        hint: "Conditions are checked top to bottom. Find the first one that's true.",
      },
      xpReward: 10,
    },
    {
      id: 'cpp-loops',
      order: 3,
      title: 'Loops',
      explanation:
        'A for loop in C++ has three parts inside its parentheses, separated by semicolons: a starting value, a condition to keep looping, and how to update each pass. It keeps running as long as the condition stays true.',
      example: {
        code: 'for (int i = 0; i < 3; i++) {\n    std::cout << i << std::endl;\n}',
        output: '0\n1\n2',
      },
      challenge: {
        type: 'predict-output',
        code:
          'int total = 0;\nfor (int i = 1; i < 5; i++) {\n    total += i;\n}\nstd::cout << total << std::endl;',
        prompt: 'What does this print?',
        correctAnswer: '10',
        wrongAnswerExplanation:
          'The loop runs while i < 5, so i takes 1, 2, 3, 4 — the same numbers Python\'s range(1, 5) would give. Each pass adds i to total: 1, then 3, then 6, then 10.',
        hint: 'List out the values i takes, then add them one at a time.',
      },
      xpReward: 10,
    },
    {
      id: 'cpp-while-loops',
      order: 4,
      title: 'While Loops',
      explanation:
        "A while loop in C++ repeats as long as its condition stays true, just like Python — but you still have to update the loop variable yourself inside the braces, or it never stops.",
      example: {
        code: 'int count = 0;\nwhile (count < 3) {\n    std::cout << count << std::endl;\n    count++;\n}',
        output: '0\n1\n2',
      },
      challenge: {
        type: 'fill-in-blank',
        code:
          'int count = 0;\nwhile (count ____ 3) {\n    std::cout << count << std::endl;\n    count++;\n}',
        prompt: 'Fill in the blank so this prints 0, 1, and 2 — but stops before printing 3.',
        correctAnswer: '<',
        wrongAnswerExplanation:
          'count starts at 0 and increases by 1 each loop. count < 3 keeps looping while count is 0, 1, or 2 — printing each — and stops the moment count becomes 3. Using <= would print 3 too.',
        hint: 'You want the loop to stop the instant count reaches 3, not include it.',
      },
      xpReward: 10,
    },
    {
      id: 'cpp-arrays',
      order: 5,
      title: 'Arrays',
      explanation:
        "An array holds a fixed number of values of the same type, back to back in memory. You declare its size up front, and access an item with square brackets — indexes start at 0, just like Python lists, but there's no negative indexing.",
      example: {
        code: 'int scores[3] = {10, 20, 30};\nstd::cout << scores[1] << std::endl;',
        output: '20',
      },
      challenge: {
        type: 'predict-output',
        code: 'int scores[4] = {10, 20, 30, 40};\nstd::cout << scores[3] << std::endl;',
        prompt: 'What does this print?',
        correctAnswer: '40',
        wrongAnswerExplanation:
          "Indexes start at 0, so scores[3] is the 4th element — 40. There's no negative indexing in C++ like scores[-1] in Python; you have to count from the front.",
        hint: 'Count from 0: scores[0] is the first element. Which one is scores[3]?',
      },
      xpReward: 10,
    },
    {
      id: 'cpp-functions',
      order: 6,
      title: 'Functions',
      explanation:
        "A C++ function declares the type of value it returns before its name — int for a whole number, void for nothing at all. Parameters need types too. Like Python, defining a function doesn't run it; you still have to call it.",
      example: {
        code: 'int square(int n) {\n    return n * n;\n}\n\nstd::cout << square(4) << std::endl;',
        output: '16',
      },
      challenge: {
        type: 'fix-the-bug',
        code: 'int square(int n) {\n    return n * n\n}\n\nstd::cout << square(4) << std::endl;',
        prompt: "This won't compile. What's missing from the return line?",
        correctAnswer: ';',
        wrongAnswerExplanation:
          'Every statement in C++ needs a semicolon at the end, including return. return n * n without one is a syntax error — it should read return n * n;.',
        hint: 'Compare the return line to the std::cout line below it — what does it end with that this line is missing?',
      },
      xpReward: 10,
    },
    {
      id: 'cpp-structs',
      order: 7,
      title: 'Structs (Game Objects)',
      explanation:
        'A struct bundles related variables into one custom type — perfect for a game entity like a player, with fields for health and position all in one place. You create a struct value and reach its fields with a dot.',
      example: {
        code: 'struct Player {\n    int health;\n    int x;\n};\n\nPlayer hero = {100, 0};\nstd::cout << hero.health << std::endl;',
        output: '100',
      },
      challenge: {
        type: 'predict-output',
        code:
          'struct Player {\n    int health;\n    int x;\n};\n\nPlayer hero = {100, 0};\nhero.health -= 30;\nstd::cout << hero.health << std::endl;',
        prompt: 'What does this print?',
        correctAnswer: '70',
        wrongAnswerExplanation:
          'hero.health starts at 100. hero.health -= 30 subtracts 30 and stores the result back — the same rule as score -= 5 on a plain variable — leaving 70.',
        hint: '-= subtracts and reassigns, just like += adds and reassigns.',
      },
      xpReward: 10,
    },
    {
      id: 'cpp-references',
      order: 8,
      title: 'References',
      explanation:
        "Passing a variable to a function normally passes a copy — changes inside the function don't affect the original. Adding & to a parameter makes it a reference instead: the function works on the original variable directly, which is how game code avoids copying large objects every frame.",
      example: {
        code:
          'void heal(int &health) {\n    health += 10;\n}\n\nint hp = 50;\nheal(hp);\nstd::cout << hp << std::endl;',
        output: '60',
      },
      challenge: {
        type: 'fill-in-blank',
        code:
          'void damage(int ____health) {\n    health -= 20;\n}\n\nint hp = 100;\ndamage(hp);\nstd::cout << hp << std::endl;',
        prompt: 'Fill in the blank so damage() actually changes hp, printing 80.',
        correctAnswer: '&',
        wrongAnswerExplanation:
          'Without &, health is just a copy — damage() would change its own local copy and hp would stay 100. int &health makes health a reference to the original hp, so subtracting from it changes hp itself.',
        hint: 'You need the symbol that turns a parameter into a reference to the original variable.',
      },
      xpReward: 10,
    },
    {
      id: 'cpp-project-health-bar',
      order: 9,
      title: 'Project: Health Bar',
      explanation:
        'This project combines a struct, a function, and a loop: a Player struct holds health, a takeDamage function reduces it, and a loop applies damage across a few turns — printing the remaining health after each one.',
      example: {
        code:
          'struct Player {\n    int health;\n};\n\nvoid takeDamage(Player &p, int amount) {\n    p.health -= amount;\n}\n\nPlayer hero = {100};\nfor (int turn = 0; turn < 3; turn++) {\n    takeDamage(hero, 10);\n    std::cout << hero.health << std::endl;\n}',
        output: '90\n80\n70',
      },
      challenge: {
        type: 'fix-the-bug',
        code:
          'struct Player {\n    int health;\n};\n\nvoid takeDamage(Player p, int amount) {\n    p.health -= amount;\n}\n\nPlayer hero = {100};\ntakeDamage(hero, 25);\nstd::cout << hero.health << std::endl;',
        prompt:
          'This prints 100 instead of 75 — takeDamage seems to do nothing. What should the parameter Player p become so it actually changes hero?',
        correctAnswer: 'Player &p',
        wrongAnswerExplanation:
          'Player p takes a copy of hero, so subtracting inside takeDamage only changes the copy — hero itself never changes, so it still prints 100. Player &p makes p a reference to the original hero, so the change sticks.',
        hint: 'This is the same fix as the References lesson — what turns a parameter into a reference?',
      },
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
