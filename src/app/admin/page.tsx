import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import AdminClient from './AdminClient';

export default async function AdminPage() {
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

  if (profile?.role !== 'admin') redirect('/dashboard');

  const { data: submissions } = await supabase
    .from('account_submissions')
    .select('*, profiles(email, full_name)')
    .order('created_at', { ascending: false });

  return <AdminClient initialSubmissions={(submissions as any) ?? []} />;
}
