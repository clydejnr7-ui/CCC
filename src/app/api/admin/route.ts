import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { createSupabaseAdmin } from '@/lib/supabase';
import { z } from 'zod';

async function verifyAdmin() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  if (profile?.role !== 'admin') return null;
  return user;
}

export async function GET() {
  const user = await verifyAdmin();
  if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from('account_submissions')
    .select('*, profiles(email, full_name)')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ submissions: data });
}

const updateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['pending', 'in_progress', 'passed', 'failed', 'payment_pending', 'paid']).optional(),
  admin_notes: z.string().optional(),
  price_usd: z.number().nullable().optional(),
});

export async function PATCH(req: NextRequest) {
  const user = await verifyAdmin();
  if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { id, ...updates } = parsed.data;
  const admin = createSupabaseAdmin();

  const updatePayload: Record<string, unknown> = {
    ...updates,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await admin
    .from('account_submissions')
    .update(updatePayload)
    .eq('id', id)
    .select('*, profiles(email, full_name)')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (updates.status === 'passed') {
    try {
      const profile = (data as any).profiles;
      if (profile?.email && process.env.RESEND_API_KEY) {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: 'PropFirmPassing <noreply@propfirmpassing.online>',
          to: profile.email,
          subject: "🎉 Challenge Passed — You're Funded!",
          html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
              <h2 style="color:#22c55e">🎉 Your Challenge Has Been Passed!</h2>
              <p>Hi ${profile.full_name ?? 'Trader'},</p>
              <p>Great news! We have successfully passed your <strong>${(data as any).prop_firm} ${(data as any).account_size} — ${(data as any).challenge_phase}</strong> challenge.</p>
              ${updates.admin_notes ? `<p><strong>Note from our team:</strong> ${updates.admin_notes}</p>` : ''}
              <p>Your funded account credentials should be available from your prop firm platform. Log in to collect your funded account.</p>
              <br/>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background:#22c55e;color:#000;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">View Dashboard</a>
              <br/><br/>
              <p style="color:#666;font-size:12px">Thank you for choosing PropFirmPassing. We look forward to helping you again!</p>
            </div>
          `,
        });
      }
    } catch {
      // Non-fatal
    }
  }

  return NextResponse.json({ submission: data });
}
