import { createClient } from '@/lib/supabase/server';
import { NextRequest } from 'next/server';

// GET /api/interviews/[id] — fetch a single interview with analytics
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { id } = await params;

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: interview, error: interviewError } = await supabase
    .from('interviews')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (interviewError || !interview) {
    return Response.json({ error: 'Interview not found' }, { status: 404 });
  }

  const { data: analytics } = await supabase
    .from('analytics')
    .select('*')
    .eq('interview_id', id)
    .single();

  return Response.json({ interview, analytics: analytics ?? null });
}
