// app/login/ResetPasswordRequestFormServer.tsx
import { sendPasswordReset } from '@/app/login/actions'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ResetPasswordFormServer() {
  return (
    <Card className="overflow-hidden p-0">
      <CardContent className="p-6 md:p-8">
        <form action={sendPasswordReset} className="flex flex-col gap-6">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold">Reset Password</h1>
            <p className="text-muted-foreground text-balance">
              Enter your email and we’ll send you a reset link.
            </p>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="reset-email">Email</Label>
            <Input id="reset-email" name="email" type="email" required />
          </div>
          <Button type="submit" className="w-full">
            Send Reset Link
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
