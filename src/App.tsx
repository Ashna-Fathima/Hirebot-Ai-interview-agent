import { useEffect, useState } from 'react';
import { Bot } from 'lucide-react';
import { useTheme } from './hooks/useTheme';
import { useInterviewState } from './hooks/useInterviewState';
import { ThemeToggle } from './components/ThemeToggle';
import { WelcomePage } from './pages/WelcomePage';
import { MCQPage } from './pages/MCQPage';
import { WrittenPage } from './pages/WrittenPage';
import { EvaluatingPage } from './pages/EvaluatingPage';
import { ResultPage } from './pages/ResultPage';
import { AdminPage } from './pages/AdminPage';
import { INTERVIEW_CONFIG } from './config';

function App() {
  const { theme, toggle } = useTheme();
  const { state, startInterview, answerMCQ, answerWritten, reset, computeResult, setStage, addFocusLoss } = useInterviewState();
  const [route, setRoute] = useState<'interview' | 'admin'>(
    window.location.pathname.startsWith('/admin') ? 'admin' : 'interview'
  );

  useEffect(() => {
    if (state.stage === 'evaluating') {
      const timer = setTimeout(() => {
        computeResult();
      }, INTERVIEW_CONFIG.evaluatingDelay);
      return () => clearTimeout(timer);
    }
  }, [state.stage, computeResult]);

  const handleBackToInterview = () => {
    setRoute('interview');
    window.history.pushState({}, '', '/');
  };

  useEffect(() => {
    const onPop = () => {
      setRoute(window.location.pathname.startsWith('/admin') ? 'admin' : 'interview');
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  if (route === 'admin') {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300">
        <AdminPage onBack={handleBackToInterview} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300">
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/70 dark:bg-neutral-950/70 border-b border-neutral-200/60 dark:border-neutral-800/60">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => { reset(); setStage('welcome'); }}
            className="flex items-center gap-2 group"
            aria-label="HireBot home"
          >
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-neutral-800 dark:text-neutral-100">HireBot</span>
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { window.history.pushState({}, '', '/admin'); setRoute('admin'); }}
              className="text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors px-3 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              Admin
            </button>
            <ThemeToggle theme={theme} onToggle={toggle} />
          </div>
        </div>
      </header>

      <main className="relative">
        {state.stage === 'welcome' && <WelcomePage onStart={startInterview} />}
        {state.stage === 'mcq' && (
          <MCQPage
            key={state.currentMCQIndex}
            currentIndex={state.currentMCQIndex}
            onAnswer={answerMCQ}
          />
        )}
        {state.stage === 'written' && (
          <WrittenPage
            key={state.currentWrittenIndex}
            currentIndex={state.currentWrittenIndex}
            onAnswer={answerWritten}
            focusLossCount={state.focusLossCount}
            onFocusLoss={addFocusLoss}
          />
        )}
        {state.stage === 'evaluating' && <EvaluatingPage />}
        {state.stage === 'result' && state.result && (
          <ResultPage result={state.result} onRetake={reset} />
        )}
      </main>
    </div>
  );
}

export default App;
