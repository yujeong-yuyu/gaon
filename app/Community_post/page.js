export const dynamic = "force-dynamic";

import { Suspense } from "react";
import CommunityPostClient from "./CommunityPostClient";

export default function Page({ searchParams }) {
  const id = searchParams?.id ?? null;
  return (
    <Suspense fallback={<div />}>
      <CommunityPostClient id={id} />
    </Suspense>
  );
}
