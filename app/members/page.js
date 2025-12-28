import { Suspense } from "react";
import Members from "./MembersClient";

export default function Page() {
  return (
    <Suspense fallback={<div />}>
      <Members />
    </Suspense>
  );
}
