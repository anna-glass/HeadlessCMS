'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function UserAvatar() {
  const { session } = useAuth();
  const router = useRouter();

  if (!session?.user) {
    return null;
  }

  const handleClick = () => {
    router.push('/profile');
  };

  // Get initials from email or name
  const getInitials = () => {
    const email = session.user.email || '';
    const name = session.user.user_metadata?.full_name || '';
    
    if (name) {
      return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    }
    
    return email.slice(0, 2).toUpperCase();
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <Avatar 
        className="w-10 h-10 cursor-pointer hover:scale-110 transition-transform duration-200 border-2 border-gray-200 hover:border-gray-300"
        onClick={handleClick}
      >
        <AvatarImage 
          src={session.user.user_metadata?.avatar_url} 
          alt={session.user.email || 'User'} 
        />
        <AvatarFallback className="bg-blue-500 text-white font-semibold">
          {getInitials()}
        </AvatarFallback>
      </Avatar>
    </div>
  );
} 