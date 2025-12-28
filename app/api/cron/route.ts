import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// 注意：在 Vercel 环境中，通常使用 SUPABASE_SERVICE_ROLE_KEY 处理管理任务
// 或者确保 NEXT_PUBLIC_SUPABASE_ANON_KEY 已在 Vercel Dashboard 中配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function GET(request: Request) {
  // 安全校验（防止外部恶意调用）
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: "缺少必要的环境变量" }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const operations: any[] = [];
  let successCount = 0;

  try {
    // --- 方法1: Storage API ---
    const { data: storageData, error: storageError } = await supabase.storage.listBuckets();
    if (storageError) {
      operations.push({ method: "Storage API check", success: false, error: storageError.message });
    } else {
      operations.push({ method: "Storage API check", success: true });
      successCount++;
    }

    // --- 方法2: Keep-alive query ---
    const { error: queryError } = await supabase
      .from(`_keep_alive_test_${Date.now()}`)
      .select('*')
      .limit(1);
    
    // 预期错误 42P01 (表不存在) 说明连接到了数据库
    if (queryError && (queryError.code === '42P01' || queryError.code === 'PGRST116')) {
      operations.push({ method: "Keep-alive query", success: true });
      successCount++;
    } else if (!queryError) {
      operations.push({ method: "Keep-alive query", success: true });
      successCount++;
    } else {
      operations.push({ method: "Keep-alive query", success: false, error: queryError.message });
    }

    // --- 方法3: Auth API ---
    const { error: authError } = await supabase.auth.getUser();
    if (authError && authError.message !== 'Auth session missing!') {
      operations.push({ method: "Auth API check", success: false, error: authError.message });
    } else {
      operations.push({ method: "Auth API check", success: true });
      successCount++;
    }

    return NextResponse.json({
      message: "保活任务执行完成",
      successCount,
      totalOperations: operations.length,
      details: operations
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}