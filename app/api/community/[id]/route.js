import { NextResponse } from "next/server";
import { dbConnect } from "@/app/api/_lib/db";
import Post from "@/app/api/_models/Post";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req, { params }) {
  try {
    const id = params?.id;
    if (!id) return NextResponse.json({ ok: false, error: "id 필요" }, { status: 400 });
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ ok: false, error: "유효하지 않은 id" }, { status: 400 });
    }

    await dbConnect();

    const post = await Post.findById(id)
      .populate("author", "name displayName nickname username email _id")
      .lean();

    if (!post) return NextResponse.json({ ok: false, error: "게시글 없음" }, { status: 404 });

    const authorName =
      post.author?.displayName ||
      post.author?.nickname ||
      post.author?.name ||
      post.author?.username ||
      post.authorName ||
      "익명";

    const authorId =
      post.author?._id ? String(post.author._id) :
      post.author ? String(post.author) :
      post.authorId ? String(post.authorId) :
      null;

    return NextResponse.json({
      ok: true,
      post: {
        _id: String(post._id),
        title: post.title ?? "",
        content: post.content ?? "",
        images: Array.isArray(post.images) ? post.images : [],
        category: post.category ?? "",
        authorName,
        authorId,
        createdAt: post.createdAt ?? null,
      },
    });
  } catch (e) {
    console.error("GET /api/community/[id] error:", e);
    return NextResponse.json({ ok: false, error: e.message || "서버 오류" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const id = params?.id;
    if (!id) return NextResponse.json({ ok: false, error: "id 필요" }, { status: 400 });
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ ok: false, error: "유효하지 않은 id" }, { status: 400 });
    }

    const loginUserId = req.headers.get("x-user-id") || "";

    await dbConnect();
    const doc = await Post.findById(id).lean();
    if (!doc) return NextResponse.json({ ok: false, error: "존재하지 않는 게시글" }, { status: 404 });

    if (!loginUserId || String(doc.author) !== String(loginUserId)) {
      return NextResponse.json({ ok: false, error: "권한이 없습니다." }, { status: 403 });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    for (const fname of Array.isArray(doc.images) ? doc.images : []) {
      const p = path.join(uploadDir, fname);
      try { if (fs.existsSync(p)) fs.unlinkSync(p); } catch {}
    }

    await Post.deleteOne({ _id: id });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("DELETE /api/community/[id] error:", e);
    return NextResponse.json({ ok: false, error: e.message || "서버 오류" }, { status: 500 });
  }
}
