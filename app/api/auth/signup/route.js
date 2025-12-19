//app/api/auth/signup/route.js

import { dbConnect } from "@/app/api/_lib/db";
import User from "@/app/api/_models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
    await dbConnect();
    const { email, password, name } = await req.json();
    if (!email || !password) return Response.json({ error: "invalid" }, { status: 400 });
    const exists = await User.findOne({ email, provider: "credentials" });
    if (exists) return Response.json({ error: "exists" }, { status: 409 });
    const passwordHash = await bcrypt.hash(password, 10);
    const u = await User.create({ provider: "credentials", email, passwordHash, name });
    return Response.json({ ok: true, id: u._id });
}
