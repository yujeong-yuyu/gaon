// app/mypage/page.jsx
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { getSession } from "@/app/api/_lib/auth";
import { dbConnect } from "@/app/api/_lib/db";
import User from "@/app/api/_models/User";
import MyPage from "./MyPage";

export default async function Page() {
  // 쿠키는 getSession()에서 읽음 (쿠키명: gaonsid)
  const session = getSession(); // { uid, role, name } 또는 null

  let viewer = null;
  if (session?.uid) {
    await dbConnect();
    const u = await User.findById(session.uid)
      .select({ _id: 0, name: 1, email: 1, role: 1 })
      .lean();
    if (u) {
      viewer = {
        id: session.uid,
        name: u.name || session.name || "",
        email: u.email || "",
        role: u.role || "user",
      };
    }
  }

  return <MyPage user={viewer} />;
}
