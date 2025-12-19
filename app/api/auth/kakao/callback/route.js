// app/api/auth/kakao/callback/route.js
import { NextResponse } from "next/server";
import { dbConnect } from "@/app/api/_lib/db";
import User from "@/app/api/_models/User";
import { signSession, setSessionCookie } from "@/app/api/_lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getOrigin(req) {
    const u = new URL(req.url);
    return `${u.protocol}//${u.host}`;
}

function unifyProfileFromKakao(kakaoUser) {
    const ka = kakaoUser?.kakao_account || {};
    const pr = ka?.profile || {};
    return {
        nickname: pr?.nickname || "",
        displayName: pr?.nickname || "",
        username: kakaoUser?.id ? String(kakaoUser.id) : "",
        email: ka?.email || "",
        picture: pr?.profile_image_url || pr?.thumbnail_image_url || "",
    };
}

export async function GET(req) {
    try {
        const url = new URL(req.url);
        const code = url.searchParams.get("code");            // ← 괄호 닫음
        const authErr = url.searchParams.get("error");
        if (authErr) {
            return NextResponse.json({ ok: false, stage: "authorize", error: authErr }, { status: 400 });
        }
        if (!code) {
            return NextResponse.json({ ok: false, stage: "authorize", error: "missing_code" }, { status: 400 });
        }

        // 서버에서 쓸 값들 (REST API 키 사용)
        const origin = getOrigin(req);
        const clientId =
            process.env.KAKAO_CLIENT_ID ||                 // 서버용 권장
            process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY ||  // 최후의 수단
            "";
        const redirectUri =
            process.env.KAKAO_REDIRECT_URI ||
            `${origin}/api/auth/kakao/callback`;
        const clientSecret = process.env.KAKAO_CLIENT_SECRET || "";

        if (!clientId) {
            return NextResponse.json(
                { ok: false, stage: "env", error: "missing_client_id", hint: "KAKAO_CLIENT_ID 또는 NEXT_PUBLIC_KAKAO_REST_API_KEY 확인" },
                { status: 500 }
            );
        }

        // 1) 토큰 교환
        const body = new URLSearchParams({
            grant_type: "authorization_code",
            client_id: clientId,
            redirect_uri: redirectUri,
            code,
        });
        if (clientSecret) body.set("client_secret", clientSecret);

        const tokenRes = await fetch("https://kauth.kakao.com/oauth/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
            body,
            cache: "no-store",
        });
        const tokenJson = await tokenRes.json();
        if (!tokenRes.ok || tokenJson.error) {
            return NextResponse.json(
                { ok: false, stage: "token", status: tokenRes.status, tokenJson, used: { redirectUri } },
                { status: 400 }
            );
        }

        const accessToken = tokenJson.access_token;
        if (!accessToken) {
            return NextResponse.json({ ok: false, stage: "token", error: "no_access_token" }, { status: 400 });
        }

        // 2) 사용자 정보
        const meRes = await fetch("https://kapi.kakao.com/v2/user/me", {
            headers: { Authorization: `Bearer ${accessToken}` },
            cache: "no-store",
        });
        const meJson = await meRes.json();
        if (!meRes.ok) {
            return NextResponse.json({ ok: false, stage: "me", status: meRes.status, meJson }, { status: 400 });
        }

        const prof = unifyProfileFromKakao(meJson);

        // 3) DB upsert
        await dbConnect();
        const doc = await User.findOneAndUpdate(
            { provider: "kakao", providerId: String(meJson.id) },
            {
                provider: "kakao",
                providerId: String(meJson.id),
                email: prof.email || undefined,
                name: prof.displayName || undefined,
                nickname: prof.nickname || undefined,
                username: prof.username || undefined,
                displayName: prof.displayName || undefined,
                avatar: prof.picture || undefined,
                role: "user",
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        // 4) JWT 발급 + 쿠키
        const token = signSession(
            {
                uid: String(doc._id),
                role: doc.role || "user",
                provider: doc.provider,
                id: doc.id || "",
                name: doc.name || "",
                email: doc.email || "",
                picture: doc.avatar || "",
                nickname: doc.nickname || "",
                displayName: doc.displayName || "",
                username: doc.username || "",
            },
            "7d"
        );
        await setSessionCookie(token, { maxAge: 60 * 60 * 24 * 7 });

        // 5) 성공 리다이렉트
        const site = process.env.NEXT_PUBLIC_SITE_URL || origin;
        return NextResponse.redirect(`${site}/mypage`);
    } catch (e) {
        console.error("[kakao-callback-error]", e);
        return NextResponse.json({ ok: false, stage: "exception", message: e?.message }, { status: 500 });
    }
}
