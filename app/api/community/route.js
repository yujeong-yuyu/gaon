// app/api/community/route.js
import { NextResponse } from "next/server";
import { dbConnect } from "@/app/api/_lib/db";
import Post from "@/app/api/_models/Post";
import { getSessionTokenFromCookies, verifySession } from "@/app/api/_lib/auth";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 목록 조회 (id 없이 호출)
// app/api/community/route.js

export async function GET() {
    try {
        await dbConnect();
        const raw = await Post.find()
            .sort({ createdAt: -1 })
            .populate("author", "name displayName nickname username email _id provider providerId")
            .lean();

        const pickName = (u) =>
            u?.name ||
            u?.displayName ||
            u?.nickname ||
            u?.username ||
            (u?.email ? u.email.split("@")[0] : null);

        const posts = raw.map((p) => {
            // 작성자 확인 (credentials 로그인 사용자가 제대로 uid로 처리되는지 체크)
            let authorName = pickName(p.author) || "익명";
            let authorId = p.author?._id ? String(p.author._id) : null;

            // 만약 작성자 정보가 없거나 `author`가 db ObjectId로 저장된 경우를 위해 추가
            if (!authorId && p.author && typeof p.author === "string") {
                authorId = p.author;  // 만약 일반 로그인으로만 저장됐다면(문자열 id)
                authorName = authorId; // `uid`가 바로 `authorName`이 될 수 있음
            }

            return {
                _id: String(p._id),
                title: p.title ?? "",
                content: p.content ?? "",
                images: Array.isArray(p.images) ? p.images : [],
                category: p.category ?? "",
                authorName,
                authorId,
                createdAt: p.createdAt ?? null,
                updatedAt: p.updatedAt ?? null,
            };
        });

        return NextResponse.json({ ok: true, posts }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
    }
}


// 글 작성
export async function POST(req) {
    try {
        await dbConnect();

        // 세션 확인
        const token = await getSessionTokenFromCookies();
        const payload = token ? await verifySession(token) : null;
        if (!payload?.uid) {
            return NextResponse.json({ ok: false, error: "로그인이 필요합니다." }, { status: 401 });
        }

        // multipart/form-data
        const form = await req.formData();
        const title = (form.get("title") || "").toString().trim();
        const content = (form.get("content") || "").toString().trim();
        const category = (form.get("category") || "게시판 선택").toString();

        if (!title || !content) {
            return NextResponse.json({ ok: false, error: "title, content는 필수입니다." }, { status: 400 });
        }
        if (category === "게시판 선택") {
            return NextResponse.json({ ok: false, error: "카테고리를 선택하세요." }, { status: 400 });
        }

        // 파일 저장
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

        const files = form.getAll("images");
        const saved = [];
        for (const file of files) {
            if (!(file && typeof file === "object" && "arrayBuffer" in file)) continue;
            const bytes = Buffer.from(await file.arrayBuffer());
            const safeName = `${Date.now()}-${file.name}`.replace(/[^\w.\-]/g, "_");
            fs.writeFileSync(path.join(uploadDir, safeName), bytes);
            saved.push(safeName);
        }

       const doc = await Post.create({
            author: payload.uid,        // 기존 유지(문자열 uid)
            authorId: String(payload.uid), // ✅ 추가: 비교용으로 확정 저장
            authorName: payload.displayName || payload.nickname || payload.name || payload.username || "사용자", // ✅ 추가
            title,
            content,
            category,
            images: saved,
            tags: [],
        });

        return NextResponse.json({ ok: true, postId: String(doc._id) }, { status: 200 });
    } catch (e) {
        console.error("[POST ERROR]", e);
        return NextResponse.json({ ok: false, error: e.message, stack: e.stack }, { status: 500 });
    }
}
