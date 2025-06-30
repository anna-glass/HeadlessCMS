'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useStackApp } from "@stackframe/stack"
import Link from "next/link";

export default function SignIn({
  className
}: React.ComponentProps<"div">) {
    const app = useStackApp();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const result = await app.signInWithCredential({
            email: formData.get('email') as string,
            password: formData.get('password') as string,
        });
      
        if (result.status === "error") {
            if (result.error.message.includes("wrong")) {
                console.log("Wrong email or password");
            }
        }
    }

    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6"></div>
        <div className={cn("flex flex-col gap-6", className)}>
            <Card className="overflow-hidden p-0">
            <CardContent className="grid p-0 md:grid-cols-2">
                <form className="p-6 md:p-8" onSubmit={handleSubmit} method="POST">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">Welcome back</h1>
                    <p className="text-muted-foreground text-balance">
                        Login to your Chapter Street account
                    </p>
                    </div>
                    <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        required
                    />
                    </div>
                    <div className="grid gap-3">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link href="/forgot-password" className="underline underline-offset-4 text-xs">
                            Forgot your password?
                        </Link>
                    </div>
                    <Input id="password" type="password" name="password" required />
                    </div>
                    <Button type="submit" className="w-full">
                    Login
                    </Button>
                    <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                    <span className="bg-card text-muted-foreground relative z-10 px-2">
                        Or continue with
                    </span>
                    </div>
                    <div className="gap-4">
                    <Button variant="defaultOutline" type="button" className="w-full" onClick={async () => {
                        await app.signInWithOAuth('google');
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path
                            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                            fill="currentColor"
                        />
                        </svg>
                        <span className="sr-only">Login with Google</span>
                    </Button>
                    </div>
                    <div className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="underline underline-offset-4">
                        Sign up
                    </Link>
                    </div>
                </div>
                </form>
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
            By clicking continue, you agree to our <Link href="https://chapterstreet.co/terms" target="_blank" className="underline underline-offset-4">Terms of Service</Link>{" "}
            and <Link href="https://chapterstreet.co/privacy" target="_blank" className="underline underline-offset-4">Privacy Policy</Link>.
            </div>
        </div>
        </div>
    )
}
