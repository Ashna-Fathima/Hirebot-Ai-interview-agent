import { useEffect, useReducer, useRef, useCallback } from 'react';
import type {
  Stage, MCQAnswer, WrittenAnswer, InterviewResult,
} from '../types';
import { MCQ_BANK, WRITTEN_QUESTIONS, INTERVIEW_CONFIG } from '../config';
import { getEvaluator } from '../services/evaluator';

export interface InterviewState {
  stage: Stage;
  candidateName: string;
  candidateEmail: string;
  currentMCQIndex: number;
  mcqAnswers: MCQAnswer[];
  currentWrittenIndex: number;
  writtenAnswers: WrittenAnswer[];
  result: InterviewResult | null;
  focusLossCount: number;
}

type Action =
  | { type: 'START_INTERVIEW'; name: string; email: string }
  | { type: 'ANSWER_MCQ'; answer: MCQAnswer }
  | { type: 'ANSWER_WRITTEN'; answer: WrittenAnswer }
  | { type: 'SET_STAGE'; stage: Stage }
  | { type: 'SET_RESULT'; result: InterviewResult }
  | { type: 'ADD_FOCUS_LOSS' }
  | { type: 'RESET' }
  | { type: 'HYDRATE'; state: InterviewState };

const initialState: InterviewState = {
  stage: 'welcome',
  candidateName: '',
  candidateEmail: '',
  currentMCQIndex: 0,
  mcqAnswers: [],
  currentWrittenIndex: 0,
  writtenAnswers: [],
  result: null,
  focusLossCount: 0,
};

function reducer(state: InterviewState, action: Action): InterviewState {
  switch (action.type) {
    case 'HYDRATE':
      return action.state;
    case 'START_INTERVIEW':
      return {
        ...initialState,
        stage: 'mcq',
        candidateName: action.name,
        candidateEmail: action.email,
      };
    case 'ANSWER_MCQ': {
      const newAnswers = [...state.mcqAnswers, action.answer];
      const nextIndex = state.currentMCQIndex + 1;
      if (nextIndex >= MCQ_BANK.length) {
        return { ...state, mcqAnswers: newAnswers, currentMCQIndex: nextIndex, stage: 'written' };
      }
      return { ...state, mcqAnswers: newAnswers, currentMCQIndex: nextIndex };
    }
    case 'ANSWER_WRITTEN': {
      const newAnswers = [...state.writtenAnswers, action.answer];
      const nextIndex = state.currentWrittenIndex + 1;
      if (nextIndex >= WRITTEN_QUESTIONS.length) {
        return { ...state, writtenAnswers: newAnswers, currentWrittenIndex: nextIndex, stage: 'evaluating' };
      }
      return { ...state, writtenAnswers: newAnswers, currentWrittenIndex: nextIndex };
    }
    case 'SET_STAGE':
      return { ...state, stage: action.stage };
    case 'SET_RESULT':
      return { ...state, result: action.result, stage: 'result' };
    case 'ADD_FOCUS_LOSS':
      return { ...state, focusLossCount: state.focusLossCount + 1 };
    case 'RESET':
      return { ...initialState };
    default:
      return state;
  }
}

const STORAGE_KEY = 'hirebot-interview-state';

