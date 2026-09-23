export type Stage = 'welcome' | 'mcq' | 'written' | 'evaluating' | 'result';

export type Theme = 'light' | 'dark';

export type Competency = 'programming' | 'ai-leverage' | 'agency';

export interface MCQOption {
  label: string;
  text: string;
}

export interface MCQQuestion {
  id: number;
  question: string;
  options: MCQOption[];
  correctAnswer: string;
  competency: Competency;
}

export interface WrittenQuestion {
  id: string;
  question: string;
  competency: Competency;
  rubricKeywords: string[];
  minWords: number;
}

export interface MCQAnswer {
  questionId: number;
  selected: string | null;
  timedOut: boolean;
  timeSpent: number;
}

export interface WrittenAnswer {
  questionId: string;
  text: string;
  timedOut: boolean;
  timeSpent: number;
  wordCount: number;
  focusLossCount: number;
}

export interface EvaluationResult {
  score: number;
  feedback: string;
}

export interface CompetencyScore {
  competency: Competency;
  label: string;
  score: number;
}

export interface InterviewResult {
  candidateName: string;
  candidateEmail: string;
  date: string;
  mcqScore: number;
  writtenScore: number;
  overallScore: number;
  passed: boolean;
  competencyScores: CompetencyScore[];
  strengths: string[];
  improvements: string[];
  mcqAnswers: MCQAnswer[];
  writtenAnswers: WrittenAnswer[];
  writtenFeedback: { questionId: string; score: number; feedback: string }[];
  totalFocusLossCount: number;
}
