# PropFirmPassing

Professional prop firm challenge passing service — [propfirmpassing.online](https://propfirmpassing.online)

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Auth + Database:** Supabase (free plan)
- **Email:** Resend
- **Payments:** NowPayments (crypto)
- **Animations:** Framer Motion
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

---

## Setup

### 1. Clone & Install

```bash
git clone https://github.com/clydejnr7-ui/BBB.git
cd BBB
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the full contents of `supabase/migrations/001_initial.sql`
3. After running, set your admin account by running:
   ```sql
   update public.profiles set role = 'admin' where email = 'your@email.com';
   ```

### 3. Configure Resend

1. Sign up at [resend.com](https://resend.com)
2. Add your domain `propfirmpassing.online` and follow DNS verification in Namecheap
3. Get your API key

### 4. Configure NowPayments

1. Sign up at [nowpayments.io](https://nowpayments.io)
2. Get your API key from the dashboard
3. Set your IPN callback URL to: `https://propfirmpassing.online/api/payments/webhook`
4. Copy your IPN secret

### 5. Environment Variables

Set all of these in **Vercel → Project → Settings → Environment Variables**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

RESEND_API_KEY=re_your_key

NOWPAYMENTS_API_KEY=your-nowpayments-key
NOWPAYMENTS_IPN_SECRET=your-ipn-secret

ADMIN_EMAIL=admin@propfirmpassing.online

NEXT_PUBLIC_APP_URL=https://propfirmpassing.online
```

### 6. Deploy to Vercel

1. Push to GitHub: `git push origin main`
2. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
3. Select the repo, set environment variables, deploy
4. In **Vercel → Domains**, add `propfirmpassing.online`

### 7. Configure DNS in Namecheap

Add these DNS records in Namecheap for `propfirmpassing.online`:

| Type | Name | Value |
|------|------|-------|
| CNAME | www | cname.vercel-dns.com |
| A | @ | 76.76.21.21 |

For Resend email verification, add the TXT records Resend provides in their dashboard.

---

## Admin Access

1. Sign up on the site normally with your admin email
2. In Supabase SQL Editor, run:
   ```sql
   update public.profiles set role = 'admin' where email = 'admin@propfirmpassing.online';
   ```
3. Log out and back in — you'll see an **Admin** link in the navbar

## Workflow

1. User signs up → submits account credentials
2. Admin sees the submission → sets a price → changes status to `payment_pending`
3. User sees payment button in dashboard → pays with crypto via NowPayments
4. NowPayments webhook fires → submission auto-moves to `in_progress`
5. Admin trades the account → marks as `passed`
6. User gets email notification with funded account confirmation

---

## Local Development

```bash
cp .env.example .env.local
# Fill in your env vars
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)
