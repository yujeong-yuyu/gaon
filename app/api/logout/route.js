// app/api/auth/logout/route.js
import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/app/api/_lib/auth";

// GET 또는 POST 둘 다 가능. 보안상 POST 권장.
export async function POST() {
    clearSessionCookie();
    return NextResponse.json({ ok: true, message: "로그아웃 성공" });
}

// 호환용: GET 요청도 처리하고 싶다면 추가
export async function GET() {
    clearSessionCookie();
    return NextResponse.json({ ok: true, message: "로그아웃 성공" });
}
