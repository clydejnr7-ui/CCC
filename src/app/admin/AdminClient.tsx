'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, TrendingUp, Clock, CheckCircle2, AlertCircle, Wallet, RefreshCw } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import SubmissionsTable from '@/components/admin/SubmissionsTable';
import type { AccountSubmission } from '@/types/database';

interface Props {
  initialSubmissions: (AccountSubmission & { profiles?: { email: string; full_name: string | null } })[];
}

export default function AdminClient({ initialSubmissions }: Props) {
  const [submissions, setSubmissions] = useState(initialSubmissions);

  const refresh = useCallback(async () => {
    const res = await fetch('/api/admin');
    if (res.ok) {
      const data = await res.json();
      setSubmissions(data.submissions ?? []);
    }
  }, []);

  const stats = {
    total: submissions.length,
    pending: submissions.filter((s) => s.status === 'pending').length,
    inProgress: submissions.filter((s) => s.status === 'in_progress').length,
    passed: submissions.filter((s) => s.status === 'passed').length,
    awaitingPayment: submissions.filter((s) => s.status === 'payment_pending').length,
    failed: submissions.filter((s) => s.status === 'failed').length,
  };

  const STAT_CARDS = [
    { label: 'Total', value: stats.total, icon: TrendingUp, color: 'text-slate-300', bg: 'bg-slate-300/10' },
    { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { label: 'In Progress', value: stats.inProgress, icon: Clock, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Passed', value: stats.passed, icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-400/10' },
    { label: 'Awaiting Pay', value: stats.awaitingPayment, icon: Wallet, color: 'text-orange-400', bg: 'bg-orange-400/10' },
    { label: 'Failed', value: stats.failed, icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-400/10' },
  ];

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar isLoggedIn isAdmin />

      {/* Header */}
      <div className="border-b border-white/5 bg-dark-800/50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-400/10 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-white">Admin Panel</h1>
                <p className="text-slate-400 text-sm">PropFirmPassing · Management Dashboard</p>
              </div>
            </div>
            <button
              onClick={refresh}
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {STAT_CARDS.map(({ label, value, icon: Icon, color, bg }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="glass rounded-xl p-3.5 border border-white/5 text-center"
            >
              <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center mx-auto mb-2`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <div className="text-xl font-display font-bold text-white">{value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{label}</div>
            </motion.div>
          ))}
        </div>

        {/* Revenue estimate */}
        <div className="glass rounded-xl p-4 border border-white/5 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">Estimated Revenue</p>
              <p className="text-2xl font-display font-bold gradient-text mt-1">
                ${submissions
                  .filter((s) => ['paid', 'in_progress', 'passed'].includes(s.status) && s.price_usd)
                  .reduce((acc, s) => acc + (s.price_usd ?? 0), 0)
                  .toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">Pending payments</p>
              <p className="text-lg font-semibold text-orange-400 mt-1">
                ${submissions
                  .filter((s) => s.status === 'payment_pending' && s.price_usd)
                  .reduce((acc, s) => acc + (s.price_usd ?? 0), 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Submissions table */}
        <div>
          <h2 className="text-lg font-display font-bold text-white mb-4">All Submissions</h2>
          <SubmissionsTable submissions={submissions} onRefresh={refresh} />
        </div>
      </div>
    </div>
  );
}
