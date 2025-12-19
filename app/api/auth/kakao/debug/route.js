// app/api/auth/kakao/debug/route.js
export async function GET(req) {
    const u = new URL(req.url);
    const origin = `${u.protocol}//${u.host}`;
    return Response.json({
        KAKAO_CLIENT_ID: !!process.env.KAKAO_CLIENT_ID,
        NEXT_PUBLIC_KAKAO_REST_API_KEY: !!process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY,
        KAKAO_REDIRECT_URI: process.env.KAKAO_REDIRECT_URI || null,
        computedRedirect: `${origin}/api/auth/callback/kakao`,
        KAKAO_CLIENT_SECRET: process.env.KAKAO_CLIENT_SECRET ? "(set)" : "(empty)",
        hint: "client_id는 REST API Key를 사용하세요.",
    });
}
