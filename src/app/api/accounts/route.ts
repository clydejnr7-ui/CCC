import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { z } from 'zod';

const submitSchema = z.object({
  prop_firm: z.string().min(1),
  account_size: z.string().min(1),
  challenge_phase: z.string().min(1),
  trading_platform: z.string().min(1),
  login_id: z.string().min(1),
  password: z.string().min(1),
  server: z.string().min(1),
  investor_password: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('account_submissions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ accounts: data });
}

export async function POST(req: NextRequest) {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = submitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('account_submissions')
    .insert({ user_id: user.id, ...parsed.data, status: 'pending' })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  try {
    if (process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL) {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: 'PropFirmPassing <noreply@propfirmpassing.online>',
        to: process.env.ADMIN_EMAIL,
        subject: `New Account Submission — ${data.prop_firm} ${data.account_size}`,
        html: `
          <h2>New Account Submission</h2>
          <p><strong>Prop Firm:</strong> ${data.prop_firm}</p>
          <p><strong>Account Size:</strong> ${data.account_size}</p>
          <p><strong>Phase:</strong> ${data.challenge_phase}</p>
          <p><strong>Platform:</strong> ${data.trading_platform}</p>
          <p><strong>Server:</strong> ${data.server}</p>
          <p><strong>Login ID:</strong> ${data.login_id}</p>
          <p><strong>User ID:</strong> ${user.id}</p>
          <br/>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin">View in Admin Panel</a>
        `,
      });
    }
  } catch {
    // Non-fatal
  }

  return NextResponse.json({ account: data }, { status: 201 });
}
