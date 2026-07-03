import { NextRequest } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  // Auth guard
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { transcript, metrics, jobTitle } = body;

  if (!transcript || transcript.trim().length === 0) {
    return Response.json({ error: 'Transcript is required' }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json({ error: 'Gemini API key not configured' }, { status: 500 });
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `You are an expert interview coach. Analyze this interview response and provide structured, actionable feedback.

${jobTitle ? `Job Title Being Interviewed For: ${jobTitle}` : ''}

Interview Metrics:
- Confidence Score: ${metrics?.confidenceScore ?? 'N/A'}/100
- Eye Contact Score: ${metrics?.eyeContactScore ?? 'N/A'}/100
- Speech Clarity: ${metrics?.speechClarity ?? 'N/A'}/100
- Speaking Speed: ${metrics?.wpm ?? 'N/A'} WPM (ideal: 120-160)
- Filler Words Used: ${metrics?.fillerCount ?? 0}
- Dominant Emotion: ${metrics?.dominantEmotion ?? 'N/A'}

Transcript:
"${transcript}"

Provide feedback as a JSON object with exactly this structure:
{
  "overallScore": <number 0-100>,
  "summary": "<2-3 sentence overall assessment>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "improvements": ["<improvement 1>", "<improvement 2>", "<improvement 3>"],
  "contentFeedback": "<specific feedback about the content and structure of the answer>",
  "deliveryFeedback": "<specific feedback about speaking style, pace, clarity>",
  "bodyLanguageFeedback": "<specific feedback about eye contact and presence>",
  "nextSteps": ["<action 1>", "<action 2>"]
}

Respond with ONLY the JSON object, no markdown, no extra text.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Parse JSON — handle potential code fences
    let parsed: Record<string, unknown>;
    try {
      const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch {
      // Return raw text as summary if JSON parsing fails
      parsed = {
        overallScore: metrics?.confidenceScore ?? 50,
        summary: text,
        strengths: [],
        improvements: [],
        contentFeedback: '',
        deliveryFeedback: '',
        bodyLanguageFeedback: '',
        nextSteps: [],
      };
    }

    return Response.json({ feedback: parsed });
  } catch (err) {
    console.error('Gemini API error:', err);
    return Response.json({ error: 'Failed to generate feedback' }, { status: 500 });
  }
}
