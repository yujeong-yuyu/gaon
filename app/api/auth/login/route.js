// app/api/auth/login/route.js
import { dbConnect } from "@/app/api/_lib/db";
import User from "@/app/api/_models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { signSession, setSessionCookie } from "@/app/api/_lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req) {
  await dbConnect();
  const { id, password, remember } = await req.json();

  const u = await User.findOne({ id, provider: "credentials" });
  if (!u) return NextResponse.json({ error: "not found" }, { status: 404 });

  const ok = await bcrypt.compare(password, u.passwordHash || "");
  if (!ok) return NextResponse.json({ error: "wrong" }, { status: 401 });

  const expiresIn = remember ? "30d" : "7d";

  // ✅ 표시용 필드들 미리 계산 (fallback)
  const emailLocal = u.email ? u.email.split("@")[0] : "";
  const nickname = u.nickname || u.name || u.username || emailLocal || u.id || "";
  const displayName = u.displayName || nickname;
  const username = u.username || u.id || emailLocal || "";

  const token = signSession(
    {
      uid: String(u._id),
      role: u.role || "user",
      // 기존
      id: u.id,
      name: u.name || "",
      email: u.email || "",
      provider: u.provider || "credentials",
      picture: u.picture || u.avatar || null,
      // ✅ 추가 (프론트가 찾는 키들)
      nickname,
      displayName,
      username,
    },
    expiresIn
  );

  await setSessionCookie(token, {
    maxAge: remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7,
  });

  return NextResponse.json({ ok: true }, { status: 200 });
}