import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// 비밀번호 재설정 메일의 링크가 도착하는 주소. 임시 세션을 만든 뒤 새 비밀번호 화면으로 보낸다.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}/reset-password`);
  }
  return NextResponse.redirect(`${origin}/forgot-password?error=expired`);
}
