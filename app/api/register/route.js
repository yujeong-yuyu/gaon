// app/api/register/route.js
import { dbConnect } from "@/app/api/_lib/db";
import User from "@/app/api/_models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
    try {
        await dbConnect();

        const { id, password, name, email } = await req.json();

        if (!id || !password) {
            return NextResponse.json({ ok: false, error: "INVALID_INPUT" }, { status: 400 });
        }

        const exists = await User.findOne({ provider: "credentials", id });
        if (exists) {
            return NextResponse.json({ ok: false, error: "EXISTS" }, { status: 409 });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        await User.create({
            provider: "credentials",
            providerId: id,
            id,                 // ← credentials는 id 필수
            passwordHash,       // ← 필수
            name: name || "",
            email: email || "", // ← 폼에서 받은 이메일 저장
            role: "user",
        });

        return NextResponse.json({ ok: true }, { status: 201 });
    } catch (e) {
        // 몽고 유니크/검증 에러 포함, 항상 JSON으로
        return NextResponse.json({ ok: false, error: e?.message || "REGISTER_FAILED" }, { status: 500 });
    }
}
