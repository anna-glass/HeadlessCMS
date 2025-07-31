//
// stack.tsx
// anna 6/29/25
// chapter street inc, 2025 ©
// stack auth server app
//

import "server-only";

import { StackServerApp } from "@stackframe/stack";

export const stackServerApp = new StackServerApp({
  tokenStore: "nextjs-cookie",
  urls: {
    signIn: '/admin/signin',
    signUp: '/admin/signup',
    forgotPassword: '/admin/forgot-password',
  }
});
