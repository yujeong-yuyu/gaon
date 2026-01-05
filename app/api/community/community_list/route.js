// app/api/community/community_list/route.js
import { NextResponse } from "next/server";
import { dbConnect } from "@/app/api/_lib/db";
import Post from "@/app/api/_models/Post";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);

        // 파라미터 파싱
        const qRaw = searchParams.get("q") || "";
        const categoryRaw = searchParams.get("category") || "";
        const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
        const limitIn = parseInt(searchParams.get("limit") || "10", 10);
        const limit = Math.max(1, Math.min(50, Number.isFinite(limitIn) ? limitIn : 10));
        const sortRaw = (searchParams.get("sort") || "recent").toLowerCase(); // popular | recent
        const skip = (page - 1) * limit;

        // 필터 구성
        const filter = {};

        // 카테고리: 공백/대소문자 변형도 안전하게 매칭
        const category = categoryRaw.trim();
        if (category) {
            const esc = category.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            filter.category = { $regex: `^\\s*${esc}\\s*$`, $options: "i" };
        }

        // 검색어: text index 있으면 $text, 없으면 regex fallback
        const q = qRaw.trim();
        if (q) {
            try {
                // text 인덱스가 없는 경우 error가 날 수 있음 → catch로 폴백
                filter.$text = { $search: q };
            } catch {
                // 폴백: title/content 부분일치
                delete filter.$text;
                const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
                filter.$or = [{ title: rx }, { content: rx }];
            }
        }

        // 정렬
        const sort =
            sortRaw === "popular"
                ? { likes: -1, createdAt: -1 }
                : { createdAt: -1 };

        // 조회
        const [posts, total] = await Promise.all([
            Post.find(filter).sort(sort).skip(skip).limit(limit).lean(),
            Post.countDocuments(filter),
        ]);

        const normalized = (posts || []).map((p) => ({
            ...p,
            _id: String(p._id),
            authorId: p.author ? String(p.author) : null, // Post에 author가 있다면
            createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : null,
            updatedAt: p.updatedAt ? new Date(p.updatedAt).toISOString() : null,
        }));

        return NextResponse.json({ ok: true, posts: normalized, total }, { status: 200 });

    } catch (e) {
        return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
    }
}
