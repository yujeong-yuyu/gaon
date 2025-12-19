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

    const formData = await req.formData();
    const title = formData.get("title");
    const content = formData.get("content");
    const category = formData.get("category") || "";
    const authorId = formData.get("authorId") || null;

    if (!title || !content)
      return NextResponse.json({ error: "제목/내용은 필수" }, { status: 400 });

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const files = formData.getAll("images");
    const names = [];
    for (const file of files) {
      if (!file) continue;
      const buf = Buffer.from(await file.arrayBuffer());
      const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const name = `${Date.now()}_${safe}`;
      fs.writeFileSync(path.join(uploadDir, name), buf);
      names.push(name);
    }

    const doc = await Post.create({
      title, content, category,
      images: names.slice(0, 4),
      author: authorId,
    });

    return NextResponse.json({ ok: true, id: String(doc._id) });
  } catch (e) {
    console.error("community_write error:", e);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
