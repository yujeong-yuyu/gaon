import CommunityPostClient from "./CommunityPostClient";

export default function Page({ searchParams }) {
  const id = searchParams?.id ?? null;
  return <CommunityPostClient id={id} />;
}
