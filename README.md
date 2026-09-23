# HireBot: AI Interview Agent

A production-quality web app that conducts a screening interview for the role **Software Engineer — Generative AI** (products: AI Agent, ChatLLM, Abacus AI Desktop). The role evaluates three competencies: programming skills, ability to leverage AI for productivity, and high agency & ownership.

## Tech Stack

- **React** + **TypeScript** + **Vite**
- **Tailwind CSS** (dark/light theme)
- **Lucide React** for icons
- No backend required for the base version — state managed in React with `useReducer`
- Optional LLM evaluation via Netlify serverless function

## Quick Start

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## App Flow

1. **Welcome screen** — role title, job summary, what to expect (Round 1: 8 MCQs, Round 2: 3 written questions, ~20 minutes). Collects candidate name and email with validation.
2. **Round 1 — MCQs** — one question at a time, 4 options, 60-second countdown per question, auto-advance on timeout, no going back. Shows question number and progress.
3. **Round 2 — Written questions** — chat-style interface with interviewer typing animation, 4-minute countdown per question, live word count, auto-submit on timeout, minimum 20 words to submit early, paste disabled.
4. **Evaluating screen** — animated loading for ~2.5 seconds.
5. **Result screen** — overall score %, MCQ score, written score, competency radar chart, strengths/improvements feedback, pass/fail card, download report (print), and retake button.

## Scoring

- **Overall** = 40% MCQ + 60% Written
- **Pass threshold** = 70% (configurable in `config.ts`)

### Written Scoring Engine

The evaluator service has a swappable interface (`AnswerEvaluator`) with two implementations:

#### LocalRubricEvaluator (default — no API needed)

Score = weighted mix of:
- **Keyword coverage** (40%) — how many rubric keywords appear in the answer
- **Length/depth** (20%) — optimal range 80–250 words
- **Structure signals** (20%) — steps, examples, numbers/metrics
- **Specificity** (20%) — first-person action verbs, concrete tools

Penalizes very short, copy-pasted, or repeated-word answers.

#### LLMEvaluator (optional)

Calls `/api/evaluate` (Netlify Function) which sends the answer to an LLM with a strict system prompt. Enabled only when `VITE_USE_LLM=true`. Falls back to `LocalRubricEvaluator` if the request fails or the env var is not set. **No API key is ever exposed in frontend code.**

### Enabling LLM Mode

1. Set `VITE_USE_LLM=true` in your `.env` file
2. Set `LLM_API_KEY` in your Netlify environment variables
3. Deploy the Netlify function at `netlify/functions/evaluate.ts`

## Features

- **Anti-cheat**: warns when the tab loses focus (tracked and shown in report), paste disabled in written textarea
- **Persistence**: progress saved to `localStorage` so a refresh doesn't lose the session
- **Accessibility**: keyboard navigation, ARIA labels, good contrast
- **Admin dashboard** at `/admin` (password from `VITE_ADMIN_PASSWORD` env var or default in config) — shows all candidate results from localStorage
- **Dark/light theme** with system preference detection
- **Responsive** — mobile to desktop

## Project Structure

```
src/
  components/       # Reusable UI components
    CountdownTimer.tsx
    FocusLossWarning.tsx
    ProgressBar.tsx
    RadarChart.tsx
    ScoreBar.tsx
    ThemeToggle.tsx
    TypingBubble.tsx
  data/
    rubric.ts       # Rubric keyword definitions
  hooks/
    useFocusLoss.ts
    useInterviewState.ts  # Reducer + localStorage persistence
    useTheme.ts
    useTimer.ts
  pages/
    AdminPage.tsx
    EvaluatingPage.tsx
    MCQPage.tsx
    ResultPage.tsx
    WelcomePage.tsx
    WrittenPage.tsx
  services/
    evaluator.ts    # Swappable evaluator interface + implementations
  config.ts         # Pass mark, timers, weights, question banks
  types.ts          # TypeScript types
  App.tsx           # Main app component
  main.tsx          # Entry point
netlify/
  functions/
    evaluate.ts     # Serverless LLM evaluation function
```

## Configuration

All configurable values are in `src/config.ts`:

| Setting | Default | Description |
|---------|---------|-------------|
| `passThreshold` | 70 | Minimum overall score to pass |
| `mcqWeight` | 0.4 | MCQ weight in overall score |
| `writtenWeight` | 0.6 | Written weight in overall score |
| `mcqTimePerQuestion` | 60 | Seconds per MCQ |
| `writtenTimePerQuestion` | 240 | Seconds per written question (4 min) |
| `writtenMinWords` | 20 | Minimum words to submit early |
| `evaluatingDelay` | 2500 | ms on evaluating screen |
| `adminPassword` | `hirebot-admin-2024` | Default admin password (override with `VITE_ADMIN_PASSWORD`) |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_USE_LLM` | No | Set to `true` to use LLM evaluator |
| `VITE_ADMIN_PASSWORD` | No | Override default admin password |
| `LLM_API_KEY` | Only for LLM mode | OpenAI API key (server-side only) |

## Build

```bash
npm run build
npm run typecheck
```
