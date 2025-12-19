// app/api/session/route.js
import { NextResponse } from "next/server";
import { getSessionTokenFromCookies, verifySession } from "@/app/api/_lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const token = await getSessionTokenFromCookies();
    if (!token) return NextResponse.json({ ok: false, user: null }, { status: 200 });

    const payload = await verifySession(token);
    if (!payload) return NextResponse.json({ ok: false, user: null }, { status: 200 });

    // 프론트에서 쓰기 편한 공통 스키마
    const user = {
      uid: payload.uid,              // Mongo ObjectId 문자열
      provider: payload.provider,    // "credentials" | "kakao" | "google" ...
      id: payload.id || "",          // 일반 로그인 id
      name: payload.name || "",
      email: payload.email || "",
      picture: payload.picture || null,
      nickname: payload.nickname || "",
      displayName: payload.displayName || "",
      username: payload.username || "",
      role: payload.role || "user",
    };

    return NextResponse.json({ ok: true, user }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ ok: false, user: null, error: String(e) }, { status: 200 });
  }
}
