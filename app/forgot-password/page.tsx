//
// forgot-password.tsx
// anna 6/29/25
// chapter street inc, 2025 ©
// forgot password page (stack auth handles this)
//

'use client';
import { ForgotPassword } from "@stackframe/stack";

export default function ForgotPasswordPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <ForgotPassword />
    </div>
  );
}
