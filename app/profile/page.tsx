'use client';

import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/app/hooks/use-auth'
import { useEffect } from 'react'
import { logout } from '@/app/login/actions'
import { ArrowLeftIcon, ChevronLeftIcon } from '@radix-ui/react-icons';

export default function ProfilePage() {
  const { session } = useAuth()

  useEffect(() => {
    if (session === undefined) return; // wait for Supabase
    if (session === null) {
      redirect('/login')
    }
  }, [session])

  if (!session?.user) {
    return null; // or a loading spinner
  }

  const user = session.user

  // Get initials from email or name
  const getInitials = () => {
    const email = user.email || '';
    const name = user.user_metadata?.full_name || '';
    
    if (name) {
      return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    }
    
    return email.slice(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-left flex flex-row gap-4">
        <Button 
              variant="ghost"
              onClick={() => window.history.back()}
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </Button>
          <CardTitle className="text-2xl font-medium">Profile</CardTitle>
          
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-row items-left space-y-4 gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage 
                src={user.user_metadata?.avatar_url} 
                alt={user.email || 'User'} 
              />
              <AvatarFallback className="bg-blue-500 text-white text-xl font-semibold">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            
            <div className="text-left">
              <h3 className="text-lg font-semibold">
                {user.user_metadata?.full_name || 'User'}
              </h3>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-sm">Created: {new Date(user.created_at).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="pt-4 space-y-3 flex flex-row gap-2">
            <form action={logout}>
              <Button 
                type="submit"
                className="w-full" 
                variant="destructive"
              >
                Logout
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}