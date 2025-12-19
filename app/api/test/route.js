export async function GET() {
    return Response.json({
        site: process.env.NEXT_PUBLIC_SITE_URL,
        kakao: !!process.env.KAKAO_REST_API_KEY,
        google: !!process.env.GOOGLE_CLIENT_ID,
    });
}
