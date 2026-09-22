import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET(request: Request) {
  // 1. 安全校验
  const authHeader = request.headers.get('authorization');
  console.log(process.env.NODE_ENV);
  if (
    process.env.NODE_ENV !== 'development' &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: 'Missing configuration' },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { data, error } = await supabase.rpc('handle_auto_approve');
    if (error) {
      throw error;
    }

    return NextResponse.json(
      {
        success: true,
        message: `Successfully auto-approved ${data?.length || 0} requests.`,
        processed_count: data?.length || 0,
        details: data
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Auto-Approve Cron Error:', error);
    return NextResponse.json(
      {
        error:
          typeof error === 'object' &&
          error !== null &&
          'message' in error &&
          typeof error.message === 'string'
            ? error.message
            : 'Unexpected cron error'
      },
      { status: 500 }
    );
  }
}
