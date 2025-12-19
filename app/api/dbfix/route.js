// app/api/dbfix/route.js
import { NextResponse } from "next/server";
import { dbConnect } from "@/app/api/_lib/db";
import Post from "@/app/api/_models/Post";

// 간단한 보호(임시): ?key=YOUR_SECRET 로 접근
const SECRET = process.env.DB_FIX_SECRET || "dev";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req) {
    const url = new URL(req.url);
    const key = url.searchParams.get("key");
    if (key !== SECRET) {
        return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
    }

    try {
        await dbConnect();

        // 현재 인덱스 확인
        const before = await Post.collection.getIndexes();

        // board 컬렉션 인덱스 전체 드랍(_id_ 제외)
        // ※ 혹시 다른 커스텀 인덱스가 있었으면 따로 다시 선언 필요
        await Post.collection.dropIndexes();

        // 스키마대로 인덱스 재생성 (title/content 텍스트, tags/createdAt 일반)
        await Post.syncIndexes();

        const after = await Post.collection.getIndexes();

        return NextResponse.json({
            ok: true,
            dropped: Object.keys(before),
            created: Object.keys(after),
        });
    } catch (e) {
        return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
    }
}
