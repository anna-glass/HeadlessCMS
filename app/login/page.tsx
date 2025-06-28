'use client'

import { useEffect, useState, useTransition } from "react"
import { login, signup } from '@/app/login/actions'
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ExclamationTriangleIcon, CheckCircledIcon } from "@radix-ui/react-icons"
import { ResetPasswordDialog } from '@/app/login/ResetPasswordDialog'
import { GoogleSignInButton } from "@/app/login/GoogleSignInButton"
import { useRouter } from "next/navigation"
import { useAuth } from '@/app/hooks/use-auth'

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const { session } = useAuth()

  useEffect(() => {
    if (session) {
      router.replace('/chat')
    }
  }, [session, router])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', password)

    const action = mode === 'login' ? login : signup

    startTransition(() => {
      action(formData).then(res => {
        if (res?.error) {
          setErrorMsg(res.error)
        } else if (res && 'success' in res && res.success) {
          setSuccessMsg(res.success)
          // Clear form on successful signup
          if (mode === 'signup') {
            setEmail('')
            setPassword('')
          }
        }
      })
    })
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <div className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col text-left">
                  <h1 className="text-2xl font-bold">Hey,</h1>
                  <p className="text-muted-foreground">Welcome to Chapter Street.</p>
                </div>

                {errorMsg && (
                  <Alert variant="destructive">
                    <ExclamationTriangleIcon className="h-4 w-4" />
                    <AlertDescription>{errorMsg}</AlertDescription>
                  </Alert>
                )}

                {successMsg && (
                  <Alert>
                    <CheckCircledIcon className="h-4 w-4" />
                    <AlertDescription>{successMsg}</AlertDescription>
                  </Alert>
                )}

                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? (mode === 'login' ? "Logging in…" : "Signing up…") : (mode === 'login' ? "Login" : "Sign up")}
                </Button>
              </form>

              <div className="text-left mt-2">
                <button
                  onClick={() => setResetPasswordDialogOpen(true)}
                  className="text-xs hover:underline"
                  type="button"
                >
                  Forgot your password?
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t mt-6">
                  <span className="bg-card text-muted-foreground relative z-10 px-2">
                    Or continue with
                  </span>
                </div>
                <GoogleSignInButton />
              </div>

              <div className="text-left text-sm mt-4">
                <button
                  onClick={() => {
                    setMode(mode === 'login' ? 'signup' : 'login')
                    setErrorMsg('')
                    setSuccessMsg('')
                  }}
                  className="ml-auto text-xs hover:underline"
                  type="button"
                >
                  {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                </button>
              </div>
            </div>

            <div className="bg-muted relative hidden md:block">
              <img
                src="/login.png"
                alt="Image"
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              />
            </div>
          </CardContent>
        </Card>

        <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
          By clicking continue, you agree to our <a href="https://www.chapterstreet.co/terms">Terms of Service</a>{" "}
          and <a href="https://www.chapterstreet.co/privacy">Privacy Policy</a>.
        </div>

        <ResetPasswordDialog open={resetPasswordDialogOpen} onOpenChange={setResetPasswordDialogOpen} />
    </div>
  )
}
