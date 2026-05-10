import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const typedProfile = profile as {
    id?: string;
    email?: string;
    full_name?: string;
    role?: string;
  } | null;

  const { data: accounts } = await supabase
    .from('account_submissions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <DashboardClient
      user={{ id: user.id, email: user.email ?? '', ...(typedProfile ?? {}) }}
      initialAccounts={(accounts as any) ?? []}
    />
  );
}
