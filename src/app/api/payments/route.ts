import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { createSupabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { submission_id } = body;

  if (!submission_id) {
    return NextResponse.json({ error: 'submission_id required' }, { status: 400 });
  }

  const { data: submission, error: fetchError } = await supabase
    .from('account_submissions')
    .select('*')
    .eq('id', submission_id)
    .eq('user_id', user.id)
    .single();

  if (fetchError || !submission) {
    return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
  }

  if (!(submission as any).price_usd) {
    return NextResponse.json({ error: 'Price not set yet — our team will update it shortly' }, { status: 400 });
  }

  if (!process.env.NOWPAYMENTS_API_KEY) {
    return NextResponse.json({ error: 'Payment gateway not configured' }, { status: 503 });
  }

  try {
    const s = submission as any;
    const npRes = await fetch('https://api.nowpayments.io/v1/invoice', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.NOWPAYMENTS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        price_amount: s.price_usd,
        price_currency: 'usd',
        pay_currency: 'usdttrc20',
        order_id: s.id,
        order_description: `PropFirmPassing — ${s.prop_firm} ${s.account_size} ${s.challenge_phase}`,
        ipn_callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/webhook`,
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=cancelled`,
      }),
    });

    if (!npRes.ok) {
      const errText = await npRes.text();
      throw new Error(`NowPayments error: ${errText}`);
    }

    const npData = await npRes.json();

    const admin = createSupabaseAdmin();
    await admin
      .from('account_submissions')
      .update
