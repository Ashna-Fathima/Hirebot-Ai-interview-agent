import type { Handler } from '@netlify/functions';

interface EvaluateRequest {
  question: string;
  rubric: string[];
  answer: string;
}

const SYSTEM_PROMPT = `You are a strict senior engineering interviewer. Score 0-10 using the rubric. Return ONLY JSON {score, feedback}. The score should reflect how well the answer addresses the question, covers rubric keywords, shows depth and specificity, and demonstrates real-world experience. Be strict but fair. The feedback should be 1-2 sentences highlighting what was good and what was missing.`;

export const handler: Handler = async (event) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const body = JSON.parse(event.body || '{}') as EvaluateRequest;
    if (!body.question || !body.answer || !Array.isArray(body.rubric)) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Missing required fields: question, rubric, answer' }),
      };
    }

    const apiKey = process.env.LLM_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'LLM_API_KEY not configured' }),
      };
    }

    const userPrompt = `Question: ${body.question}\nRubric keywords: ${body.rubric.join(', ')}\nCandidate answer: ${body.answer}\n\nScore this answer from 0 to 10 and provide brief feedback. Return ONLY JSON in the format {"score": number, "feedback": "string"}.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      throw new Error(`LLM API returned ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    let parsed: { score: number; feedback: string };
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : content);
    } catch {
      parsed = { score: 5, feedback: 'Unable to parse LLM response. Defaulting to mid-range score.' };
    }

    if (typeof parsed.score !== 'number' || parsed.score < 0 || parsed.score > 10) {
      parsed.score = Math.max(0, Math.min(10, Number(parsed.score) || 5));
    }
    if (typeof parsed.feedback !== 'string') {
      parsed.feedback = String(parsed.feedback || 'No feedback available.');
    }

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Evaluation failed', detail: String(error) }),
    };
  }
};
