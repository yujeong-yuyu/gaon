// 서버 컴포넌트: 'use client' 쓰지 마세요
import PostView from "./Community_post";

export default function Page({ searchParams }) {
  const id = searchParams?.id ?? null; // /Community_post?id=...
  return <PostView id={id} />;
}