export function useInterviewState() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const hydrated = useRef(false);

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as InterviewState;
        if (parsed.stage && parsed.stage !== 'result') {
          dispatch({ type: 'HYDRATE', state: parsed });
        }
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (state.stage !== 'result') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  const startInterview = useCallback((name: string, email: string) => {
    dispatch({ type: 'START_INTERVIEW', name, email });
  }, []);

  const answerMCQ = useCallback((answer: MCQAnswer) => {
    dispatch({ type: 'ANSWER_MCQ', answer });
  }, []);

  const answerWritten = useCallback((answer: WrittenAnswer) => {
    dispatch({ type: 'ANSWER_WRITTEN', answer });
  }, []);

  const setStage = useCallback((stage: Stage) => {
    dispatch({ type: 'SET_STAGE', stage });
  }, []);

  const addFocusLoss = useCallback(() => {
    dispatch({ type: 'ADD_FOCUS_LOSS' });
  }, []);

  const reset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    dispatch({ type: 'RESET' });
  }, []);

  const computeResult = useCallback(async () => {
    const evaluator = getEvaluator();
    const mcqCorrect = state.mcqAnswers.filter(
      (a) => a.selected === MCQ_BANK.find((q) => q.id === a.questionId)?.correctAnswer
    ).length;
    const mcqScore = (mcqCorrect / MCQ_BANK.length) * 100;

    const writtenEvaluations: { questionId: string; score: number; feedback: string }[] = [];
    for (let i = 0; i < WRITTEN_QUESTIONS.length; i++) {
      const q = WRITTEN_QUESTIONS[i];
      const ans = state.writtenAnswers[i];
      const answerText = ans?.text || '';
      const evalResult = await evaluator.evaluateAnswer(q, answerText);
      writtenEvaluations.push({
        questionId: q.id,
        score: evalResult.score,
        feedback: evalResult.feedback,
      });
    }

    const writtenScore = (writtenEvaluations.reduce((sum, e) => sum + e.score, 0) / WRITTEN_QUESTIONS.length) * 10;
    const overallScore = mcqScore * INTERVIEW_CONFIG.mcqWeight + writtenScore * INTERVIEW_CONFIG.writtenWeight;
    const passed = overallScore >= INTERVIEW_CONFIG.passThreshold;

    const competencyMap: Record<string, { total: number; count: number }> = {
      'programming': { total: 0, count: 0 },
      'ai-leverage': { total: 0, count: 0 },
      'agency': { total: 0, count: 0 },
    };

    state.mcqAnswers.forEach((a) => {
      const q = MCQ_BANK.find((mq) => mq.id === a.questionId);
      if (q) {
        const correct = a.selected === q.correctAnswer ? 100 : 0;
        competencyMap[q.competency].total += correct;
        competencyMap[q.competency].count += 1;
      }
    });

    WRITTEN_QUESTIONS.forEach((q, i) => {
      const evalScore = writtenEvaluations[i]?.score ?? 0;
      competencyMap[q.competency].total += evalScore * 10;
      competencyMap[q.competency].count += 1;
    });

    const competencyScores = Object.entries(competencyMap).map(([key, val]) => ({
      competency: key as any,
      label: key === 'programming' ? 'Programming' : key === 'ai-leverage' ? 'AI Leverage' : 'Agency & Ownership',
      score: val.count > 0 ? Math.round((val.total / val.count) * 10) / 10 : 0,
    }));

    const strengths: string[] = [];
    const improvements: string[] = [];

    competencyScores.forEach((c) => {
      if (c.score >= 70) strengths.push(`${c.label}: strong performance (${c.score}%)`);
      else improvements.push(`${c.label}: needs improvement (${c.score}%)`);
    });

    if (mcqScore >= 70) strengths.push(`MCQ knowledge: solid (${Math.round(mcqScore)}%)`);
    else improvements.push(`MCQ knowledge: review fundamentals (${Math.round(mcqScore)}%)`);

    if (writtenScore >= 70) strengths.push(`Written answers: well-structured (${Math.round(writtenScore)}%)`);
    else improvements.push(`Written answers: add more depth and detail (${Math.round(writtenScore)}%)`);

    if (state.focusLossCount > 2) {
      improvements.push(`Tab focus lost ${state.focusLossCount} times during the interview`);
    }

    const result: InterviewResult = {
      candidateName: state.candidateName,
      candidateEmail: state.candidateEmail,
      date: new Date().toISOString(),
      mcqScore: Math.round(mcqScore * 10) / 10,
      writtenScore: Math.round(writtenScore * 10) / 10,
      overallScore: Math.round(overallScore * 10) / 10,
      passed,
      competencyScores,
      strengths: strengths.length > 0 ? strengths : ['Completed the full interview'],
      improvements: improvements.length > 0 ? improvements : ['Keep refining your skills'],
      mcqAnswers: state.mcqAnswers,
      writtenAnswers: state.writtenAnswers,
      writtenFeedback: writtenEvaluations,
      totalFocusLossCount: state.focusLossCount,
    };

    const allResults = getStoredResults();
    allResults.push(result);
    localStorage.setItem('hirebot-all-results', JSON.stringify(allResults));

    dispatch({ type: 'SET_RESULT', result });
    localStorage.removeItem(STORAGE_KEY);
  }, [state]);

  return {
    state,
    startInterview,
    answerMCQ,
    answerWritten,
    setStage,
    addFocusLoss,
    reset,
    computeResult,
  };
}

export function getStoredResults(): InterviewResult[] {
  try {
    const raw = localStorage.getItem('hirebot-all-results');
    return raw ? (JSON.parse(raw) as InterviewResult[]) : [];
  } catch {
    return [];
  }
}
