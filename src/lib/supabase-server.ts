import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';

export const createSupabaseServerClient = () =>
  createServerComponentClient<Database>({ cookies });
