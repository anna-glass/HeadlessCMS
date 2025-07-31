//
// signup.tsx
// anna 6/29/25
// chapter street inc, 2025 ©
// signup page (stack auth handles this)
//

import { SignUp } from "@stackframe/stack";
import { Card, CardContent } from "@/components/ui/card";

export default function SignUpPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <Card className="overflow-hidden p-0 max-w-screen-md">
        <CardContent className="grid p-0 md:grid-cols-2">
            <div className="p-6 md:p-8">
                <SignUp />
            </div>
            <img
                src="/login.png"
                alt="Image"
                className="dark:brightness-[0.2] dark:grayscale h-full w-full object-cover"
            />
        </CardContent>
        </Card>
        
    </div>
  );
}
