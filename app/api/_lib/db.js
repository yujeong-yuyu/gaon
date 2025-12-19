// app/api/_lib/db.js
import mongoose from "mongoose";

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

export async function dbConnect() {
    if (cached.conn) return cached.conn; // 1. 이미 연결된 객체가 있으면 즉시 반환
    if (!cached.promise) {              // 2. 연결 진행 중인 Promise가 없으면 새로 생성
        const uri = process.env.MONGODB_URI;
        if (!uri) throw new Error("❌ MONGODB_URI is not defined");

        cached.promise = mongoose.connect(uri, {
            dbName: "gaon",
        }).then((m) => m);
    }
    cached.conn = await cached.promise; // 3. Promise가 완료될 때까지 기다리고 연결 객체 저장
    return cached.conn;
}