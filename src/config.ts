import type { MCQQuestion, WrittenQuestion } from './types';

export const INTERVIEW_CONFIG = {
  passThreshold: 70,
  mcqWeight: 0.4,
  writtenWeight: 0.6,
  mcqTimePerQuestion: 60,
  writtenTimePerQuestion: 240,
  writtenMinWords: 20,
  mcqCount: 8,
  writtenCount: 3,
  evaluatingDelay: 2500,
  adminPassword: 'hirebot-admin-2024',
} as const;

export const MCQ_BANK: MCQQuestion[] = [
  {
    id: 1,
    question: "Lowering an LLM's temperature mainly makes outputs:",
    options: [
      { label: 'A', text: 'more random' },
      { label: 'B', text: 'more deterministic' },
      { label: 'C', text: 'longer' },
      { label: 'D', text: 'cheaper' },
    ],
    correctAnswer: 'B',
    competency: 'ai-leverage',
  },
  {
    id: 2,
    question: 'What is the main purpose of RAG?',
    options: [
      { label: 'A', text: 'Train a model faster' },
      { label: 'B', text: 'Retrieve relevant external documents to ground the model\u2019s answer' },
      { label: 'C', text: 'Compress the model' },
      { label: 'D', text: 'Generate images' },
    ],
    correctAnswer: 'B',
    competency: 'ai-leverage',
  },
  {
    id: 3,
    question: 'Best way to reduce hallucinations in Q&A over company docs:',
    options: [
      { label: 'A', text: 'Increase temperature' },
      { label: 'B', text: 'Use a bigger prompt with no context' },
      { label: 'C', text: 'RAG with source citations' },
      { label: 'D', text: 'Ask the model to "be accurate"' },
    ],
    correctAnswer: 'C',
    competency: 'ai-leverage',
  },
  {
    id: 4,
    question: 'Time complexity of binary search on a sorted array:',
    options: [
      { label: 'A', text: 'O(n)' },
      { label: 'B', text: 'O(log n)' },
      { label: 'C', text: 'O(n log n)' },
      { label: 'D', text: 'O(1)' },
    ],
    correctAnswer: 'B',
    competency: 'programming',
  },
  {
    id: 5,
    question: 'In an AI agent loop, a "tool call" is:',
    options: [
      { label: 'A', text: 'The model executing code on its own' },
      { label: 'B', text: 'The model emitting a structured request that the system executes and returns results for' },
      { label: 'C', text: 'A database migration' },
      { label: 'D', text: 'A model fine-tuning step' },
    ],
    correctAnswer: 'B',
    competency: 'programming',
  },
  {
    id: 6,
    question: 'An idempotent API operation means:',
    options: [
      { label: 'A', text: 'It always fails safely' },
      { label: 'B', text: 'Repeating the same request has the same effect as doing it once' },
      { label: 'C', text: 'It is asynchronous' },
      { label: 'D', text: 'It is cached forever' },
    ],
    correctAnswer: 'B',
    competency: 'programming',
  },
  {
    id: 7,
    question: 'Which HTTP status code indicates rate limiting?',
    options: [
      { label: 'A', text: '401' },
      { label: 'B', text: '404' },
      { label: 'C', text: '429' },
      { label: 'D', text: '503' },
    ],
    correctAnswer: 'C',
    competency: 'programming',
  },
  {
    id: 8,
    question: 'Prompt injection is:',
    options: [
      { label: 'A', text: 'Faster prompt caching' },
      { label: 'B', text: 'Untrusted content containing instructions that hijack model behavior' },
      { label: 'C', text: 'A way to fine-tune' },
      { label: 'D', text: 'A JSON schema' },
    ],
    correctAnswer: 'B',
    competency: 'ai-leverage',
  },
];

export const WRITTEN_QUESTIONS: WrittenQuestion[] = [
  {
    id: 'W1',
    question:
      'Describe a real project where you used AI tools (e.g., Cursor, ChatGPT, Claude, Copilot) to boost your productivity. What did you build, what went wrong, and how did you verify the AI\u2019s output?',
    competency: 'ai-leverage',
    rubricKeywords: [
      'prompt', 'iterate', 'verify', 'test', 'review', 'debug',
      'hallucination', 'context', 'workflow', 'agent', 'refactor',
      'productivity', 'edge case', 'tradeoff',
    ],
    minWords: 20,
  },
  {
    id: 'W2',
    question:
      'Design an AI agent that automates a multi-step computer task (e.g., filing an expense report from emails). Explain the architecture, tools, memory/state, and how you handle failures and retries.',
    competency: 'programming',
    rubricKeywords: [
      'planner', 'tool', 'function calling', 'loop', 'state', 'memory',
      'retry', 'timeout', 'idempotent', 'queue', 'logging', 'evaluation',
      'guardrail', 'human-in-the-loop', 'schema', 'latency',
    ],
    minWords: 20,
  },
  {
    id: 'W3',
    question:
      'Tell us about a time you took ownership of a problem beyond your assigned role, without being asked. What did you do and what was the outcome?',
    competency: 'agency',
    rubricKeywords: [
      'initiative', 'owned', 'end-to-end', 'shipped', 'deadline',
      'metric', 'impact', 'stakeholder', 'decision', 'learned',
      'proactive', 'result',
    ],
    minWords: 20,
  },
];

export const COMPETENCY_LABELS: Record<string, string> = {
  'programming': 'Programming',
  'ai-leverage': 'AI Leverage',
  'agency': 'Agency & Ownership',
};
