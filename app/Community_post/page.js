import CommunityPostClient from "./Community_post";

export default function Page({ searchParams }) {
  const id = searchParams?.id ?? null; // /Community_post?id=...
  return <CommunityPostClient id={id} />;
}
