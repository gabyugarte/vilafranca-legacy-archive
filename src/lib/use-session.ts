import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return { session, loading };
}
export function useIsAdmin() {
  const { session, loading } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  // Identificamos al usuario por su ID, no por el objeto session completo.
  const userId = session?.user.id ?? null;

  useEffect(() => {
    if (loading) return;

    if (!userId) {
      setIsAdmin(false);
      setChecking(false);
      return;
    }

    setChecking(true);
    let active = true;

    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle()
      .then(({ data, error }) => {
        if (!active) return;

        setIsAdmin(!error && !!data);
        setChecking(false);
      });

    return () => {
      active = false;
    };
  }, [userId, loading]);

  return { isAdmin, session, loading: loading || checking };
}
