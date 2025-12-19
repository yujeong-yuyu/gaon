// app/api/auth/google/callback/route.js
import { NextResponse } from "next/server";
import { setSessionCookie, signSession } from "@/app/api/_lib/auth";
import { dbConnect } from "@/app/api/_lib/db";
import { upsertSocialUser } from "@/app/api/_lib/user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getOrigin(req) {
    const u = new URL(req.url);
    return `${u.protocol}//${u.host}`;
}

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const code = searchParams.get("code");
        if (!code) {
            return NextResponse.json({ ok: false, stage: "authorize", error: "missing_code" }, { status: 400 });
        }

        // ✅ 서버 전용 우선, 없으면 공개키 백업 (문제 상황에서도 최대한 진행)
        const origin = getOrigin(req);
        const clientId =
            process.env.GOOGLE_CLIENT_ID ||
            process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""; // 최후의 수단
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
        const redirectUri =
            process.env.GOOGLE_REDIRECT_URI ||
            `${origin}/api/auth/google/callback`;

        if (!clientId || !redirectUri) {
            return NextResponse.json(
                { ok: false, stage: "config", error: "missing_client_or_redirect", used: { clientId: !!clientId, redirectUri } },
                { status: 500 }
            );
        }

        // 1) 토큰 교환
        const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                grant_type: "authorization_code",
            }),
            cache: "no-store",
        });
        const tokenData = await tokenRes.json();
        if (!tokenRes.ok || tokenData.error) {
            return NextResponse.json(
                { ok: false, stage: "token", status: tokenRes.status, tokenData, used: { redirectUri } },
                { status: 400 }
            );
        }

        const accessToken = tokenData.access_token;
        if (!accessToken) {
            return NextResponse.json({ ok: false, stage: "token", error: "no_access_token" }, { status: 400 });
        }

        // 2) 사용자 정보
        const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
            headers: { Authorization: `Bearer ${accessToken}` },
            cache: "no-store",
        });
        const u = await userRes.json();
        if (!userRes.ok) {
            return NextResponse.json({ ok: false, stage: "userinfo", status: userRes.status, u }, { status: 400 });
        }

        const providerId = String(u.id);
        const email = u.email || "";
        const name = u.name || u.given_name || "";
        const avatar = u.picture || "";

        // ✅ Mongo 연결 (이거 없어서 타임아웃 났음)
        await dbConnect();

        // 3) upsert (필요시 displayName/username도 저장)
        const user = await upsertSocialUser("google", {
            providerId,
            email,
            name,
            avatar,
            // 선택: 닉네임류
            nickname: u.name || "",
            displayName: u.name || "",
            username: u.email ? u.email.split("@")[0] : "",
        });

        // 4) JWT 발급 + 쿠키 굽기 (⚠️ token 문자열을 넘겨야 함)
        const token = signSession({
            uid: String(user._id),
            role: user.role || "user",
            name: user.name || "",
            provider: "google",
            email: user.email || "",
            picture: user.avatar || "",
            nickname: user.nickname || "",
            displayName: user.displayName || "",
            username: user.username || "",
        }, "7d");

        await setSessionCookie(token, { maxAge: 60 * 60 * 24 * 7 });

        // 5) 성공 리다이렉트
        const site =
            process.env.NEXT_PUBLIC_SITE_URL ||
            origin;
        return NextResponse.redirect(`${site}/mypage`);
    } catch (err) {
        console.error("[google-callback-error]", err);
        return NextResponse.json({ ok: false, stage: "exception", message: err?.message }, { status: 500 });
    }
}
