import Anthropic from '@anthropic-ai/sdk';

export interface Env {
  ANTHROPIC_API_KEY?: string;
}

interface TutorHintRequest {
  lessonTitle: string;
  explanation: string;
  challengeCode: string;
  challengePrompt: string;
  correctAnswer: string;
  staticHint: string;
  staticExplanation: string;
  userAnswer: string;
  wrongAttempts: number;
}

// This is a public, unauthenticated endpoint holding a shared API key —
// restricting CORS keeps casual browser-based reuse from other sites out,
// but it is not a substitute for real rate limiting/auth if usage grows.
const ALLOWED_ORIGINS = [
  'https://mrt3quan.github.io',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5175',
];

function corsHeaders(origin: string | null): Record<string, string> {
  const allow = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'content-type',
  };
}

function json(body: unknown, status: number, origin: string | null): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...corsHeaders(origin) },
  });
}

// Nudge -> Hint -> Explanation: each wrong attempt earns a more revealing
// response, grounded in the lesson's own static content so the model can't
// wander off-topic or contradict what the app already teaches.
const TIER_INSTRUCTIONS: Record<1 | 2 | 3, string> = {
  1: 'The learner has made ONE incorrect attempt so far. Give a short, gentle nudge (1-2 sentences) that points them toward the right area of the code WITHOUT revealing the correct answer or the specific fix.',
  2: 'The learner has made TWO incorrect attempts. Give a more specific hint (2-3 sentences) that names the concept or line involved, still without stating the literal correct answer outright.',
  3: "The learner has made THREE OR MORE incorrect attempts. Give a full, clear explanation (3-4 sentences) of why their answer is wrong and what the correct answer is, walking through the reasoning so they understand it. It's okay to reveal the answer now.",
};

function tierFor(wrongAttempts: number): 1 | 2 | 3 {
  if (wrongAttempts <= 1) return 1;
  if (wrongAttempts === 2) return 2;
  return 3;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin');

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }
    if (request.method !== 'POST') {
      return json({ error: 'Not found' }, 404, origin);
    }
    if (!env.ANTHROPIC_API_KEY) {
      return json({ error: 'Tutor is not configured yet' }, 503, origin);
    }

    let body: TutorHintRequest;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Invalid request body' }, 400, origin);
    }

    const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

    try {
      const response = await client.messages.create({
        model: 'claude-haiku-4-5',
        max_tokens: 300,
        system:
          "You are a friendly, concise Python tutor for a beginner coding app called CodeQuest. " +
          "You are given one lesson's challenge, its correct answer, and the reference hint/explanation " +
          "the app already shows. Write a short, encouraging, plain-English response grounded in that " +
          "material — do not introduce unrelated concepts. Never use markdown formatting; respond in " +
          "plain prose.",
        messages: [
          {
            role: 'user',
            content: `Lesson: ${body.lessonTitle}
Concept explanation: ${body.explanation}
Challenge code:
${body.challengeCode}
Challenge prompt: ${body.challengePrompt}
Correct answer: ${body.correctAnswer}
Reference hint: ${body.staticHint}
Reference explanation: ${body.staticExplanation}
Learner's incorrect answer: ${body.userAnswer}

${TIER_INSTRUCTIONS[tierFor(body.wrongAttempts)]}`,
          },
        ],
      });

      const textBlock = response.content.find((b) => b.type === 'text');
      const hint = textBlock && textBlock.type === 'text' ? textBlock.text.trim() : '';
      if (!hint) return json({ error: 'Empty response from tutor' }, 502, origin);

      return json({ hint }, 200, origin);
    } catch {
      return json({ error: 'Tutor request failed' }, 502, origin);
    }
  },
};
