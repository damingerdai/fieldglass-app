import { NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET(request: Request) {
  // 1. 安全校验
  const authHeader = request.headers.get('authorization');
  console.log(process.env.NODE_ENV);
  if (process.env.NODE_ENV !== 'development' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: "Missing configuration" }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { data, error } = await supabase.rpc('handle_auto_approve');
    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: `Successfully auto-approved ${data?.length || 0} requests.`,
      processed_count: data?.length || 0,
      details: data
    }, { status: 200 });

  } catch (error: any) {
    console.error("Auto-Approve Cron Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function fetchAllUserIds(supabase: SupabaseClient<any, "public", "public", any, any>) {
  let allUserIds: string[] = [];
  let page = 1;
  const perPage = 1000; // 每页最大数量

  while (true) {
    const { data: { users }, error } = await supabase.auth.admin.listUsers({
      page: page,
      perPage: perPage,
    });

    if (error) throw error;
    if (users.length === 0) break;

    // 提取 ID
    const ids = users.map(user => user.id);
    allUserIds = [...allUserIds, ...ids];

    // 如果返回的用户数少于每页限额，说明已经拿完了
    if (users.length < perPage) break;
    page++;
  }

  return allUserIds;
}
