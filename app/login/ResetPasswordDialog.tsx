// app/login/ResetPasswordRequestDialog.tsx
'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { sendPasswordReset } from '@/app/login/actions'
import { useRef } from "react"

export function ResetPasswordDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm p-0">
        <Card className="shadow-none border-none">
          <CardContent className="p-6">
            <form
              ref={formRef}
              action={async (formData) => {
                await sendPasswordReset(formData)
                onOpenChange(false)
              }}
              className="flex flex-col gap-6"
            >
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Reset Password</DialogTitle>
              </DialogHeader>
              <p className="text-muted-foreground text-balance text-center">
                Enter your email and we’ll send you a reset link.
              </p>
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
      </DialogContent>
    </Dialog>
  )
}
