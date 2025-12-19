// 'use client' 금지 (서버)
import MembersClient from "./MembersClient";

export default async function Page({ searchParams }) {
  // searchParams.role 값 처리
  const isTeacher = (searchParams?.role ?? "") === "teacher";

  // MembersClient에 props 전달
  return <MembersClient isTeacher={isTeacher} />;
}