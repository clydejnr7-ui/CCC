'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { formatDate, getDaysRemaining, getProgressPercent, STATUS_COLORS, STATUS_LABELS } from '@/lib/utils';
import { RabbitProgressBar, CountdownTimer } from '@/components/animations/RabbitAnimation';
import { ChevronDown, ChevronUp, Bitcoin, ExternalLink, Clock, RefreshCw } from 'lucide-react';
import type { AccountSubmission } from '@/types/database';
import { toast } from 'sonner';

interface AccountTableProps {
  accounts: AccountSubmission[];
  onRefresh: () => void;
}

function PayButton({ account }: { account: AccountSubmission }) {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submission_id: account.id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Payment creation failed');
      if (json.payment_url) {
        window.open(json.payment_url, '_blank');
      } else {
        toast.info('Payment link sent to your email');
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePay}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 hover:bg-orange-500/20 transition-all text-sm font-medium disabled:opacity-60"
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-orange-400/30 border-t-orange-400 rounded-full animate-spin" />
      ) : (
        <Bitcoin className="w-4 h-4" />
      )}
      Pay with Crypto
    </button>
  );
}

function AccountRow({ account }: { account: AccountSubmission }) {
  const [expanded, setExpanded] = useState(false);
  const daysRemaining = getDaysRemaining(account.created_at);
  const progress = getProgressPercent(account.created_at);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl border border-white/5 overflow-hidden mb-3"
    >
      {/* Main row */}
      <div
        className="flex items-center gap-4 p-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="font-semibold text-white text-sm">{account.prop_firm}</span>
            <span className="text-slate-500 text-xs">·</span>
            <span className="text-slate-400 text-xs">{account.account_size}</span>
            <span className="text-slate-500 text-xs">·</span>
            <span className="text-slate-400 text-xs">{account.challenge_phase}</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">{formatDate(account.created_at)}</p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <span className={`status-badge ${STATUS_COLORS[account.status]}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {STATUS_LABELS[account.status]}
          </span>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          )}
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-white/5 p-4 space-y-5"
        >
          {/* Progress */}
          {(account.status === 'in_progress' || account.status === 'pending') && (
            <div>
              <RabbitProgressBar
                progress={progress}
                daysRemaining={daysRemaining}
                totalDays={7}
                size="sm"
              />
              <div className="mt-3 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-xs text-slate-500">Time remaining:</span>
                <CountdownTimer targetDate={account.created_at} />
              </div>
            </div>
          )}

          {/* Account details grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: 'Platform', value: account.trading_platform },
              { label: 'Server', value: account.server },
              { label: 'Login ID', value: account.login_id },
              { label: 'Price', value: account.price_usd ? `$${account.price_usd}` : 'TBD' },
              { label: 'Phase', value: account.challenge_phase },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white/[0.02] rounded-lg p-3">
                <p className="text-xs text-slate-500 mb-1">{label}</p>
                <p className="text-sm font-medium text-white">{value}</p>
              </div>
            ))}
          </div>

          {/* Admin notes */}
          {account.admin_notes && (
            <div className="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/15">
              <p className="text-xs font-semibold text-blue-400 mb-1">Update from our team</p>
              <p className="text-sm text-slate-300">{account.admin_notes}</p>
            </div>
          )}

          {/* Notes */}
          {account.notes && (
            <div>
              <p className="text-xs text-slate-500 mb-1">Your notes</p>
              <p className="text-sm text-slate-400">{account.notes}</p>
            </div>
          )}

          {/* Payment CTA */}
          {account.status === 'payment_pending' && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-orange-500/5 border border-orange-500/15">
              <div className="flex-1">
                <p className="text-sm font-semibold text-orange-400">Payment Required</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {account.price_usd ? `$${account.price_usd} due` : 'Amount set by admin'} · Pay with crypto to start immediately
                </p>
              </div>
              <PayButton account={account} />
            </div>
          )}

          {/* Passed message */}
          {account.status === 'passed' && (
            <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20 text-center">
              <div className="text-2xl mb-2">🎉</div>
              <p className="text-sm font-semibold text-green-400">Challenge Passed!</p>
              <p className="text-xs text-slate-400 mt-1">
                Congratulations — your funded account is ready. Check your email for next steps.
              </p>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

export default function AccountTable({ accounts, onRefresh }: AccountTableProps) {
  if (accounts.length === 0) {
    return (
      <div className="glass rounded-2xl p-12 text-center border border-white/5">
        <div className="text-5xl mb-4">🐇</div>
        <h3 className="text-lg font-semibold text-white mb-2">No Accounts Yet</h3>
        <p className="text-sm text-slate-400 max-w-xs mx-auto">
          Submit your first prop firm account above and let our experts handle the challenge for you.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-400">{accounts.length} submission{accounts.length !== 1 ? 's' : ''}</p>
        <button
          onClick={onRefresh}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>
      {accounts.map((account) => (
        <AccountRow key={account.id} account={account} />
      ))}
    </div>
  );
}
