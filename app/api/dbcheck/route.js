// app/api/dbcheck/route.js
import { NextResponse } from "next/server";
import { dbConnect } from "@/app/api/_lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const conn = await dbConnect(); // MONGODB_URI 없으면 여기서 throw
        const { host, name } = conn?.connection || {};
        return NextResponse.json({ ok: true, host, name });
    } catch (e) {
        return NextResponse.json(
            { ok: false, error: String(e?.message || e) },
            { status: 500 }
        );
    }
}
