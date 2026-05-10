import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase';
import { createHmac } from 'crypto';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('x-nowpayments-sig');

  // Verify IPN signature
  if (process.env.NOWPAYMENTS_IPN_SECRET && signature) {
    const hmac = createHmac('sha512', process.env.NOWPAYMENTS_IPN_SECRET);
    const sorted = JSON.stringify(JSON.parse(body), Object.keys(JSON.parse(body)).sort());
    hmac.update(sorted);
    const computed = hmac.digest('hex');
    if (computed !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
  }

  const data = JSON.parse(body);
  const { order_id, payment_status, payment_id } = data;

  if (!order_id) return NextResponse.json({ ok: true });

  const admin = createSupabaseAdmin();

  const update: Record<string, string> = {
    payment_status,
    updated_at: new Date().toISOString(),
  };

  if (['finished', 'confirmed'].includes(payment_status)) {
    update.status = 'in_progress';
    update.payment_status = 'paid';

    // Send confirmation email to user
    try {
      const { data: submission } = await admin
        .from('account_submissions')
        .select('*, profiles(email, full_name)')
        .eq('id', order_id)
        .single();

      if (submission && process.env.RESEND_API_KEY) {
        const profile = (submission as any).profiles;
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: 'PropFirmPassing <noreply@propfirmpassing.online>',
          to: profile?.email,
          subject: '✅ Payment Confirmed — We\'re Starting Your Challenge!',
          html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
              <h2 style="color:#22c55e">Payment Confirmed!</h2>
              <p>Hi ${profile?.full_name ?? 'Trader'},</p>
              <p>We've received your payment for <strong>${(submission as any).prop_firm} ${(submission as any).account_size} — ${(submission as any).challenge_phase}</strong>.</p>
              <p>Our trading team has started working on your account. We'll send you another email once the challenge is passed.</p>
              <p><strong>Estimated timeline:</strong> 3–7 business days</p>
              <br/>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background:#22c55e;color:#000;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">View Dashboard</a>
              <br/><br/>
              <p style="color:#666;font-size:12px">PropFirmPassing · propfirmpassing.online</p>
            </div>
          `,
        });
      }
    } catch {
      // Non-fatal
    }
  } else if (['failed', 'refunded', 'expired'].includes(payment_status)) {
    update.status = 'payment_pending';
  }

  await admin
    .from('account_submissions')
    .update(update)
    .eq('id', order_id);

  return NextResponse.json({ ok: true });
}
