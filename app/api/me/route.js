// app/api/me/route.ts
import { NextResponse } from "next/server";
import { getSessionTokenFromCookies, verifySession } from "@/app/api/_lib/auth";

export async function GET() {
    const token = await getSessionTokenFromCookies();
    if (!token) return NextResponse.json({ ok: false }, { status: 401 });

    const payload = await verifySession(token);
    if (!payload) return NextResponse.json({ ok: false }, { status: 401 });

    const user = {
        uid: payload.uid,
        role: payload.role,
        name: payload.name,
        id: payload.id,
        email: payload.email,
        provider: payload.provider,
        picture: payload.picture ?? null,

        // 🔽🔽🔽 이 3줄 추가
        nickname: payload.nickname ?? null,
        displayName: payload.displayName ?? null,
        username: payload.username ?? null,
    };

    return NextResponse.json({ ok: true, user }, { status: 200 });
}
