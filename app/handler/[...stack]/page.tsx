//
// handler.tsx
// anna 6/29/25
// chapter street inc, 2025 ©
// stack auth handler for rerouting requests
//

import { StackHandler } from "@stackframe/stack";
import { stackServerApp } from "../../stack";

export default function Handler(props: unknown) {
  return <StackHandler fullPage app={stackServerApp} routeProps={props} />;
}
