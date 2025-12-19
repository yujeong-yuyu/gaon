// <-- 'use client' 쓰지 마! (서버 컴포넌트)
import { Suspense } from "react";
import CommunityList from "./CommunityList";

export default function Page() {
  return (
    <Suspense fallback={<div style={{ padding: 20 }}>Loading…</div>}>
      <CommunityList />
    </Suspense>
  );
}