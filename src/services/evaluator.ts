import type { EvaluationResult, WrittenQuestion } from '../types';
import { WRITTEN_RUBRIC } from '../data/rubric';

export interface AnswerEvaluator {
  evaluateAnswer(question: WrittenQuestion, answer: string): Promise<EvaluationResult>;
}

const USE_LLM = import.meta.env.VITE_USE_LLM === 'true';

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function detectRepeatedWords(text: string): boolean {
  const words = text.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length < 10) return false;
  const freq: Record<string, number> = {};
  for (const w of words) {
    freq[w] = (freq[w] || 0) + 1;
    if (freq[w] / words.length > 0.25 && words.length > 20) return true;
  }
  return false;
}

function detectStructureSignals(text: string): number {
  let signals = 0;
  if (/\d+[.)%]/.test(text)) signals += 0.25;
  if (/^(first|second|third|step \d|1\.|2\.|3\.)/im.test(text)) signals += 0.25;
  if (/(because|so that|in order to|as a result|therefore|due to)/i.test(text)) signals += 0.25;
  if (/(for example|e\.g\.|such as|instance|when i|in my)/i.test(text)) signals += 0.25;
  return Math.min(signals, 1);
}

function detectSpecificity(text: string): number {
  const actionVerbs = /\b(i built|i created|i designed|i implemented|i shipped|i led|i owned|i drove|i launched|i developed|i refactored|i deployed|i integrated|i automated)\b/i;
  const concreteTools = /\b(cursor|chatgpt|claude|copilot|github|docker|kubernetes|aws|python|typescript|react|node|supabase|postgres|fastapi|langchain|openai|api|ci\/cd|jenkins)\b/i;
  let score = 0;
  if (actionVerbs.test(text)) score += 0.5;
  if (concreteTools.test(text)) score += 0.5;
  return score;
}

export class LocalRubricEvaluator implements AnswerEvaluator {
  async evaluateAnswer(question: WrittenQuestion, answer: string): Promise<EvaluationResult> {
    if (!answer || answer.trim().length < 5) {
      return { score: 0, feedback: 'Answer too short or empty. Please provide a detailed response.' };
    }

    const wordCount = countWords(answer);
    const rubric = WRITTEN_RUBRIC[question.id];
    const keywords = rubric?.keywords || question.rubricKeywords;

    const lowerAnswer = answer.toLowerCase();
    const matchedKeywords = keywords.filter((k) => lowerAnswer.includes(k.toLowerCase()));
    const keywordCoverage = matchedKeywords.length / keywords.length;

    let lengthScore = 0;
    if (wordCount >= 80 && wordCount <= 250) lengthScore = 1;
    else if (wordCount > 250 && wordCount <= 350) lengthScore = 0.8;
    else if (wordCount >= 50 && wordCount < 80) lengthScore = 0.6;
    else if (wordCount > 350) lengthScore = 0.5;
    else if (wordCount >= 20) lengthScore = 0.3;

    const structureScore = detectStructureSignals(answer);
    const specificityScore = detectSpecificity(answer);

    let score =
      keywordCoverage * 4 +
      lengthScore * 2 +
      structureScore * 2 +
      specificityScore * 2;

    if (detectRepeatedWords(answer)) score *= 0.5;
    if (wordCount < 20) score *= 0.3;

    score = Math.max(0, Math.min(10, Math.round(score * 10) / 10));

    const feedbackParts: string[] = [];
    if (keywordCoverage > 0.6) feedbackParts.push('Strong rubric keyword coverage.');
    else if (keywordCoverage > 0.3) feedbackParts.push('Moderate keyword coverage; consider addressing more rubric topics.');
    else feedbackParts.push('Low keyword coverage; key concepts missing.');

    if (wordCount < 50) feedbackParts.push('Answer is quite brief; more detail would strengthen it.');
    else if (wordCount > 300) feedbackParts.push('Answer is lengthy; consider being more concise.');

    if (structureScore > 0.5) feedbackParts.push('Good structure with examples or steps.');
    else feedbackParts.push('Could use more structure (steps, examples, metrics).');

    if (specificityScore > 0.5) feedbackParts.push('Specific tools and first-person actions mentioned.');
    else feedbackParts.push('Add concrete tools and first-person examples.');

    return { score, feedback: feedbackParts.join(' ') };
  }
}

export class LLMEvaluator implements AnswerEvaluator {
  async evaluateAnswer(question: WrittenQuestion, answer: string): Promise<EvaluationResult> {
    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.question,
          rubric: question.rubricKeywords,
          answer,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (typeof data.score !== 'number' || typeof data.feedback !== 'string') {
        throw new Error('Invalid response shape');
      }
      return { score: data.score, feedback: data.feedback };
    } catch {
      const fallback = new LocalRubricEvaluator();
      return fallback.evaluateAnswer(question, answer);
    }
  }
}

export function getEvaluator(): AnswerEvaluator {
  if (USE_LLM) return new LLMEvaluator();
  return new LocalRubricEvaluator();
}
