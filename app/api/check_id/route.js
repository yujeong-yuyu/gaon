// app/api/check_id/route.js
import { NextResponse } from "next/server";
import { dbConnect } from "@/app/api/_lib/db";
import User from "@/app/api/_models/User";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        // ✅ uid와 id 둘 다 허용 (프론트 호환)
        const id = searchParams.get("uid") || searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { ok: false, error: "id (or uid) is required" },
                { status: 400 }
            );
        }

        const exists = await User.findOne({ provider: "credentials", id }).lean();

        // 프론트가 기대하는 형태로 메시지 포함
        if (exists) {
            return NextResponse.json(
                { ok: true, exists: true, message: "이미 사용 중인 아이디입니다." },
                { status: 200 }
            );
        }
        return NextResponse.json(
            { ok: true, exists: false, message: "사용 가능한 아이디입니다." },
            { status: 200 }
        );
    } catch (err) {
        console.error("[check_id] error:", err);
        return NextResponse.json(
            { ok: false, error: err.message || "INTERNAL_ERROR" },
            { status: 500 }
        );
    }
}
