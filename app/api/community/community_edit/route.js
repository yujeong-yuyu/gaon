import { NextResponse } from "next/server";
import { dbConnect } from "@/app/api/_lib/db";
import Post from "@/app/api/_models/Post";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
    try {
        await dbConnect();

        const postId = req.nextUrl.searchParams.get("id");
        if (!postId) return NextResponse.json({ error: "게시글 ID가 없습니다." }, { status: 400 });

        const existing = await Post.findById(postId);
        if (!existing) return NextResponse.json({ error: "존재하지 않는 게시글입니다." }, { status: 404 });

        const formData = await req.formData();
        const title = formData.get("title");
        const content = formData.get("content");
        const category = formData.get("category") || "";

        let keepExisting = [];
        const raw = formData.get("keepExisting");
        if (raw) { try { keepExisting = JSON.parse(raw); } catch { } }
        if (!Array.isArray(keepExisting)) keepExisting = [];

        if (!title || !content)
            return NextResponse.json({ error: "제목과 내용은 필수입니다." }, { status: 400 });

        const uploadDir = path.join(process.cwd(), "public", "uploads");
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

        const files = formData.getAll("images");
        const newFilenames = [];
        for (const file of files) {
            if (!file) continue;
            const buf = Buffer.from(await file.arrayBuffer());
            const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
            const name = `${Date.now()}_${safe}`;
            fs.writeFileSync(path.join(uploadDir, name), buf);
            newFilenames.push(name);
        }

        // 삭제 대상 계산 & 파일 삭제
        const prev = Array.isArray(existing.images) ? existing.images : [];
        const toDelete = prev.filter((f) => !keepExisting.includes(f));
        for (const fname of toDelete) {
            const p = path.join(uploadDir, fname);
            try { if (fs.existsSync(p)) fs.unlinkSync(p); } catch { }
        }

        const finalImages = [...keepExisting, ...newFilenames].slice(0, 4);

        existing.title = title;
        existing.content = content;
        existing.category = category;
        existing.images = finalImages;
        existing.updatedAt = new Date();
        await existing.save();

        return NextResponse.json({ success: true, images: finalImages });
    } catch (err) {
        console.error("게시글 수정 에러:", err);
        return NextResponse.json({ error: "서버 오류" }, { status: 500 });
    }
}
