import { createClient } from '@/lib/supabase/server';
import { NextRequest } from 'next/server';

// GET /api/interviews — fetch all interviews for the logged-in user
export async function GET() {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('interviews')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ interviews: data });
}

// POST /api/interviews — save a completed interview session
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  const {
    job_title,
    confidence_score,
    eye_contact_score,
    filler_words_count,
    dominant_emotion,
    speaking_speed,
    speech_clarity,
    transcript,
    ai_feedback,
    duration,
    emotion_timeline,
    eye_contact_data,
    speech_metrics,
  } = body;

  // Insert interview row
  const { data: interview, error: interviewError } = await supabase
    .from('interviews')
    .insert({
      user_id: user.id,
      job_title,
      confidence_score,
      eye_contact_score,
      filler_words_count,
      dominant_emotion,
      speaking_speed,
      speech_clarity,
      transcript,
      ai_feedback,
      duration,
    })
    .select()
    .single();

  if (interviewError || !interview) {
    return Response.json({ error: interviewError?.message ?? 'Insert failed' }, { status: 500 });
  }

  // Insert analytics row
  if (emotion_timeline || eye_contact_data || speech_metrics) {
    const { error: analyticsError } = await supabase
      .from('analytics')
      .insert({
        interview_id: interview.id,
        emotion_timeline: emotion_timeline ?? [],
        eye_contact_data: eye_contact_data ?? [],
        speech_metrics: speech_metrics ?? {},
      });

    if (analyticsError) {
      console.error('Analytics insert error:', analyticsError.message);
    }
  }

  return Response.json({ interview }, { status: 201 });
}
