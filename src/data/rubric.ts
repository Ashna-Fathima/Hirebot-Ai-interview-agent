import { WRITTEN_QUESTIONS } from '../config';
import type { WrittenQuestion } from '../types';

export const WRITTEN_RUBRIC: Record<string, { keywords: string[]; description: string }> = {};

WRITTEN_QUESTIONS.forEach((q: WrittenQuestion) => {
  WRITTEN_RUBRIC[q.id] = {
    keywords: q.rubricKeywords,
    description: `Rubric for ${q.id}: evaluate based on keyword coverage, depth, structure, and specificity.`,
  };
});
