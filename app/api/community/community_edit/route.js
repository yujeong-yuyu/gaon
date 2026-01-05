import { NextResponse } from "next/server";
import { dbConnect } from "@/app/api/_lib/db";
import Post from "@/app/api/_models/Post";
import { getSessionTokenFromCookies, verifySession } from "@/app/api/_lib/auth";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    await dbConnect();

    // ✅ 로그인 체크
    const token = await getSessionTokenFromCookies();
    const payload = token ? await verifySession(token) : null;
    if (!payload?.uid) {
      return NextResponse.json({ ok: false, error: "로그인이 필요합니다." }, { status: 401 });
    }

    const postId = req.nextUrl.searchParams.get("id");
    if (!postId) {
      return NextResponse.json({ ok: false, error: "게시글 ID가 없습니다." }, { status: 400 });
    }

    const existing = await Post.findById(postId);
    if (!existing) {
      return NextResponse.json({ ok: false, error: "존재하지 않는 게시글입니다." }, { status: 404 });
    }

    // ✅ 작성자 체크 (authorId 우선, 없으면 author)
    const owner = existing.authorId ? String(existing.authorId) : String(existing.author);
    if (owner !== String(payload.uid)) {
      return NextResponse.json({ ok: false, error: "권한이 없습니다." }, { status: 403 });
    }

    const formData = await req.formData();
    const title = (formData.get("title") || "").toString().trim();
    const content = (formData.get("content") || "").toString().trim();
    const category = (formData.get("category") || "").toString();

    let keepExisting = [];
    const raw = formData.get("keepExisting");
    if (raw) {
      try { keepExisting = JSON.parse(raw); } catch {}
    }
    if (!Array.isArray(keepExisting)) keepExisting = [];

    if (!title || !content) {
      return NextResponse.json({ ok: false, error: "제목과 내용은 필수입니다." }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const files = formData.getAll("images");
    const newFilenames = [];
    for (const file of files) {
      if (!(file && typeof file === "object" && "arrayBuffer" in file)) continue;
      const buf = Buffer.from(await file.arrayBuffer());
      const safe = String(file.name || "image").replace(/[^a-zA-Z0-9._-]/g, "_");
      const name = `${Date.now()}_${safe}`;
      fs.writeFileSync(path.join(uploadDir, name), buf);
      newFilenames.push(name);
    }

    // 삭제 대상 계산 & 파일 삭제
    const prev = Array.isArray(existing.images) ? existing.images : [];
    const toDelete = prev.filter((f) => !keepExisting.includes(f));
    for (const fname of toDelete) {
      const p = path.join(uploadDir, fname);
      try { if (fs.existsSync(p)) fs.unlinkSync(p); } catch {}
    }

    const finalImages = [...keepExisting, ...newFilenames].slice(0, 4);

    existing.title = title;
    existing.content = content;
    existing.category = category;
    existing.images = finalImages;
    existing.updatedAt = new Date();
    await existing.save();

    // ✅ ok:true 통일
    return NextResponse.json({ ok: true, images: finalImages }, { status: 200 });
  } catch (err) {
    console.error("게시글 수정 에러:", err);
    return NextResponse.json({ ok: false, error: "서버 오류" }, { status: 500 });
  }
}
