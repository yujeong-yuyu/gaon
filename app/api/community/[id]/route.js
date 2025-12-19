// app/api/community/[id]/route.js

import { NextResponse } from "next/server";
import { dbConnect } from "@/app/api/_lib/db";
import Post from "@/app/api/_models/Post";
import User from "@/app/api/_models/User";
import mongoose from "mongoose"; // ✅ ObjectId 검사용

import fs from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req, context) {
    try {
        const { params } = context;
        const id = params?.id;  // params를 비동기적으로 처리해야 함
        if (!id) return NextResponse.json({ error: "id 필요" }, { status: 400 });

        await dbConnect();
        const post = await Post.findById(id)
            .populate("author", "name displayName nickname username email _id") // author 필드 확인
            .lean();

        console.log("Fetched Post:", post); // 반환된 게시글 확인

        if (!post) return NextResponse.json({ error: "게시글 없음" }, { status: 404 });

        const authorName =
            post.author?.displayName ||
            post.author?.nickname ||
            post.author?.name ||
            post.author?.username ||
            "익명";  // author가 비어 있으면 "익명"
        console.log("Author Name:", authorName); // authorName을 콘솔로 확인

        return NextResponse.json({
            ok: true,
            post: {
                _id: String(post._id),
                title: post.title,
                content: post.content,
                images: Array.isArray(post.images) ? post.images : [],
                category: post.category || "",
                authorName,  // 작성자 이름
                authorId: post.author?._id ? String(post.author._id) : null,
                createdAt: post.createdAt,
            },
        });
    } catch (e) {
        console.error("GET /api/community/[id] error:", e);
        return NextResponse.json({
            error: e.message || "서버 오류",
            stack: process.env.NODE_ENV !== "production" ? e.stack : undefined,
        }, { status: 500 });
    }
}



export async function DELETE(req, context) {
    try {
        const { params } = await context;
        const id = params?.id;
        if (!id) return NextResponse.json({ error: "id 필요" }, { status: 400 });
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "유효하지 않은 id" }, { status: 400 });
        }

        // 클라에서 보낸 로그인 사용자 id (ObjectId 문자열) 헤더로 받기
        const loginUserId = req.headers.get("x-user-id") || "";

        await dbConnect();
        const doc = await Post.findById(id).lean();
        if (!doc) return NextResponse.json({ error: "존재하지 않는 게시글" }, { status: 404 });

        // 권한 체크 (서버에서도 반드시 검사)
        if (!loginUserId || String(doc.author) !== String(loginUserId)) {
            return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
        }

        // 이미지 파일 삭제
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        for (const fname of Array.isArray(doc.images) ? doc.images : []) {
            const p = path.join(uploadDir, fname);
            try { if (fs.existsSync(p)) fs.unlinkSync(p); } catch (e) {
                console.warn("파일 삭제 실패:", fname, e?.message);
            }
        }

        await Post.deleteOne({ _id: id });
        return NextResponse.json({ success: true });
    } catch (e) {
        console.error("DELETE /api/community/[id] error:", e);
        return NextResponse.json({ error: e.message || "서버 오류" }, { status: 500 });
    }
}
