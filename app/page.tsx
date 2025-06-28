'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/use-auth';

export default function Home() {
  const { session } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (session === undefined) return;

    if (session) {
      router.replace('/chat');
    } else {
      router.replace('/login');
    }
  }, [session, router]);

  return null;
}
