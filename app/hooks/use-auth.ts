// hooks/useAuth.ts
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useAuth() {
  const supabase = createClient();
  const [session, setSession] = useState<any>(undefined); // undefined = still loading

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session ?? null);
    });

    return () => listener?.subscription.unsubscribe();
  }, [supabase]);

  return { session, supabase };
}
