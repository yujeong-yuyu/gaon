// Community_edit/page.js
import EditClient from "./EditClient";

export const dynamic = "force-dynamic"; // 세션/동적 의존 대비 (선택이지만 권장)

export default function Page({ searchParams }) {
  const id = searchParams?.id ?? null; // /Community_edit?id=...
  return <EditClient postId={id} />;
}
